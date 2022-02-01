// TODO fix sqrt
import calculate from "./calculate.js";



let calculator = {
  operator: "",
  value: "",
  operationStack: [],
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
  replaceX(x) {
    this.operationStack = this.operationStack.map((op) =>
      op === "x" ? x : op
    );
  },
};

const checkPowerFun = () => {
  if (calculator.operationStack.includes('^')) {
    return true
  }
}

const graph = {
  y: 400 / 2,
  x: document.querySelector(".switch").clientWidth / 2,
  canvas: document.querySelector("#graphview-canvas"),
  currentExp: [""],
  scale: 0,
  calc_x: 0,
  ctx: "",
  init() {
    this.canvas.setAttribute(
      "width",
      document.querySelector(".switch").clientWidth
    );
    this.canvas.setAttribute("height", 400);
    checkPowerFun() ? 0.01 : -1500
    this.plot_axes();
    this.move();
  },
  plot_axes() {
    const ctx = graph.canvas.getContext("2d");
    ctx.clearRect(0, 0, document.querySelector(".switch").clientWidth, 400);

    ctx.beginPath();

    ctx.moveTo(0, this.y);
    ctx.lineTo(document.querySelector(".switch").clientWidth, this.y);

    ctx.moveTo(this.x, 0);
    ctx.lineTo(this.x, 400);

    ctx.stroke();
  },
  drawGraph() {
    const drawPoint = () => {
      ctx.beginPath();
      ctx.rect(
        graph.x - graph.calc_x,
        graph.y + calculator.value * this.scale,
        0.5,
        0.5
      );
      ctx.stroke();
    };
    const calculatePoint = () => {
      graph.calc_x += 1;
      calculator.operationStack = graph.currentExp.slice();
      calculator.replaceX(graph.calc_x);
      calculator.calculate();
      if (calculator.value !== null) {
        drawPoint();
      }
    };

    const ctx = graph.canvas.getContext("2d");
    this.calc_x = -this.calc_x;
    if (this.currentExp !== 0) {
      while (this.calc_x <= document.querySelector('.switch').clientWidth + Math.abs(this.x) * 2) calculatePoint()
    }
  },
  move() {
    let prev_x = 0;
    let prev_y = 0;

    this.canvas.addEventListener("mousedown", (e) => {
      prev_x = e.offsetX;
      prev_y = e.offsetY;
    });
    this.canvas.addEventListener("mouseup", (e) => {
      this.x += e.offsetX - prev_x;
      this.y += e.offsetY - prev_y;
      logPos();
      this.plot_axes();
      this.drawGraph();
    });
    this.canvas.addEventListener("wheel", (event) => {
      if (checkPowerFun()) {
        this.scale += event.deltaY > 0 ? 0.01 : 0.01
      } else {
        this.scale += event.deltaY
      }
      logPos();

      this.plot_axes();
      this.drawGraph();
    });
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
    if (calculator.operationStack.includes("x")) {
      graph.currentExp = calculator.operationStack.slice();
    } else {
      calculator.calculate();
    }
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
  setSelectedView(view) {
    const prev = [...this.calcSideItem].filter((item) =>
      item.classList.contains("btn-primary")
    );
    this.calcSideItem.forEach((element) => {
      if (element.dataset.view === view) {
        this.changeView(
          this.calculateDistance(prev[0].dataset.view, element.dataset.view)
        );
        element.classList.replace("btn-light", "btn-primary");
      } else {
        element.classList.replace("btn-primary", "btn-light");
      }
    });
  },
  init() {
    this.calcSideItem.forEach((element) => {
      element.addEventListener("click", (event) => {
        this.animation = true;
        this.setSelectedView(event.target.dataset.view);
      });
    });
    this.calcSideItem[0].classList.replace("btn-light", "btn-primary");
  },
  calculateDistance(prev, current) {
    let tabViews = [...this.calcSideItem];
    tabViews = tabViews.map((el) => el.dataset.view);
    let distance = [...tabViews].splice(tabViews.indexOf(current), 1).length;
    distance *= tabViews.indexOf(current) >= tabViews.indexOf(prev) ? -1 : 1;
    return distance * 400;
  },
  changeView(distance) {
    const _switch = document.querySelector(".wrapper");
    let currentScroll = 0;
    const animateChangingView = () => {
      // TODO fix animation

      if (
        currentScroll !== Math.abs(distance) &&
        Math.abs(this.pos) < this.calcSideItem.length * 400
      ) {
        currentScroll += 20;
        if (distance < 0) {
          this.pos -= 20;
        } else {
          this.pos += 20;
        }
      } else {
        this.animation = false;
      }
      _switch.style.transform = `translateY(${this.pos}px)`;
      requestAnimationFrame(animateChangingView);
    };
    animateChangingView();
  },
};

const btnHandlers = () => {
  inputHandler(resultBtnHandler, ".result_button");
  clearHandler();
  inputHandler(operatorBtnHandler, ".operation_buttons");
  inputHandler(numberBtnHandler, ".number_button");
};

const init = () => {
  calculator.value = "";
  switcher.init();
  graph.init();
  btnHandlers();
};

init();

const debug = true;
const logPos = () =>
  console.log(`x=${graph.x}y=${graph.y}scale=${graph.scale}`) && debug === true;
