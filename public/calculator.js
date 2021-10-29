let calculator = {
  operator: "",
  value: "",
  operationStack: [],
  calculate() {
    calculator.value = parseInt(calculator.value);
    let result = "";
    calculator.operationStack.forEach((element) => {
      switch (calculator.operator) {
        case "+":
          result = (calculator.preValue + calculator.pastValue).toString();
          break;
        case "-":
          result = (calculator.preValue - calculator.pastValue).toString();
          break;
        case "/":
          result = (calculator.preValue / calculator.pastValue).toString();
          break;
        case "*":
          result = (calculator.preValue * calculator.pastValue).toString();
          break;
      }
    });
    calculator.clear();
    calculator.operationStack = [];
    calculator.value = result;
  },
  parse() {
    
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
    calculator.value += event.target.dataset.number;
  });
};

const resultBtnHandler = () => {
  updateInput(calculator.calculate);
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
