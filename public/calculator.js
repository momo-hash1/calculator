let calculator = {
  preValue: "",
  operator: "",
  pastValue: "",
  result: "",
  calculate() {
    switch (this.operator) {
      case "+":
        this.result = this.preValue + this.pastValue;
      case "-":
        this.result = this.preValue - this.pastValue;
      case "/":
        this.result = this.preValue / this.pastValue;
      case "*":
        this.result = this.preValue * this.pastValue;
    }
  },
  removeValueByValue() {
    let handleValue = calculator.operator ? "pastValue" : "preValue";
    calculator[handleValue] = calculator[handleValue].slice(0, -1);
    if (!calculator.pastValue) {
      calculator.operator = "";
    }
  },
};

const updateInput = (callback) => {
  callback();
  document.querySelector(
    "#inputNumber"
  ).textContent = `${calculator.preValue} ${calculator.operator} ${calculator.pastValue}`;
};

const clearHandler = () => {
  document.querySelector("#clear").addEventListener("click", () => {
    updateInput(calculator.removeValueByValue.bind(this, calculator));
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

const operatorBtnHandler = () => {
  document.querySelectorAll(".operator_button").forEach((el) => {
    el.addEventListener("click", (event) => {
      updateInput(() => {
        calculator.operator = event.target.dataset.operator;
      });
    });
  });
};

clearHandler();
operatorBtnHandler();
numberBtnHandler();
