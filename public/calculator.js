// TODO fix sqrt

let operations = {
  "+": { operation: (operand1, operand2) => operand1 + operand2, order: 2 },
  "-": { operation: (operand1, operand2) => operand1 - operand2, order: 2 },
  "*": { operation: (operand1, operand2) => operand1 * operand2, order: 3 },
  "/": { operation: (operand1, operand2) => operand1 / operand2, order: 3 },
  "^": { operation: (operand1) => operand1 ** 2, order: 4 },
  sqrt: {
    operation: (operand1, operand2) => {
      return Math.sqrt(operand2);
    },
    order: 4,
    unary: true,
  },
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
    while (
      Object.keys(parser.getHighestOperator(calculator.operationStack))
        .length !== 0
    ) {
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

const initSwitcher = () => {
  setSelectedView('calculator')
  switcher("calculator");
};

const switcher = (type) => {
  const htmlTemplates = {
    calculator: `

  <div class="row operation_buttons my-2">
    <div class="col">
      <button
        data-operator="+"
        class="operator_button btn btn-outline-secondary"
        class="col"
      >
        +
      </button>
      <button
        data-operator="-"
        class="operator_button btn btn-outline-secondary"
        class="col"
      >
        -
      </button>
      <button
        data-operator="/"
        class="operator_button btn btn-outline-secondary"
        class="col"
      >
        /
      </button>
      <button
        data-operator="*"
        class="operator_button btn btn-outline-secondary"
        class="col"
      >
        *
      </button>
      <button
        data-operator="^"
        class="operator_button btn btn-outline-secondary"
        class="col"
      >
        ^
      </button>
      <button
        data-operator="sqrt"
        class="operator_button btn btn-outline-secondary"
        class="col"
      >
        sqrt
      </button>
    </div>
  </div>
  <div class="d-flex">
    <button data-number="1" class="number_button btn btn-outline-secondary">
      1
    </button>
    <button data-number="2" class="number_button btn btn-outline-secondary">
      2
    </button>
    <button data-number="3" class="number_button btn btn-outline-secondary">
      3
    </button>
  </div>
  <div class="d-flex">
    <button data-number="4" class="number_button btn btn-outline-secondary">
      4
    </button>
    <button data-number="5" class="number_button btn btn-outline-secondary">
      5
    </button>
    <button data-number="6" class="number_button btn btn-outline-secondary">
      6
    </button>
  </div>
  <div class="d-flex">
    <button data-number="7" class="number_button btn btn-outline-secondary">
      7
    </button>
    <button data-number="8" class="number_button btn btn-outline-secondary">
      8
    </button>
    <button data-number="9" class="number_button btn btn-outline-secondary">
      9
    </button>
  </div>
  <div class="d-flex justify-content-center align-items-center">
    <button class="number_button btn btn-outline-secondary" data-number="0">
      0
    </button>
    <button class="result_button btn btn-outline-secondary">=</button>
  </div>
    `,
    graph: `
    <canvas id="graphview-canvas"></canvas>
    `,
  };

  document.querySelector(".switch").innerHTML = htmlTemplates[type];
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
    console.log(calculator.operationStack);
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

const setSelectedView = (view) => {
  const calcSideItem = document.querySelectorAll(".calc-side-item");

  calcSideItem.forEach((element) => {
    if (element.dataset.view === view) {
      element.classList.replace("btn-light", "btn-primary");
    } else {
      element.classList.replace("btn-primary", "btn-light");
    }
  });
};

const selectView = () => {
  const calcSideItem = document.querySelectorAll(".calc-side-item");
  calcSideItem.forEach((element) => {
    element.addEventListener("click", (event) => {
      setSelectedView(event.target.dataset.view);
      switcher(event.target.dataset.view)
    });
  });
};

initSwitcher();
inputHandler(resultBtnHandler, ".result_button");
clearHandler();
inputHandler(operatorBtnHandler, ".operation_buttons");
inputHandler(numberBtnHandler, ".number_button");
selectView();
