const functions = {
  sin: (value) => Math.sin(value),
  ln: (value) => Math.log(value),
  sqrt: (value) => Math.sqrt(value),
  cos: (value) => Math.cos(value),
};

const operations = {
  MINUS: { operation: (operand1, operand2) => operand1 - operand2, order: 2 },
  PLUS: { operation: (operand1, operand2) => operand1 + operand2, order: 2 },
  MUL: { operation: (operand1, operand2) => operand1 * operand2, order: 3 },
  DEL: { operation: (operand1, operand2) => operand1 / operand2, order: 3 },
  POWER: { operation: (operand1, operand2) => operand1 ** operand2, order: 4 },
};
let tokens = {
  NUM: "num",
  LPR: "(",
  RPR: ")",
  FUN: "fun",
  DOT: ".",
  MINUS: "-",
  PLUS: "+",
  MUL: "*",
  DEL: "/",
  POW: "^",
};

tokens = Object.freeze(tokens);

const token = (...args) => {
  return {
    type: args[0],
    value: args[1],
  };
};

export { operations, token, tokens, functions };
