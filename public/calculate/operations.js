const functions = {
  sin: (value) => Math.sin(value),
  ln: (value) => Math.log(value),
  sqrt: (value) => {
    if (value < 0) {
      return { err: "square root of negative number" };
    }
    return Math.sqrt(value);
  },
  cos: (value) => Math.cos(value),
  tg: (value) => Math.tan(value),
  cot: (value) => 1/Math.tan(value)
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
  INNER: "inner",
};
tokens = Object.freeze(tokens);

const operationOrder = [tokens.PLUS, tokens.MINUS, tokens.MUL, tokens.DEL];

const operations = {
  [tokens.MINUS]: (operand1, operand2) => operand1 - operand2,
  [tokens.PLUS]: (operand1, operand2) => operand1 + operand2,
  [tokens.MUL]: (operand1, operand2) => operand1 * operand2,
  [tokens.DEL]: (operand1, operand2) => {
    if (operand2 === 0) {
      return { err: "zero division" };
    }
    return operand1 / operand2;
  },
  [tokens.POW]: (operand1, operand2) => operand1 ** operand2,
};

const token = (...args) => {
  return {
    type: args[0],
    value: args[1],
  };
};

export { operations, token, tokens, functions, operationOrder };
