const functions = {
  sin: (value) => Math.sin(value),
  ln: (value) => Math.log(value),
  sqrt: (value) => Math.sqrt(value),
};

const parseFun = (expression) => {
  const func = expression.slice(0, expression.indexOf("("));
  const value = expression.slice(
    expression.indexOf("("),
    expression.indexOf(")")
  );
  return [func, value]
}


const getFun = (funcExpression) => {
  const [func, value] = parseFun(funcExpression)
  return functions[func](value);
};

const operations = {
  PLUS: { operation: (operand1, operand2) => operand1 + operand2 },
  MINUS: { operation: (operand1, operand2) => operand1 - operand2 },
  MUL: { operation: (operand1, operand2) => operand1 * operand2 },
  DEL: { operation: (operand1, operand2) => operand1 / operand2 },
  POWER: { operation: (operand1, operand2) => operand1 ** operand2 },
  FUN: { operations: getFun },
};
let tokens = {};
['NUM', 'LPR', 'RPR', 'BINOP', 'FUN'].forEach((op, index) => {
  tokens[op] = index;
});

tokens = Object.freeze(tokens);

const token = (...args) => {
  return { type: args[0], value: args[1] };
};

export { operations, token, tokens, parseFun};
