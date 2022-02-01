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
    let operationStack = expression.split(' ')

    while (
        Object.keys(getHighestOperator(operationStack)).length !== 0
    ) {
        let highestOperator = getHighestOperator(calculator.operationStack);

        let operand1 = parseFloat(
            operationStack[highestOperator.index - 1]
        );
        let operand2 = parseFloat(
            operationStack[highestOperator.index + 1]
        );

        if (operand1 === 0 || operand2 === 0) {
            return null
        } else {
            operationStack.splice(highestOperator.index - 1, 2);

            operationStack[highestOperator.index - 1] = operations[
                highestOperator.operator
            ].operation(operand1, operand2);
        }
    }
    return operationStack[0]
}

export default calculate