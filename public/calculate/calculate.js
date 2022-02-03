import nextToken from "./lexer";
import { functions, isExpression, operations, tokens } from "./operations";

let getHighestOperator = (lexerTokens) => {
  let operator = { order: 0, value: "" };
  lexerTokens.forEach((token) => {
    if (token.binary) {
      let opName = Object.keys(tokens).find(
        (key) => tokens[key] === token.type
      );
      if (operator.order < operations[opName].order) {
        operator = { order: operations[opName].order, value: opName };
      }
    }
  });
  return operator.value;
};

const findLastChildrens = (lex) => {
  let lastChildrens = [];
  const findLastChild = (lex) => {
    const nest = findNestedExpression([...nextToken(lex)]);
    if (nest.length !== 0) {
      nest.forEach((n) => {
        findLastChild(n.slice(1, n.length - 1));
      });
    } else {
      lastChildrens.push(lex);
    }
  };
  findLastChild(lex);

  let calculatedLastChildrens = {};
  lastChildrens.forEach((children) => {
    if (children !== "") {
      calculatedLastChildrens[`(${children})`] = calculateBin(children);
    }
  });

  return calculatedLastChildrens;
};

const removeParentheses = (expression) => {
  let lastChild = findLastChildrens(expression);
  while (findNestedExpression([...nextToken(expression)]).length !== 0) {
    Object.keys(lastChild).forEach((key) => {
      let temp = expression.split("");
      temp.splice(expression.indexOf(key), key.length - 1);
      temp[expression.indexOf(key)] = lastChild[key];
      expression = temp.join("");
    });
    lastChild = findLastChildrens(expression);
  }
  return expression;
};

const calculate = (expression) => {
  expression = removeParentheses(expression);
  return calculateBin(expression);
};

const calculateBin = (expression) => {
  let lexerTokens = [...nextToken(expression)];
  while (lexerTokens.length > 1) {
    lexerTokens.forEach((token) => {
      if (token.binary) {
        let highOperator = getHighestOperator(lexerTokens);
        let opIndex = lexerTokens.findIndex(
          (el) => el.type === tokens[highOperator]
        );
        lexerTokens[opIndex - 1].value = operations[highOperator].operation(
          lexerTokens[opIndex - 1].value,
          lexerTokens[opIndex + 1].value
        );
        lexerTokens.splice(opIndex, 2);
      }
    });
  }
  return lexerTokens[0].value;
};

const checkClosedParentheses = (expression) => {
  const lprCount = (expression.match(/\(/g) || []).length;
  const rprCount = (expression.match(/\)/g) || []).length;
  if (lprCount === rprCount) {
    return true;
  }
};

const findNestedExpression = (lexerTokens) => {
  let nestedExp = "";
  let exps = [];
  let opened = false;
  lexerTokens.forEach((token) => {
    if (token.type === tokens.LPR) {
      opened = true;
    }
    if (opened) {
      nestedExp += token.value;
    }

    if (token.type === tokens.RPR) {
      if (checkClosedParentheses(nestedExp)) {
        opened = false;
        exps.push(nestedExp);
        nestedExp = "";
      }
    }
  });
  return exps;
};

export default calculate;
