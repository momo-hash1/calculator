import lexer from "../calculate/lexer.js";
import { tokens } from "../calculate/operations.js";
import assert from "assert";

describe("Lexer", () => {
  it("generate tokens properly", () => {
    assert.equal(lexer("2*-67/0.5+sin(0.5)"), [
      {
        type: tokens.NUM,
        value: 2,
      },
      {
        type: tokens.MUL,
        value: "*",
      },
      {
        type: tokens.NUM,
        value: -67,
      },
      {
        type: tokens.DEL,
        value: 2,
      },
      {
        type: tokens.NUM,
        value: 0.5,
      },
      {
        type: tokens.PLUS,
        value: "+",
      },
      {
        type: tokens.FUN,
        value: "sin",
      },
      {
        type: tokens.LPR,
        value: "(",
      },
      {
        type: tokens.NUM,
        value: 0.5,
      },
      {
        type: tokens.RPR,
        value: ")",
      },
    ]);
  });
});