/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDQL_DIAGNOSTIC_CODES } from "@hdml/types";
import { performance } from "perf_hooks";
import { parseFragment } from "parse5";
import { HdqlDiagnostic } from "./diagnostics";
import { elementPath } from "./hdmlTreeAdapter/elementPath";
import { hdmlTreeAdapter } from "./hdmlTreeAdapter/hdmlTreeAdapter";
import { parseHDML } from "./parseHDML";
import {
  Element,
  HDMLTreeAdapterMap,
  ParentNode,
} from "./types/HDMLTreeAdapterMap";

const html = `
  <!doctype html>
  <html itemtype="http://schema.org/WebPage" lang="en-US">
    <head></head>
    <body>
      Content
    </body>
  </html>
`;

const hdml = `
  <!-- Connections -------------------------------------------------->
  <div>
    <hdml-connection
      name="db1"
      type="postgresql"
      host="example.com"
      user="user"
      password="pass">
    </hdml-connection>

    <hdml-connection
      name="db2"
      description="MongoDB test connection"
      type="mongodb"
      host="example.com"
      user="user"
      password="pass"
      ssl="true"
      schema="data_schema">
    </hdml-connection>
  </div>

  <!-- HDML Data model ---------------------------------------------->
  <hdml-model
    name="maang_stock">

    <!-- Tables -->
    <div>
      <!-- Amazon stock table -->
      <hdml-dataset
        name="amazon"
        type="table"
        identifier="\`tenant_postgres\`.\`public\`.\`amazon_stock\`">

        <hdml-field
          name="open">
        </hdml-field>

        <hdml-field
          name="high">
        </hdml-field>

        <hdml-field
          name="low">
        </hdml-field>
        
        <hdml-field
          name="close">
        </hdml-field>
        
        <hdml-field
          name="adj_close">
        </hdml-field>
        
        <hdml-field
          name="volume">
        </hdml-field>
        
        <hdml-field
          name="date">
        </hdml-field>
      </hdml-dataset>

      <!-- Apple stock table -->
      <hdml-dataset
        name="apple"
        type="table"
        identifier="\`tenant_postgres\`.\`public\`.\`apple_stock\`">

        <hdml-field
          name="open">
        </hdml-field>

        <hdml-field
          name="high">
        </hdml-field>

        <hdml-field
          name="low">
        </hdml-field>
        
        <hdml-field
          name="close">
        </hdml-field>
        
        <hdml-field
          name="adj_close">
        </hdml-field>
        
        <hdml-field
          name="volume">
        </hdml-field>
        
        <hdml-field
          name="date">
        </hdml-field>
      </hdml-dataset>

      <!-- Google stock table -->
      <hdml-dataset
        name="google"
        type="table"
        identifier="\`tenant_postgres\`.\`public\`.\`google_stock\`">

        <hdml-field
          name="open">
        </hdml-field>

        <hdml-field
          name="high">
        </hdml-field>

        <hdml-field
          name="low">
        </hdml-field>
        
        <hdml-field
          name="close">
        </hdml-field>
        
        <hdml-field
          name="adj_close">
        </hdml-field>
        
        <hdml-field
          name="volume">
        </hdml-field>
        
        <hdml-field
          name="date">
        </hdml-field>
      </hdml-dataset>

      <!-- Microsoft stock table -->
      <hdml-dataset
        name="microsoft"
        type="table"
        identifier="\`tenant_postgres\`.\`public\`.\`microsoft_stock\`">

        <hdml-field
          name="open">
        </hdml-field>

        <hdml-field
          name="high">
        </hdml-field>

        <hdml-field
          name="low">
        </hdml-field>
        
        <hdml-field
          name="close">
        </hdml-field>
        
        <hdml-field
          name="adj_close">
        </hdml-field>
        
        <hdml-field
          name="volume">
        </hdml-field>
        
        <hdml-field
          name="date">
        </hdml-field>
      </hdml-dataset>

      <!-- Netflix stock table -->
      <hdml-dataset
        name="netflix"
        type="table"
        identifier="\`tenant_postgres\`.\`public\`.\`netflix_stock\`">

        <hdml-field
          name="open">
        </hdml-field>

        <hdml-field
          name="high">
        </hdml-field>

        <hdml-field
          name="low">
        </hdml-field>
        
        <hdml-field
          name="close">
        </hdml-field>
        
        <hdml-field
          name="adj_close">
        </hdml-field>
        
        <hdml-field
          name="volume">
        </hdml-field>
        
        <hdml-field
          name="date">
        </hdml-field>
      </hdml-dataset>
    </div>

    <!-- Joins -->
    <div>
      <!-- Join amazon with apple -->
      <hdml-join
        type="full-outer"
        left="amazon"
        right="apple">
        <hdml-connective
          operator="and">
          <hdml-filter
            type="keys"
            left="date"
            right="date">
          </hdml-filter>
          <hdml-connective
            operator="or">
            <hdml-filter
              type="expr"
              clause="1 = 1">
            </hdml-filter>
            <hdml-filter
              type="expr"
              clause="2 = 2">
            </hdml-filter>
          </hdml-connective>
        </hdml-connective>
      </hdml-join>

      <!-- Join google with apple -->
      <hdml-join
        type="full-outer"
        left="google"
        right="apple">
        <hdml-connective
          operator="and">
          <hdml-filter
            type="keys"
            left="date"
            right="date">
          </hdml-filter>
        </hdml-connective>
      </hdml-join>

      <!-- Join google with microsoft -->
      <hdml-join
        type="full-outer"
        left="google"
        right="microsoft">
        <hdml-connective
          operator="and">
          <hdml-filter
            type="keys"
            left="date"
            right="date">
          </hdml-filter>
        </hdml-connective>
      </hdml-join>

      <!-- Join microsoft with netflix -->
      <hdml-join
        type="full-outer"
        left="microsoft"
        right="netflix">
        <hdml-connective
          operator="and">
          <hdml-filter
            type="keys"
            left="date"
            right="date">
          </hdml-filter>
        </hdml-connective>
      </hdml-join>
    </div>
  </hdml-model>

  <!-- HDML Data frame ---------------------------------------------->
  <hdml-frame
    name="maang_stock"
    source="/maang/model.html?hdml-model=maang_stock">

    <!-- dates -->
    <hdml-field
      name="year"
      clause="
        cast(
          date_format(
            coalesce(
              \`amazon_date\`,
              \`apple_date\`,
              \`google_date\`,
              \`microsoft_date\`,
              \`netflix_date\`
            ),
            '%Y'
          ) as smallint
        )">
    </hdml-field>
    <hdml-field
      name="month"
      clause="
        cast(
          date_format(
            coalesce(
              \`amazon_date\`,
              \`apple_date\`,
              \`google_date\`,
              \`microsoft_date\`,
              \`netflix_date\`
            ),
            '%m'
          ) as smallint
        )">
    </hdml-field>
    <hdml-field
      name="day"
      clause="
        cast(
          date_format(
            coalesce(
              \`amazon_date\`,
              \`apple_date\`,
              \`google_date\`,
              \`microsoft_date\`,
              \`netflix_date\`
            ),
            '%d'
          ) as smallint
        )">
    </hdml-field>

    <!-- amazon -->
    <hdml-field
      name="amazon_open"
      origin="amazon_open">
    </hdml-field>
    <hdml-field
      name="amazon_high"
      origin="amazon_high">
    </hdml-field>
    <hdml-field
      name="amazon_low"
      origin="amazon_low">
    </hdml-field>
    <hdml-field
      name="amazon_close"
      origin="amazon_close">
    </hdml-field>
    <hdml-field
      name="amazon_adj_close"
      origin="amazon_adj_close">
    </hdml-field>
    <hdml-field
      name="amazon_volume"
      origin="amazon_volume">
    </hdml-field>

    <!-- apple -->
    <hdml-field
      name="apple_open"
      origin="apple_open">
    </hdml-field>
    <hdml-field
      name="apple_high"
      origin="apple_high">
    </hdml-field>
    <hdml-field
      name="apple_low"
      origin="apple_low">
    </hdml-field>
    <hdml-field
      name="apple_close"
      origin="apple_close">
    </hdml-field>
    <hdml-field
      name="apple_adj_close"
      origin="apple_adj_close">
    </hdml-field>
    <hdml-field
      name="apple_volume"
      origin="apple_volume">
    </hdml-field>

    <!-- google -->
    <hdml-field
      name="google_open"
      origin="google_open">
    </hdml-field>
    <hdml-field
      name="google_high"
      origin="google_high">
    </hdml-field>
    <hdml-field
      name="google_low"
      origin="google_low">
    </hdml-field>
    <hdml-field
      name="google_close"
      origin="google_close">
    </hdml-field>
    <hdml-field
      name="google_adj_close"
      origin="google_adj_close">
    </hdml-field>
    <hdml-field
      name="google_volume"
      origin="google_volume">
    </hdml-field>

    <!-- microsoft -->
    <hdml-field
      name="microsoft_open"
      origin="microsoft_open">
    </hdml-field>
    <hdml-field
      name="microsoft_high"
      origin="microsoft_high">
    </hdml-field>
    <hdml-field
      name="microsoft_low"
      origin="microsoft_low">
    </hdml-field>
    <hdml-field
      name="microsoft_close"
      origin="microsoft_close">
    </hdml-field>
    <hdml-field
      name="microsoft_adj_close"
      origin="microsoft_adj_close">
    </hdml-field>
    <hdml-field
      name="microsoft_volume"
      origin="microsoft_volume">
    </hdml-field>

    <!-- netflix -->
    <hdml-field
      name="netflix_open"
      origin="netflix_open">
    </hdml-field>
    <hdml-field
      name="netflix_high"
      origin="netflix_high">
    </hdml-field>
    <hdml-field
      name="netflix_low"
      origin="netflix_low">
    </hdml-field>
    <hdml-field
      name="netflix_close"
      origin="netflix_close">
    </hdml-field>
    <hdml-field
      name="netflix_adj_close"
      origin="netflix_adj_close">
    </hdml-field>
    <hdml-field
      name="netflix_volume"
      origin="netflix_volume">
    </hdml-field>

    <!-- Filters -->
    <hdml-filter-by>
      <hdml-connective
        operator="or">
        <hdml-connective
          operator="and">
          <hdml-filter
            type="expr"
            clause="1 = 1">
          </hdml-filter>
          <hdml-filter
            type="named"
            name="equals"
            field="year"
            values="2021">
          </hdml-filter>
        </hdml-connective>
        <hdml-connective
          operator="and">
          <hdml-filter
            type="expr"
            clause="1 = 1">
          </hdml-filter>
          <hdml-filter
            type="expr"
            clause="\`maang_stock\`.\`year\` = 2021">
          </hdml-filter>
        </hdml-connective>
      </hdml-connective>
    </hdml-filter-by>

    <!-- Group By -->
    <hdml-group-by>
      <hdml-field
        name="year">
      </hdml-field>
      <hdml-field
        name="month">
      </hdml-field>
      <hdml-field
        name="day">
      </hdml-field>
    </hdml-group-by>

    <!-- Sort By -->
    <hdml-sort-by>
      <hdml-field
        name="year"
        order="asc">
      </hdml-field>
      <hdml-field
        name="month"
        order="asc">
      </hdml-field>
      <hdml-field
        name="day"
        order="desc">
      </hdml-field>
    </hdml-sort-by>

    <!-- Split By -->
    <hdml-split-by>
      <hdml-field
        name="year">
      </hdml-field>
    </hdml-split-by>

  </hdml-frame>
`;

