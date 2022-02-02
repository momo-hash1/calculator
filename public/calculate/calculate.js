import nextToken from "./lexer";

let getHighestOperator = (operationStack) => {
  let highestOperatorOrder = 0;
  let hightestOperator = {};
  operationStack.forEach((element, index) => {
    if (operations[element] !== undefined) {
      if (highestOperatorOrder < operations[element].order) {
        hightestOperator = { operator: element, index: index };
        highestOperatorOrder = operations[element].order;
      }
    }
  });
  return hightestOperator;
};

const calculate = (expression) => {
  let operationStack = [...nextToken(expression)];
  while (
    operationStack.find((token) => token.value === "*") ||
    operationStack.find((token) => token.value === "/")
  ) {
    let rootOperator = getHighestOperator(operationStack);
    let indexRoot = operationStack.indexOf(rootOperator);

    let operand1 = parseFloat(indexRoot - 1).value;
    let operand2 = parseFloat(indexRoot + 1).value;

    if (operand1 === 0 || operand2 === 0) {
      return null;
    } else {
      operationStack.splice(indexRoot - 1, 2);

      operationStack[indexRoot - 1] = operations[rootOperator.value].operation(
        operand1,
        operand2
      );
    }
  }
  return operationStack[0];
};

// [a-z]*[a-z]\(.*\)
export default calculate;
