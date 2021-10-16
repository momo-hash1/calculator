let calculator = {
  preValue: "",
  operator: "",
  pastValue: "",
  calculate() {
    calculator.preValue = parseInt(calculator.preValue);
    calculator.pastValue = parseInt(calculator.pastValue);
    let result = "";
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
    calculator.clear();
    calculator.preValue = result;
  },
  removeValueByValue() {
    if (!calculator.pastValue) {
      calculator.operator = "";
    }

    let handleValue = calculator.operator ? "pastValue" : "preValue";
    calculator[handleValue] = calculator[handleValue].slice(0, -1);
  },
  clear() {
    calculator.preValue = "";
    calculator.pastValue = "";
    calculator.operator = "";
    calculator.result = "";
  },
};

const updateInput = (callback) => {
  callback();
  let stringView = `${calculator.preValue} ${calculator.operator} ${calculator.pastValue}`;
  stringView = stringView.length >= 17 ? stringView.slice(-17) : stringView;
  document.querySelector("#inputNumber").textContent = stringView;
};

const clearHandler = () => {
  const clearBtn = document.querySelector("#clear");
  clearBtn.addEventListener("click", () => {
    updateInput(calculator.removeValueByValue);
  });

  clearBtn.addEventListener("mousedown", () => {
    let timeout = 0;
    clearBtn.addEventListener("mouseup", () => {
      clearTimeout(timeout);
    });
    timeout = setTimeout(() => {
      updateInput(calculator.clear)
    }, 500);
  });
};

const numberBtnHandler = () => {
  document.querySelectorAll(".number_button").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault;
      updateInput(() => {
        calculator[calculator.operator ? "pastValue" : "preValue"] +=
          event.target.dataset.number;
      });
    });
  });
};

const resultBtnHandler = () => {
  document.querySelectorAll(".result_button").forEach((el) => {
    el.addEventListener("click", (event) => {
      updateInput(calculator.calculate);
    });
  });
};

const operatorBtnHandler = () => {
  document.querySelectorAll(".operator_button").forEach((el) => {
    el.addEventListener("click", (event) => {
      updateInput(() => {
        if (calculator.preValue) {
          calculator.operator = event.target.dataset.operator;
        }
      });
    });
  });
};

resultBtnHandler();
clearHandler();
operatorBtnHandler();
numberBtnHandler();
