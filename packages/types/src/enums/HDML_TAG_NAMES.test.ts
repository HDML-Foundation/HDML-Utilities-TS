/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDML_TAG_NAMES } from "./HDML_TAG_NAMES";
import { ARC_ATTRS_LIST } from "./ARC_ATTRS_LIST";
import { AREA_ATTRS_LIST } from "./AREA_ATTRS_LIST";
import { AXIS_ATTRS_LIST } from "./AXIS_ATTRS_LIST";
import { BAR_ATTRS_LIST } from "./BAR_ATTRS_LIST";
import { CARTESIAN_PLANE_ATTRS_LIST } from "./CARTESIAN_PLANE_ATTRS_LIST";
import { CLUSTER_ATTRS_LIST } from "./CLUSTER_ATTRS_LIST";
import { CONTINUOUS_SCALE_ATTRS_LIST } from "./CONTINUOUS_SCALE_ATTRS_LIST";
import { DATETIME_SCALE_ATTRS_LIST } from "./DATETIME_SCALE_ATTRS_LIST";
import { GRID_ATTRS_LIST } from "./GRID_ATTRS_LIST";
import { LABEL_ATTRS_LIST } from "./LABEL_ATTRS_LIST";
import { LEGEND_ATTRS_LIST } from "./LEGEND_ATTRS_LIST";
import { LINE_ATTRS_LIST } from "./LINE_ATTRS_LIST";
import { ORDINAL_SCALE_ATTRS_LIST } from "./ORDINAL_SCALE_ATTRS_LIST";
import { PIE_ATTRS_LIST } from "./PIE_ATTRS_LIST";
import { POINT_ATTRS_LIST } from "./POINT_ATTRS_LIST";
import { POLAR_PLANE_ATTRS_LIST } from "./POLAR_PLANE_ATTRS_LIST";
import { RULE_ATTRS_LIST } from "./RULE_ATTRS_LIST";
import { STACK_ATTRS_LIST } from "./STACK_ATTRS_LIST";
import { TICK_ATTRS_LIST } from "./TICK_ATTRS_LIST";
import { VIEW_ATTRS_LIST } from "./VIEW_ATTRS_LIST";

/**
 * The twelve data (HDQL) tags, hardcoded. This list is the regression
 * guard on a published enum: it must never change.
 */
const DATA_TAGS = [
  "hdml-connection",
  "hdml-frame",
  "hdml-model",
  "hdml-table",
  "hdml-join",
  "hdml-connective",
  "hdml-filter-by",
  "hdml-filter",
  "hdml-group-by",
  "hdml-split-by",
  "hdml-sort-by",
  "hdml-field",
];

/**
 * The twenty-one display (HDVL) tags, in SPEC §2's inventory order.
 */
const DISPLAY_TAGS = [
  "hdml-view",
  "hdml-cartesian-plane",
  "hdml-polar-plane",
  "hdml-continuous-scale",
  "hdml-datetime-scale",
  "hdml-ordinal-scale",
  "hdml-line",
  "hdml-area",
  "hdml-bar",
  "hdml-point",
  "hdml-arc",
  "hdml-rule",
  "hdml-pie",
  "hdml-cluster",
  "hdml-stack",
  "hdml-axis",
  "hdml-tick",
  "hdml-label",
  "hdml-grid",
  "hdml-legend",
  "hdml-fallback",
];

/**
 * Every per-element attribute enum, by its exported name. There is one
 * per display element except `hdml-fallback`, which has no attributes
 * and whose content is exempt from every V-rule (SPEC §2).
 */
