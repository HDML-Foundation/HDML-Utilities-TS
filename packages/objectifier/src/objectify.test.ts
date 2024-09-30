/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { objectify } from "./objectify";

const model = `
  <!-- Data model -->
  <hdml-model name="maang_stock">

    <div>
      <!-- Amazon stock table -->
      <hdml-table name="amazon" type="table" source="\`tenant_postgres\`.\`public\`.\`amazon_stock\`">
        <hdml-field name="open"></hdml-field>
        <hdml-field name="high"></hdml-field>
        <hdml-field name="low"></hdml-field>
        <hdml-field name="close"></hdml-field>
        <hdml-field name="adj_close"></hdml-field>
        <hdml-field name="volume"></hdml-field>
        <hdml-field name="date"></hdml-field>
      </hdml-table>

      <!-- Apple stock table -->
      <hdml-table name="apple" type="table" source="\`tenant_postgres\`.\`public\`.\`apple_stock\`">
        <hdml-field name="open"></hdml-field>
        <hdml-field name="high"></hdml-field>
        <hdml-field name="low"></hdml-field>
        <hdml-field name="close"></hdml-field>
        <hdml-field name="adj_close"></hdml-field>
        <hdml-field name="volume"></hdml-field>
        <hdml-field name="date"></hdml-field>
      </hdml-table>

      <!-- Google stock table -->
      <hdml-table name="google" type="table" source="\`tenant_postgres\`.\`public\`.\`google_stock\`">
        <hdml-field name="open"></hdml-field>
        <hdml-field name="high"></hdml-field>
        <hdml-field name="low"></hdml-field>
        <hdml-field name="close"></hdml-field>
        <hdml-field name="adj_close"></hdml-field>
        <hdml-field name="volume"></hdml-field>
        <hdml-field name="date"></hdml-field>
      </hdml-table>

      <!-- Microsoft stock table -->
      <hdml-table name="microsoft" type="table" source="\`tenant_postgres\`.\`public\`.\`microsoft_stock\`">
        <hdml-field name="open"></hdml-field>
        <hdml-field name="high"></hdml-field>
        <hdml-field name="low"></hdml-field>
        <hdml-field name="close"></hdml-field>
        <hdml-field name="adj_close"></hdml-field>
        <hdml-field name="volume"></hdml-field>
        <hdml-field name="date"></hdml-field>
    </hdml-table>

      <!-- Netflix stock table -->
      <hdml-table name="netflix" type="table" source="\`tenant_postgres\`.\`public\`.\`netflix_stock\`">
        <hdml-field name="open"></hdml-field>
        <hdml-field name="high"></hdml-field>
        <hdml-field name="low"></hdml-field>
        <hdml-field name="close"></hdml-field>
        <hdml-field name="adj_close"></hdml-field>
        <hdml-field name="volume"></hdml-field>
        <hdml-field name="date"></hdml-field>
      </hdml-table>
    </div>

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
`;

describe("The `objectify` function", () => {
  it("shoud be executable", () => {
    const iModel = objectify(model);
    expect(typeof iModel).toBe("object");
  });
});