describe("The `parseHDML` function", () => {
  it("sould return empty HDDM object if no HDML tags in HTML document", () => {
    const hddm = parseHDML(html);

    expect(hddm).toEqual({
      connections: [],
      models: [],
      frames: [],
    });
  });

  it("shoud parse HDML string", () => {
    const hddm = parseHDML(hdml);
    expect(hddm).toEqual({
      connections: [
        {
          name: "db1",
          description: null,
          options: {
            connector: 0,
            parameters: {
              host: "example.com",
              user: "user",
              password: "pass",
              ssl: false,
            },
          },
        },
        {
          name: "db2",
          description: "MongoDB test connection",
          options: {
            connector: 12,
            parameters: {
              host: "example.com",
              port: 27017,
              user: "user",
              password: "pass",
              ssl: true,
              schema: "data_schema",
            },
          },
        },
      ],
      models: [
        {
          name: "maang_stock",
          description: null,
          tables: [
            {
              name: "amazon",
              description: null,
              type: 0,
              identifier: '"tenant_postgres"."public"."amazon_stock"',
              fields: [
                {
                  name: "open",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "high",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "low",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "adj_close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "volume",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "date",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
              ],
            },
            {
              name: "apple",
              description: null,
              type: 0,
              identifier: '"tenant_postgres"."public"."apple_stock"',
              fields: [
                {
                  name: "open",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "high",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "low",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "adj_close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "volume",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "date",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
              ],
            },
            {
              name: "google",
              description: null,
              type: 0,
              identifier: '"tenant_postgres"."public"."google_stock"',
              fields: [
                {
                  name: "open",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "high",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "low",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "adj_close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "volume",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "date",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
              ],
            },
            {
              name: "microsoft",
              description: null,
              type: 0,
              identifier:
                '"tenant_postgres"."public"."microsoft_stock"',
              fields: [
                {
                  name: "open",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "high",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "low",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "adj_close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "volume",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "date",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
              ],
            },
            {
              name: "netflix",
              description: null,
              type: 0,
              identifier:
                '"tenant_postgres"."public"."netflix_stock"',
              fields: [
                {
                  name: "open",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "high",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "low",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "adj_close",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "volume",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
                {
                  name: "date",
                  description: null,
                  origin: null,
                  clause: null,
                  type: {
                    type: 0,
                  },
                  aggregation: 0,
                  order: 0,
                  key: null,
                },
              ],
            },
          ],
          joins: [
            {
              description: null,
              type: 5,
              left: "amazon",
              right: "apple",
              clause: {
                type: 1,
                filters: [
                  {
                    type: 1,
                    options: {
                      left: "date",
                      right: "date",
                    },
                  },
                ],
                children: [
                  {
                    type: 0,
                    filters: [
                      {
                        type: 0,
                        options: {
                          clause: "1 = 1",
                        },
                      },
                      {
                        type: 0,
                        options: {
                          clause: "2 = 2",
                        },
                      },
                    ],
                    children: [],
                  },
                ],
              },
            },
            {
              description: null,
              type: 5,
              left: "google",
              right: "apple",
              clause: {
                type: 1,
                filters: [
                  {
                    type: 1,
                    options: {
                      left: "date",
                      right: "date",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              description: null,
              type: 5,
              left: "google",
              right: "microsoft",
              clause: {
                type: 1,
                filters: [
                  {
                    type: 1,
                    options: {
                      left: "date",
                      right: "date",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              description: null,
              type: 5,
              left: "microsoft",
              right: "netflix",
              clause: {
                type: 1,
                filters: [
                  {
                    type: 1,
                    options: {
                      left: "date",
                      right: "date",
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [
        {
          name: "maang_stock",
          description: null,
          source: "/maang/model.html?hdml-model=maang_stock",
          offset: 0,
          limit: 100000,
          fields: [
            {
              name: "year",
              description: null,
              origin: null,
              clause:
                '\n        cast(\n          date_format(\n            coalesce(\n              "amazon_date",\n              "apple_date",\n              "google_date",\n              "microsoft_date",\n              "netflix_date"\n            ),\n            \'%Y\'\n          ) as smallint\n        )',
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "month",
              description: null,
              origin: null,
              clause:
                '\n        cast(\n          date_format(\n            coalesce(\n              "amazon_date",\n              "apple_date",\n              "google_date",\n              "microsoft_date",\n              "netflix_date"\n            ),\n            \'%m\'\n          ) as smallint\n        )',
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "day",
              description: null,
              origin: null,
              clause:
                '\n        cast(\n          date_format(\n            coalesce(\n              "amazon_date",\n              "apple_date",\n              "google_date",\n              "microsoft_date",\n              "netflix_date"\n            ),\n            \'%d\'\n          ) as smallint\n        )',
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "amazon_open",
              description: null,
              origin: "amazon_open",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "amazon_high",
              description: null,
              origin: "amazon_high",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "amazon_low",
              description: null,
              origin: "amazon_low",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "amazon_close",
              description: null,
              origin: "amazon_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "amazon_adj_close",
              description: null,
              origin: "amazon_adj_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "amazon_volume",
              description: null,
              origin: "amazon_volume",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "apple_open",
              description: null,
              origin: "apple_open",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "apple_high",
              description: null,
              origin: "apple_high",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "apple_low",
              description: null,
              origin: "apple_low",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "apple_close",
              description: null,
              origin: "apple_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "apple_adj_close",
              description: null,
              origin: "apple_adj_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "apple_volume",
              description: null,
              origin: "apple_volume",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "google_open",
              description: null,
              origin: "google_open",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "google_high",
              description: null,
              origin: "google_high",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "google_low",
              description: null,
              origin: "google_low",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "google_close",
              description: null,
              origin: "google_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "google_adj_close",
              description: null,
              origin: "google_adj_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "google_volume",
              description: null,
              origin: "google_volume",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "microsoft_open",
              description: null,
              origin: "microsoft_open",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "microsoft_high",
              description: null,
              origin: "microsoft_high",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "microsoft_low",
              description: null,
              origin: "microsoft_low",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "microsoft_close",
              description: null,
              origin: "microsoft_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "microsoft_adj_close",
              description: null,
              origin: "microsoft_adj_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "microsoft_volume",
              description: null,
              origin: "microsoft_volume",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "netflix_open",
              description: null,
              origin: "netflix_open",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "netflix_high",
              description: null,
              origin: "netflix_high",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "netflix_low",
              description: null,
              origin: "netflix_low",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "netflix_close",
              description: null,
              origin: "netflix_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "netflix_adj_close",
              description: null,
              origin: "netflix_adj_close",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "netflix_volume",
              description: null,
              origin: "netflix_volume",
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
          ],
          filter_by: {
            type: 0,
            filters: [],
            children: [
              {
                type: 1,
                filters: [
                  {
                    type: 0,
                    options: {
                      clause: "1 = 1",
                    },
                  },
                  {
                    type: 2,
                    options: {
                      name: 0,
                      field: "year",
                      values: ["2021"],
                    },
                  },
                ],
                children: [],
              },
              {
                type: 1,
                filters: [
                  {
                    type: 0,
                    options: {
                      clause: "1 = 1",
                    },
                  },
                  {
                    type: 0,
                    options: {
                      clause: '"maang_stock"."year" = 2021',
                    },
                  },
                ],
                children: [],
              },
            ],
          },
          group_by: [
            {
              name: "year",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "month",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
            {
              name: "day",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
          ],
          sort_by: [
            {
              name: "year",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 1,
              key: null,
            },
            {
              name: "month",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 1,
              key: null,
            },
            {
              name: "day",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 2,
              key: null,
            },
          ],
          split_by: [
            {
              name: "year",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: 0,
              },
              aggregation: 0,
              order: 0,
              key: null,
            },
          ],
        },
      ],
    });
  });

  it("should parse provided HDML string in less then 15ms (100 iter)", () => {
    const measures: number[] = [];

    for (let i = 0; i < 100; i++) {
      const start = performance.now();
      parseHDML(hdml);
      measures.push(performance.now() - start);
    }
    const avg =
      measures.reduce((a, b) => a + b, 0) / measures.length || 0;

    expect(avg).toBeLessThan(15);
  });

  it("should parse provided HDML string in less then 5ms (1000 iter)", () => {
    const measures: number[] = [];

    for (let i = 0; i < 1000; i++) {
      const start = performance.now();
      parseHDML(hdml);
      measures.push(performance.now() - start);
    }
    const avg =
      measures.reduce((a, b) => a + b, 0) / measures.length || 0;

    expect(avg).toBeLessThan(5);
  });
});

// ---------------------------------------------------------------
// 019 step 09 -- the first HDQL parse diagnostic.
//
// ★ Every document here carries wrapper markup. A flat HDML
// document cannot test an anchor: at step 08 eleven path gates
// passed against a path that was wrong, because every test
// document had its HDML elements as each other's direct children,
// and the live corpus wraps everything in `<div id="hdml"><div>`.
// ---------------------------------------------------------------

/** A document whose SECOND `<hdml-field>` has no `name`. */
const dropped = `
  <div id="hdml">
    <div>
      <hdml-model name="m">
        <hdml-dataset name="d" type="table" identifier="t">
          <div><hdml-field name="ok"></hdml-field></div>
          <div><hdml-field type="int32"></hdml-field></div>
        </hdml-dataset>
      </hdml-model>
    </div>
  </div>
`;

/** The same document with the second field named. */
const clean = dropped.replace('type="int32"', 'name="also"');

/**
 * The one-based line, one-based column and zero-based offset of
 * `needle` in `src`. Derived rather than hard-coded, so the gate
 * does not move when the literal above is re-indented.
 */
function at(
  src: string,
  needle: string,
): { line: number; column: number; offset: number } {
  const offset = src.indexOf(needle);
  return {
    line: src.slice(0, offset).split("\n").length,
    column: offset - src.lastIndexOf("\n", offset),
    offset,
  };
}

const FIELD_PATH = "hdml-model[0]/hdml-dataset[0]/hdml-field[1]";
const FIELD_MESSAGE =
  "`<hdml-field>` needs a `name`; this one was dropped.";

describe("HDQL parse diagnostics", () => {
  it("reports the field that vanishes", () => {
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(dropped, d);

    expect(d.length).toBe(1);
    expect(d[0].code).toBe(HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME);
    expect(d[0].severity).toBe("error");
    expect(d[0].message).toBe(FIELD_MESSAGE);
    // ★ The ordinal is [1] even though only [0] survived into
    // `fields`: the path counts TREE siblings, which is what an
    // author needs to hear -- "the second field in that dataset".
    expect(d[0].path).toBe(FIELD_PATH);

    const anchor = at(dropped, '<hdml-field type="int32"');
    expect(d[0].line).toBe(anchor.line);
    expect(d[0].column).toBe(anchor.column);
    expect(d[0].offset).toBe(anchor.offset);

    // ★ The HDOM is unchanged: 019 carries diagnostics, it does
    // not change accept/reject (RFC 019/002 §10.2, D11).
    expect(
      hdom.models[0].tables[0].fields.map((f) => f.name),
    ).toEqual(["ok"]);
  });

  it("does not throw and still returns an HDOM", () => {
    expect(() => parseHDML(dropped)).not.toThrow();
    const hdom = parseHDML(dropped);
    expect(hdom.models.length).toBe(1);
    expect(hdom.models[0].tables[0].fields.length).toBe(1);
  });

  it("returns an empty array for a clean document", () => {
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(clean, d);

    // ★ An empty ARRAY, asserted as one -- never a falsy check
    // that an absent value would also pass. This is the
    // distinction 022 inherits.
    expect(Array.isArray(d)).toBe(true);
    expect(d.length).toBe(0);
    expect(
      hdom.models[0].tables[0].fields.map((f) => f.name),
    ).toEqual(["ok", "also"]);
  });

  it("keeps two parses apart", () => {
    const first: HdqlDiagnostic[] = [];
    const second: HdqlDiagnostic[] = [];
    parseHDML(dropped, first);
    parseHDML(clean, second);
    expect(first.length).toBe(1);
    expect(second.length).toBe(0);
  });

  it("keeps two parses apart in either order", () => {
    const first: HdqlDiagnostic[] = [];
    const second: HdqlDiagnostic[] = [];
    parseHDML(clean, first);
    parseHDML(dropped, second);
    expect(first.length).toBe(0);
    expect(second.length).toBe(1);
  });

  it("does not leak from a parse with no array", () => {
    // ★ A module-level sink that resets itself on EVERY drain is
    // behaviourally a per-parse sink and the two gates above
    // cannot see it -- measured. One that resets only when it
    // drains is a real defect, and this is the observable: a
    // caller that wants no diagnostics still gets a parse, and
    // what that parse dropped may not reach the next caller.
    parseHDML(dropped);
    const d: HdqlDiagnostic[] = [];
    parseHDML(clean, d);
    expect(d.length).toBe(0);
  });

  it("resolves the anchor after the parse, not before", () => {
    const d: HdqlDiagnostic[] = [];
    parseHDML(dropped, d);

    // ★ An anchor read where the diagnostic is PUSHED is read
    // before `appendChild` has run at all, so it is `null`. These
    // four clauses are the whole discrimination.
    expect(d[0].path !== null).toBe(true);
    expect(d[0].path?.includes("div")).toBe(false);
    expect(d[0].path).toBe(FIELD_PATH);
    expect(d[0].offset !== null).toBe(true);
  });

  it("agrees with the path stamped on the element", () => {
    const d: HdqlDiagnostic[] = [];
    parseHDML(dropped, d);

    const fragment = parseFragment<HDMLTreeAdapterMap>(dropped, {
      onParseError: () => {},
      scriptingEnabled: false,
      treeAdapter: hdmlTreeAdapter,
    });
    const found: Element[] = [];
    const visit = (node: ParentNode): void => {
      for (const child of node.childNodes) {
        if (!child) {
          continue;
        }
        if (child.tagName === "hdml-field") {
          found.push(child);
        }
        visit(child);
      }
    };
    visit(fragment);

    expect(found.length).toBe(2);
    expect(found[1].hddmData === null).toBe(true);
    expect(elementPath(found[1])).toBe(d[0].path);
  });
});

// ---------------------------------------------------------------
// 019 step 10 -- the other six helpers, end to end.
//
// ★ Wrapper markup again (C91): `<div id="hdml">`, a `<div>`
// around each HDML element, and a nested `<div>` around the
// dropped field. A flat document cannot test an anchor.
// ---------------------------------------------------------------

/**
 * A document that drops three elements of three different kinds:
 * a model with no `name`, a frame with no `source`, and a field
 * with no `name` inside a dataset that is itself fine.
 */
const threeDrops = `
  <div id="hdml">
    <div>
      <hdml-model></hdml-model>
    </div>
    <div>
      <hdml-model name="m2">
        <hdml-dataset name="d2" type="table" identifier="t2">
          <div><hdml-field type="int32"></hdml-field></div>
        </hdml-dataset>
      </hdml-model>
    </div>
    <div>
      <hdml-frame name="f"></hdml-frame>
    </div>
  </div>
`;

/**
 * ★ The dropped containers above are childless for readability,
 * not out of necessity. Before 019 step 10 they HAD to be:
 * `appendHddmChild` read `parent.hddmData as Model` unguarded at
 * ten sites, so a dropped CONTAINER with any surviving HDML child
 * threw a `TypeError` out of `parseHDML` -- and because
 * `drainDiagnostics` runs only after `parseFragment` returns, the
 * caller got an exception and an EMPTY array, losing the reason
 * the parser had already computed. Ten of thirteen parent/child
 * shapes threw.
 *
 * Step 10 guarded every one of those dereferences (founder
 * decision S13). `CONTAINER_SHAPES` below is the gate.
 */

describe("HDQL parse diagnostics across the vocabulary", () => {
  it("reports three drops of three kinds in order", () => {
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(threeDrops, d);

    // ★ Document order, which is `createElement` order: the
    // nameless model opens first, the nameless field is inside
    // the SECOND model, and the sourceless frame closes.
    expect(d.map((x) => x.code)).toEqual([
      HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME,
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
      HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
    ]);

    for (const one of d) {
      expect(one.severity).toBe("error");
      // ★ Every one is anchored, and no `path` carries a wrapper
      // segment -- the path names HDML elements only.
      expect(one.path !== null).toBe(true);
      expect(one.path?.includes("div")).toBe(false);
      expect(one.line !== null).toBe(true);
      expect(one.column !== null).toBe(true);
      expect(one.offset !== null).toBe(true);
    }

    expect(d[0].path).toBe("hdml-model[0]");
    expect(d[1].path).toBe(
      "hdml-model[1]/hdml-dataset[0]/hdml-field[0]",
    );
    expect(d[2].path).toBe("hdml-frame[0]");

    // ★ Derived from the source, not hard-coded: prettier
    // re-indents test documents.
    const anchor = at(threeDrops, '<hdml-frame name="f"');
    expect(d[2].line).toBe(anchor.line);
    expect(d[2].column).toBe(anchor.column);
    expect(d[2].offset).toBe(anchor.offset);

    // ★ What survived still survived: 019 carries diagnostics, it
    // does not change accept/reject (RFC 019/002 §10.2, D11).
    expect(hdom.models.map((m) => m.name)).toEqual(["m2"]);
    expect(hdom.models[0].tables[0].fields.length).toBe(0);
    expect(hdom.frames.length).toBe(0);
  });

  it("stays empty for the same document made whole", () => {
    const whole = threeDrops
      .replace("<hdml-model>", '<hdml-model name="m1">')
      .replace('type="int32"', 'name="also"')
      .replace(
        '<hdml-frame name="f">',
        '<hdml-frame name="f" source="/s.html">',
      );
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(whole, d);

    expect(Array.isArray(d)).toBe(true);
    expect(d.length).toBe(0);
    expect(hdom.models.map((m) => m.name)).toEqual(["m1", "m2"]);
    expect(hdom.frames.length).toBe(1);
  });
});

/**
 * The four kinds `threeDrops` does NOT reach. ★ Added because
 * negative control 2 -- dropping the `, sink` argument at ONE
 * `buildElement` case -- fired NOTHING: the thirteen
 * `getConnectionData` unit cases call the helper directly, so
 * nothing in the suite exercised four of the six new adapter
 * arguments. Between this document and `threeDrops` all six are
 * covered end to end.
 *
 * ★ Every dropped container here is childless for the same
 * reason as `threeDrops` -- see the note above it.
 */
const fourMoreDrops = `
  <div id="hdml">
    <div>
      <hdml-connection name="c"></hdml-connection>
    </div>
    <div>
      <hdml-model name="m">
        <hdml-dataset name="d" type="table"></hdml-dataset>
        <hdml-join left="a"></hdml-join>
      </hdml-model>
    </div>
    <div>
      <hdml-frame name="f" source="/s.html">
        <hdml-filter-by>
          <hdml-connective operator="and">
            <hdml-filter type="keys" left="a"></hdml-filter>
          </hdml-connective>
        </hdml-filter-by>
      </hdml-frame>
    </div>
  </div>
`;

describe("Every adapter case forwards the sink", () => {
  it("reports a connection, dataset, join and filter", () => {
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(fourMoreDrops, d);

    expect(d.map((x) => x.code)).toEqual([
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTION_ATTRS,
      HDQL_DIAGNOSTIC_CODES.MISSING_DATASET_ATTRS,
      HDQL_DIAGNOSTIC_CODES.MISSING_JOIN_SIDES,
      HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_OPERANDS,
    ]);

    expect(d[0].path).toBe("hdml-connection[0]");
    expect(d[1].path).toBe("hdml-model[0]/hdml-dataset[0]");
    expect(d[2].path).toBe("hdml-model[0]/hdml-join[0]");
    // ★ `hdml-filter-by` and `hdml-connective` DO appear: the
    // path names HDML elements, and those two are HDML elements.
    // Only the wrapper `<div>`s are skipped.
    expect(d[3].path).toBe(
      "hdml-frame[0]/hdml-filter-by[0]/hdml-connective[0]/hdml-filter[0]",
    );

    for (const one of d) {
      expect(one.severity).toBe("error");
      expect(one.path?.includes("div")).toBe(false);
      expect(one.offset !== null).toBe(true);
    }

    // ★ What was dropped stayed dropped; what surrounded it
    // survived (RFC 019/002 §10.2, D11).
    expect(hdom.connections.length).toBe(0);
    expect(hdom.models.length).toBe(1);
    expect(hdom.models[0].tables.length).toBe(0);
    expect(hdom.models[0].joins.length).toBe(0);
    expect(hdom.frames.length).toBe(1);
  });
});

/** Every parent/child shape that used to throw. */
const CONTAINER_SHAPES: {
  what: string;
  code: HDQL_DIAGNOSTIC_CODES;
  doc: string;
}[] = [
  {
    what: "a dropped model keeping a dataset",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME,
    doc: '<hdml-model><hdml-dataset name="d" type="table" identifier="t"></hdml-dataset></hdml-model>',
  },
  {
    what: "a dropped model keeping a join",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME,
    doc: '<hdml-model><hdml-join left="a" right="b"></hdml-join></hdml-model>',
  },
  {
    what: "a dropped model two levels deep",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME,
    doc: '<hdml-model><hdml-dataset name="d" type="table" identifier="t"><hdml-field name="f"></hdml-field></hdml-dataset></hdml-model>',
  },
  {
    what: "a dropped dataset keeping a field",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_DATASET_ATTRS,
    doc: '<hdml-model name="m"><hdml-dataset name="d" type="table"><hdml-field name="f"></hdml-field></hdml-dataset></hdml-model>',
  },
  {
    what: "a dropped frame keeping a field",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
    doc: '<hdml-frame name="f"><hdml-field name="x"></hdml-field></hdml-frame>',
  },
  {
    what: "a dropped frame keeping a connective",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
    doc: '<hdml-frame name="f"><hdml-filter-by><hdml-connective operator="and"></hdml-connective></hdml-filter-by></hdml-frame>',
  },
  {
    what: "a dropped join keeping a connective",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_JOIN_SIDES,
    doc: '<hdml-model name="m"><hdml-join left="a"><hdml-connective operator="and"></hdml-connective></hdml-join></hdml-model>',
  },
  {
    what: "a dropped frame keeping a group-by field",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
    doc: '<hdml-frame name="f"><hdml-group-by><hdml-field name="g"></hdml-field></hdml-group-by></hdml-frame>',
  },
  {
    what: "a dropped frame keeping a sort-by field",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
    doc: '<hdml-frame name="f"><hdml-sort-by><hdml-field name="s"></hdml-field></hdml-sort-by></hdml-frame>',
  },
  {
    what: "a dropped frame keeping a split-by field",
    code: HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
    doc: '<hdml-frame name="f"><hdml-split-by><hdml-field name="p"></hdml-field></hdml-split-by></hdml-frame>',
  },
];

/** `shape.doc` inside the wrapper markup a real page has. */
function wrap(doc: string): string {
  return '<div id="hdml"><div>' + doc + "</div></div>";
}

describe("A dropped container with a surviving child", () => {
  for (const shape of CONTAINER_SHAPES) {
    it("reports " + shape.what, () => {
      const d: HdqlDiagnostic[] = [];

      // ★ Each of these ten threw a TypeError before step 10.
      expect(() => parseHDML(wrap(shape.doc), d)).not.toThrow();
      expect(d.length).toBe(1);
      expect(d[0].code).toBe(shape.code);
      // ★ And the reason REACHES the caller, which is the half
      // the crash destroyed: the diagnostic was already in the
      // sink when it threw, and the drain never ran.
      expect(d[0].path !== null).toBe(true);
      expect(d[0].offset !== null).toBe(true);
    });
  }

  it("takes the whole subtree with it", () => {
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(
      wrap(
        '<hdml-model><hdml-dataset name="d" type="table" identifier="t"><hdml-field name="f"></hdml-field></hdml-dataset></hdml-model>',
      ),
      d,
    );

    // ★ The surviving dataset is not orphan-attached anywhere: a
    // dropped parent takes its subtree with it, and the parent's
    // own diagnostic is the explanation. The orphan gets NO
    // diagnostic of its own -- that would need a new code and
    // would report one problem per descendant.
    expect(hdom.models.length).toBe(0);
    expect(d.length).toBe(1);
    expect(d[0].code).toBe(HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME);
  });

  it("still attaches every slot of a SURVIVING frame", () => {
    // ★★ The regression control for WHERE the guard was placed.
    // `<hdml-group-by>`, `<hdml-sort-by>`, `<hdml-split-by>` and
    // `<hdml-filter-by>` carry `hddmData === null` ALWAYS, so a
    // guard on the `<hdml-field>` case's OUTER `if (parent)`
    // would compile, throw nothing, and silently drop every
    // grouped, sorted and split field. This case is what makes
    // that mistake visible.
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(
      wrap(
        '<hdml-frame name="f" source="/s.html"><hdml-field name="a"></hdml-field><hdml-group-by><hdml-field name="g"></hdml-field></hdml-group-by><hdml-sort-by><hdml-field name="s"></hdml-field></hdml-sort-by><hdml-split-by><hdml-field name="p"></hdml-field></hdml-split-by><hdml-filter-by><hdml-connective operator="and"><hdml-filter type="expr" clause="1 = 1"></hdml-filter></hdml-connective></hdml-filter-by></hdml-frame>',
      ),
      d,
    );
    const frame = hdom.frames[0];

    expect(d.length).toBe(0);
    expect(frame.fields.map((f) => f.name)).toEqual(["a"]);
    expect(frame.group_by.map((f) => f.name)).toEqual(["g"]);
    expect(frame.sort_by.map((f) => f.name)).toEqual(["s"]);
    expect(frame.split_by.map((f) => f.name)).toEqual(["p"]);
    expect(frame.filter_by.filters.length).toBe(1);
  });
});

/**
 * ★★ **Gate (c) — item 3's V-rule** (019 step 11, RFC 019/001 §4.7).
 *
 * `key` is meaningful only on an `<hdml-field>` whose parent is
 * `<hdml-dataset>`. In the other four positions it is REPORTED AND
 * IGNORED: a `warning`, and the field still reaches the `HDOM`.
 *
 * ★ **These go through `parseHDML`, never through a helper.** The
 * rule lives in `appendHddmChild`, not in `getFieldData` -- the
 * helper is handed `attrs` and never sees the field's parent -- so a
 * unit test on `getFieldData` can never exercise it (C103). And the
 * seam that lets a diagnostic raised during APPEND reach the
 * caller's array is itself the thing most likely to be wrong, which
 * only an end-to-end parse can see.
 *
 * ★ Every document carries wrapper `<div>` markup so the `path`
 * assertions are real (C91); the anchors are derived with `at()`.
 */
const MISPLACED_KEY_MESSAGE =
  "`key` is meaningful only on a field under `hdml-dataset`; " +
  "here it is ignored.";

const KEYED_FIELD = '<hdml-field name="f" key="pk"></hdml-field>';

/** A keyed field directly under `<hdml-dataset>` — the one legal
 * position. */
function underDataset(): string {
  return `
  <div class="wrap">
    <section>
      <hdml-model name="m">
        <hdml-dataset name="d" type="table" identifier="t">
          ${KEYED_FIELD}
        </hdml-dataset>
      </hdml-model>
    </section>
  </div>
`;
}

/**
 * A keyed field under `<hdml-frame>`, either directly (`slot ===
 * null`) or wrapped in one of the three positional slots.
 */
function underFrame(slot: null | string): string {
  const inner = slot
    ? `<${slot}>${KEYED_FIELD}</${slot}>`
    : KEYED_FIELD;
  return `
  <div class="wrap">
    <section>
      <hdml-frame name="fr" source="/m.html">
        ${inner}
      </hdml-frame>
    </section>
  </div>
`;
}

describe("item 3's `key` V-rule", () => {
  it("says NOTHING for a key under `hdml-dataset`", () => {
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(underDataset(), d);

    // ★ The whole point: the legal position is silent.
    expect(d.length).toBe(0);
    // ...and the declaration actually arrived.
    expect(hdom.models[0].tables[0].fields[0].key).toBe("pk");
  });

  /** The four positions where `key` means nothing. */
  const MISPLACED: { slot: null | string; label: string }[] = [
    { slot: null, label: "hdml-frame" },
    { slot: "hdml-group-by", label: "hdml-group-by" },
    { slot: "hdml-sort-by", label: "hdml-sort-by" },
    { slot: "hdml-split-by", label: "hdml-split-by" },
  ];

  MISPLACED.forEach(({ slot, label }) => {
    it(`warns for a key under \`${label}\``, () => {
      // `slot === null` means the field is a DIRECT child of the
      // frame, which is the `hdml-frame` position itself.
      const src = underFrame(slot);
      const d: HdqlDiagnostic[] = [];
      const hdom = parseHDML(src, d);

      // ★ ONE diagnostic, and it reached the CALLER'S array --
      // the only clause that tells a real seam from one that
      // collects nothing.
      expect(d.length).toBe(1);
      expect(d[0].code).toBe(HDQL_DIAGNOSTIC_CODES.MISPLACED_KEY);
      // ★ The first `warning` in the project.
      expect(d[0].severity).toBe("warning");
      expect(d[0].message).toBe(MISPLACED_KEY_MESSAGE);

      // A real anchor, and no wrapper segment in it.
      expect(d[0].path).not.toBeNull();
      expect(d[0].path).not.toContain("div");
      expect(d[0].path).not.toContain("section");
      expect(d[0].path).toContain("hdml-field[0]");
      const anchor = at(src, '<hdml-field name="f" key="pk">');
      expect(d[0].line).toBe(anchor.line);
      expect(d[0].column).toBe(anchor.column);
      expect(d[0].offset).toBe(anchor.offset);

      // ★★ AND THE FIELD IS STILL THERE. "Reported and ignored"
      // is not "dropped": this is the first diagnostic in 019
      // that does not accompany a drop, and a `warning` that
      // removed the element would be an `error` wearing the
      // wrong severity.
      const frame = hdom.frames[0];
      const slots = [
        ...frame.fields,
        ...frame.group_by,
        ...frame.sort_by,
        ...frame.split_by,
      ];
      expect(slots.length).toBe(1);
      expect(slots[0].name).toBe("f");
      // ★ The declaration is CARRIED, not blanked -- it is
      // simply inert where it sits.
      expect(slots[0].key).toBe("pk");
    });
  });

  it("says nothing when a misplaced field has no `key`", () => {
    // The negative control for the rule's own condition: the
    // position alone must not warn.
    const d: HdqlDiagnostic[] = [];
    parseHDML(
      underFrame("hdml-group-by").replace(' key="pk"', ""),
      d,
    );

    expect(d.length).toBe(0);
  });

  it("does not warn for a field under a DROPPED frame", () => {
    // ★ Gated on `attached` deliberately. A dropped parent takes
    // its subtree with it (step 10, S13) and its own `error` is
    // the explanation; a second diagnostic would report two
    // problems for one mistake and would break the invariant that
    // `severity === "warning"` implies the element is in the HDOM.
    const d: HdqlDiagnostic[] = [];
    const hdom = parseHDML(
      underFrame("hdml-group-by").replace(' source="/m.html"', ""),
      d,
    );

    expect(d.length).toBe(1);
    expect(d[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
    );
    expect(d[0].severity).toBe("error");
    expect(hdom.frames.length).toBe(0);
  });
});