const ATTRS_LISTS: Record<string, Record<string, string>> = {
  ARC_ATTRS_LIST,
  AREA_ATTRS_LIST,
  AXIS_ATTRS_LIST,
  BAR_ATTRS_LIST,
  CARTESIAN_PLANE_ATTRS_LIST,
  CLUSTER_ATTRS_LIST,
  CONTINUOUS_SCALE_ATTRS_LIST,
  DATETIME_SCALE_ATTRS_LIST,
  GRID_ATTRS_LIST,
  LABEL_ATTRS_LIST,
  LEGEND_ATTRS_LIST,
  LINE_ATTRS_LIST,
  ORDINAL_SCALE_ATTRS_LIST,
  PIE_ATTRS_LIST,
  POINT_ATTRS_LIST,
  POLAR_PLANE_ATTRS_LIST,
  RULE_ATTRS_LIST,
  STACK_ATTRS_LIST,
  TICK_ATTRS_LIST,
  VIEW_ATTRS_LIST,
};

/**
 * HTML global attributes that must never enter the vocabulary. `hidden`
 * is the one deliberate exception and is checked separately.
 */
const HTML_GLOBALS = [
  "class",
  "style",
  "id",
  "slot",
  "title",
  "lang",
  "dir",
];

/** The three elements on which `hidden` is vocabulary (SPEC §7, V17). */
const HIDDEN_OWNERS = [
  "AREA_ATTRS_LIST",
  "BAR_ATTRS_LIST",
  "STACK_ATTRS_LIST",
];

describe("HDML_TAG_NAMES", () => {
  it("HDML_TAG_NAMES has exactly 33 members", () => {
    expect(Object.keys(HDML_TAG_NAMES).length).toBe(33);
  });

  it("every tag name matches /^hdml-[a-z0-9-]+$/", () => {
    for (const value of Object.values(HDML_TAG_NAMES)) {
      expect(value).toMatch(/^hdml-[a-z0-9-]+$/);
    }
  });

  it("every tag name is unique", () => {
    const values = Object.values(HDML_TAG_NAMES);
    expect(new Set(values).size).toBe(33);
  });

  it("the twelve data tags are unchanged", () => {
    const values = Object.values(HDML_TAG_NAMES) as string[];
    expect(values.slice(0, 12)).toEqual(DATA_TAGS);
  });

  it("the twenty-one display tags match SPEC §2's inventory", () => {
    const values = Object.values(HDML_TAG_NAMES) as string[];
    expect(values.slice(12)).toEqual(DISPLAY_TAGS);
  });
});

describe("*_ATTRS_LIST", () => {
  it("there is one enum per display element but hdml-fallback", () => {
    expect(Object.keys(ATTRS_LISTS).length).toBe(20);
  });

  it("every *_ATTRS_LIST value is unique within its enum", () => {
    for (const [name, list] of Object.entries(ATTRS_LISTS)) {
      const values = Object.values(list);
      expect([name, new Set(values).size]).toEqual([
        name,
        values.length,
      ]);
    }
  });

  it("every *_ATTRS_LIST value matches /^[a-z][a-z0-9]*[0-9]?$/", () => {
    for (const [name, list] of Object.entries(ATTRS_LISTS)) {
      for (const value of Object.values(list)) {
        expect([name, value]).toEqual([
          name,
          expect.stringMatching(/^[a-z][a-z0-9]*[0-9]?$/) as string,
        ]);
      }
    }
  });

  it("every *_ATTRS_LIST key is the value in SCREAMING_SNAKE", () => {
    for (const [name, list] of Object.entries(ATTRS_LISTS)) {
      for (const [key, value] of Object.entries(list)) {
        expect([name, key]).toEqual([name, value.toUpperCase()]);
      }
    }
  });

  it("no *_ATTRS_LIST contains an HTML global attribute", () => {
    for (const [name, list] of Object.entries(ATTRS_LISTS)) {
      const values = Object.values(list);
      for (const global of HTML_GLOBALS) {
        expect([name, global, values.includes(global)]).toEqual([
          name,
          global,
          false,
        ]);
      }
      const owns = values.includes("hidden");
      expect([name, owns]).toEqual([
        name,
        HIDDEN_OWNERS.includes(name),
      ]);
    }
  });
});
