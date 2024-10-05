/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { objectify } from "./objectify";

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
  <!-- Includes -->
  <div>
    <hdml-include
      path="/my/path/include.hdml">
    </hdml-include>

    <hdml-include
      pat="wrong/attribute/name">
    </hdml-include>
  </div>

  <!-- Connections -->
  <div>
    <hdml-connection
      name="db1"
      type="postgres"
      host="example.com"
      user="user"
      password="pass">
    </hdml-connection>

    <hdml-connection
      name="db2"
      meta="MongoDB test connection"
      type="mongodb"
      host="example.com"
      user="user"
      password="pass"
      ssl="true"
      schema="data_schema">
    </hdml-connection>
  </div>

  <!-- HDML Data model -->
  <hdml-model
    name="maang_stock">

    <!-- Tables -->
    <div>
      <!-- Amazon stock table -->
      <hdml-table
        name="amazon"
        type="table"
        source="\`tenant_postgres\`.\`public\`.\`amazon_stock\`">

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
      </hdml-table>

      <!-- Apple stock table -->
      <hdml-table
        name="apple"
        type="table"
        source="\`tenant_postgres\`.\`public\`.\`apple_stock\`">

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
      </hdml-table>

      <!-- Google stock table -->
      <hdml-table
        name="google"
        type="table"
        source="\`tenant_postgres\`.\`public\`.\`google_stock\`">

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
      </hdml-table>

      <!-- Microsoft stock table -->
      <hdml-table
        name="microsoft"
        type="table"
        source="\`tenant_postgres\`.\`public\`.\`microsoft_stock\`">

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
      </hdml-table>

      <!-- Netflix stock table -->
      <hdml-table
        name="netflix"
        type="table"
        source="\`tenant_postgres\`.\`public\`.\`netflix_stock\`">

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
      </hdml-table>
    </div>

    <!-- Joins -->
    <div>
      <!-- Join amazon with apple -->
      <hdml-join type="full-outer" left="amazon" right="apple">
        <hdml-connective operator="and">
          <hdml-filter type="keys" left="date" right="date"></hdml-filter>
        </hdml-connective>
      </hdml-join>

      <!-- Join google with apple -->
      <hdml-join type="full-outer" left="google" right="apple">
        <hdml-connective operator="and">
          <hdml-filter type="keys" left="date" right="date"></hdml-filter>
        </hdml-connective>
      </hdml-join>

      <!-- Join google with microsoft -->
      <hdml-join type="full-outer" left="google" right="microsoft">
        <hdml-connective operator="and">
          <hdml-filter type="keys" left="date" right="date"></hdml-filter>
        </hdml-connective>
      </hdml-join>

      <!-- Join microsoft with netflix -->
      <hdml-join type="full-outer" left="microsoft" right="netflix">
        <hdml-connective operator="and">
          <hdml-filter type="keys" left="date" right="date"></hdml-filter>
        </hdml-connective>
      </hdml-join>
    </div>
  </hdml-model>

  <!-- HDML Data frame -->
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

  </hdml-frame>
`;

describe("The `objectify` function", () => {
  it("sould return empty HDDM object if no HDML tags in HTML document", () => {
    const hddm = objectify(html);

    expect(hddm).toEqual({
      includes: [],
      connections: [],
      models: [],
      frames: [],
    });
  });

  it("shoud parse HDML string", () => {
    const hddm = objectify(hdml);
    expect(hddm).toEqual({
      includes: [
        {
          path: "/my/path/include.hdml",
        },
      ],
      connections: [
        {
          name: "db1",
          meta: "",
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
          meta: "MongoDB test connection",
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
          tables: [],
          joins: [],
        },
      ],
      frames: [
        {
          name: "maang_stock",
          source: "/maang/model.html?hdml-model=maang_stock",
          offset: 0,
          limit: 100000,
          fields: [],
          filter_by: {
            type: 2,
            filters: [],
            children: [],
          },
          group_by: [],
          sort_by: [],
          split_by: [],
        },
      ],
    });
  });
});
