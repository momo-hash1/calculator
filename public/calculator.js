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
      if (calculator.value) {
        calculator.value = calculator.value.slice(0, -1);
      } else {
        if (calculator.operator) {
          calculator.operator = calculator.operator.slice(0, -1);
        } else {
          calculator.operationStack.pop();
        }
      }
    }
  },
  clear() {
    calculator.value = "";
    calculator.operator = "";
  },
};

const renderGraph = () => {
  const canvas = document.querySelector("#graphview-canvas");
  const ctx = canvas.getContext("2d");
  if (!switcher.animation) {
    canvas.setAttribute("width", document.querySelector(".switch").clientWidth);
    canvas.setAttribute("height", 400);
    ctx.beginPath()
    ctx.moveTo(0,400 / 2)
    ctx.lineTo(document.querySelector(".switch").clientWidth, 400 / 2)

    ctx.moveTo(document.querySelector(".switch").clientWidth/ 2, 0)
    ctx.lineTo(document.querySelector(".switch").clientWidth/ 2, 400)
    
    ctx.stroke()
  }

  requestAnimationFrame(renderGraph);
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

const switcher = {
  pos: 0,
  animation: false,
  calcSideItem: document.querySelectorAll(".calc-side-item"),
  setSelectedView(view){
    const prev = [...this.calcSideItem].filter((item) => item.classList.contains('btn-primary'))
    this.calcSideItem.forEach((element) => {
        if (element.dataset.view === view ) {
          this.changeView(this.calculateDistance(prev[0].dataset.view, element.dataset.view))
          element.classList.replace("btn-light", "btn-primary");
        } else {
          element.classList.replace("btn-primary", "btn-light");
        }
    });
  },
  init(){
    this.calcSideItem.forEach((element) => {
      element.addEventListener("click", (event) => {
        this.animation = true
        this.setSelectedView(event.target.dataset.view);
      });
    });
    this.calcSideItem[0].classList.replace("btn-light", "btn-primary")
  },
  calculateDistance(prev, current) {
    let tabViews = [...this.calcSideItem]
    tabViews = tabViews.map((el) => el.dataset.view)
    let distance = [...tabViews].splice(tabViews.indexOf(current), 1).length 
    distance *= tabViews.indexOf(current) >= tabViews.indexOf(prev) ?  -1 : 1
    return distance * 400
  },
  changeView(distance){
    const _switch = document.querySelector('.wrapper')
    let currentScroll = 0
    const animateChangingView = () => {
      // TODO fix animation

      if (currentScroll !== Math.abs(distance) && Math.abs(this.pos) < this.calcSideItem.length * 400) {
         currentScroll += 20
        if (distance < 0) {this.pos -=  20}else{ this.pos +=  20}
      }else{
        this.animation = false
      }
      _switch.style.transform = `translateY(${this.pos}px)`
        requestAnimationFrame(animateChangingView)
    }
    animateChangingView()
    renderGraph()
  }
}

const btnHandlers = () => {
  inputHandler(resultBtnHandler, ".result_button");
  clearHandler();
  inputHandler(operatorBtnHandler, ".operation_buttons");
  inputHandler(numberBtnHandler, ".number_button");
};

const init = () => {
  switcher.init()
  btnHandlers();
}

init()