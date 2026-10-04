/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDQL_DIAGNOSTIC_CODES } from "@hdml/types";
import { Token } from "parse5";
import { Element } from "./types/HDMLTreeAdapterMap";
import {
  DiagnosticSink,
  anchorDiagnostics,
  drainDiagnostics,
  pushDiagnostic,
} from "./diagnostics";

function element(tagName: string): Element {
  return {
    nodeName: tagName,
    tagName,
    attrs: [],
    rootNode: null,
    parentNode: null,
    childNodes: [],
    hddm: null,
    hddmData: null,
    loc: null,
    path: null,
  };
}

function location(
  startLine: number,
  startCol: number,
  startOffset: number,
  withStartTag: boolean,
): Token.ElementLocation {
  const base = {
    startLine,
    startCol,
    startOffset,
    endLine: startLine,
    endCol: startCol,
    endOffset: startOffset,
  };
  return withStartTag
    ? { ...base, startTag: { ...base, startLine: startLine + 9 } }
    : base;
}

describe("The diagnostics sink", () => {
  it("discards when no sink is supplied", () => {
    expect(() =>
      pushDiagnostic(
        undefined,
        HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
        "dropped",
      ),
    ).not.toThrow();
    expect(() =>
      anchorDiagnostics(undefined, 0, element("hdml-field")),
    ).not.toThrow();
  });

  it("records the code, the severity and the message", () => {
    const sink: DiagnosticSink = [];
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
      "dropped",
    );
    expect(sink.length).toBe(1);
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
    );
    expect(sink[0].severity).toBe("error");
    expect(sink[0].message).toBe("dropped");
    // Compared as a boolean: a tree node in a FAILING assertion
    // kills the jest worker and names no test.
    expect(sink[0].element === null).toBe(true);
  });

  it("anchors only the entries at or after the mark", () => {
    const sink: DiagnosticSink = [];
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME,
      "earlier",
    );
    const mark = sink.length;
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
      "mine",
    );
    const el = element("hdml-field");
    anchorDiagnostics(sink, mark, el);
    expect(sink[0].element === null).toBe(true);
    expect(sink[1].element === el).toBe(true);
  });

  it("reads the anchor at drain time, not at push time", () => {
    const sink: DiagnosticSink = [];
    const el = element("hdml-field");
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
      "dropped",
    );
    anchorDiagnostics(sink, 0, el);

    // This is the state `createElement` leaves behind: the element
    // exists, and `parse5` has stamped neither field yet.
    const early = drainDiagnostics(sink);
    expect(early[0].path).toBeNull();
    expect(early[0].line).toBeNull();
    expect(early[0].column).toBeNull();
    expect(early[0].offset).toBeNull();

    el.loc = location(4, 7, 42, false);
    el.path = "hdml-model[0]/hdml-field[0]";

    const late = drainDiagnostics(sink);
    expect(late[0].path).toBe("hdml-model[0]/hdml-field[0]");
    expect(late[0].line).toBe(4);
    expect(late[0].column).toBe(7);
    expect(late[0].offset).toBe(42);
  });

  it("prefers the start tag over the element extent", () => {
    const sink: DiagnosticSink = [];
    const el = element("hdml-field");
    el.loc = location(4, 7, 42, true);
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
      "dropped",
    );
    anchorDiagnostics(sink, 0, el);
    // `location(..., true)` offsets the start tag's line by 9.
    expect(drainDiagnostics(sink)[0].line).toBe(13);
  });

  it("drains without clearing, and more than once", () => {
    const sink: DiagnosticSink = [];
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
      "dropped",
    );
    expect(drainDiagnostics(sink).length).toBe(1);
    expect(sink.length).toBe(1);
    expect(drainDiagnostics(sink).length).toBe(1);
  });

  it("hands out no reference to the element", () => {
    const sink: DiagnosticSink = [];
    const el = element("hdml-field");
    el.rootNode = el;
    el.parentNode = el;
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
      "dropped",
    );
    anchorDiagnostics(sink, 0, el);
    const keys = Object.keys(drainDiagnostics(sink)[0]).sort();
    expect(keys).toEqual([
      "code",
      "column",
      "line",
      "message",
      "offset",
      "path",
      "severity",
    ]);
    // The element above is deliberately self-referential, so this
    // would throw if a reference had leaked through.
    expect(() =>
      JSON.stringify(drainDiagnostics(sink)),
    ).not.toThrow();
  });

  it("returns an empty array for an empty sink", () => {
    const drained = drainDiagnostics([]);
    expect(Array.isArray(drained)).toBe(true);
    expect(drained.length).toBe(0);
  });
});
