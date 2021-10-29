let operations = {
  "+": { operation: (operand1, operand2) => operand1 + operand2, order: 2 },
  "-": { operation: (operand1, operand2) => operand1 - operand2, order: 2 },
  "*": { operation: (operand1, operand2) => operand1 * operand2, order: 3 },
  "/": { operation: (operand1, operand2) => operand1 / operand2, order: 3 },
};

let parser = {
  getHighestOperator(operationStack) {
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
  },
};

let calculator = {
  operator: "",
  value: "",
  operationStack: [],
  calculate() {
    calculator.clear();
    calculator.operationStack.shift();
    while (Object.keys(parser.getHighestOperator(calculator.operationStack)).length !== 0) {
      let highestOperator = parser.getHighestOperator(
        calculator.operationStack
      );

      let operand1 = parseFloat(
        calculator.operationStack[highestOperator.index - 1]
      );
      let operand2 = parseFloat(
        calculator.operationStack[highestOperator.index + 1]
      );

      calculator.operationStack.splice(highestOperator.index - 1, 2);
      calculator.operationStack[highestOperator.index - 1] = operations[
        highestOperator.operator
      ].operation(operand1, operand2);
    }
    calculator.value = calculator.operationStack[0];
    calculator.operationStack = [];

  },
  removeValueByValue() {
    if (calculator.operationStack.length === 0) {
      calculator.clear();
    } else {
      calculator.operationStack.shift();
    }
  },
  clear() {
    calculator.value = "";
    calculator.operator = "";
  },
};

const updateInput = (callback) => {
  callback();

  let stringView = "";
  calculator.operationStack.forEach((element) => {
    stringView += element;
  });
  document.querySelector("#inputNumber").textContent = stringView;

  let currentView = `${calculator.operator} ${calculator.value}`;
  currentView = currentView.length >= 10 ? currentView.slice(-10) : currentView;
  document.querySelector("#current_number").textContent = currentView;
};

const inputHandler = (callback, _class) => {
  document.querySelectorAll(_class).forEach((el) => {
    el.addEventListener("click", (event) => {
      callback(event);
    });
  });
};

const clearHandler = () => {
  const clearBtn = document.querySelector("#clear");
  clearBtn.addEventListener("click", (e) => {
    updateInput(calculator.removeValueByValue);
    e.preventDefault();
  });

  clearBtn.addEventListener("mousedown", () => {
    let timeout = 0;
    clearBtn.addEventListener("mouseup", () => {
      clearTimeout(timeout);
    });
    timeout = setTimeout(() => {
      updateInput(() => {
        calculator.operationStack = [];
        calculator.clear();
      });
    }, 500);
  });
};

const numberBtnHandler = (event) => {
  event.preventDefault;

  updateInput(() => {
    if (event.target.dataset.number) {
      calculator.value += event.target.dataset.number;
    }
  });
};

const resultBtnHandler = () => {
  updateInput(() => {
    calculator.operationStack.push(calculator.operator, calculator.value);
    calculator.clear();

    calculator.calculate();
  });
};

const operatorBtnHandler = (event) => {
  updateInput(() => {
    if (calculator.value) {
      calculator.operationStack.push(calculator.operator, calculator.value);
      calculator.clear();
    }
    calculator.operator = event.target.dataset.operator;
  });
};

inputHandler(resultBtnHandler, ".result_button");
clearHandler();
inputHandler(operatorBtnHandler, ".operation_buttons");
inputHandler(numberBtnHandler, ".number_buttons");
