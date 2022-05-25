import calculate from "./calculate/calculate";

const number_output = {
  number_view: document.querySelector(".exp-nums"),
  view: document.querySelector(".exp-view"),
  x: 0,
  numbers: "",
  result: null,
  wheelScroll() {
    this.view.addEventListener("wheel", (e) => {
      e.preventDefault();
      this._basic_scroll(e.deltaY < 0, e.deltaY > 0);
    });
  },
  mobileScroll() {
    this.number_view.addEventListener("touchstart", (e) => {
      let prevX = e.touches[0].clientX;
      this.number_view.addEventListener("touchmove", (e) => {
        let currX = e.touches[0].clientX;
        this.scrollView(currX - prevX);
      });
    });
  },
  mobileSelection() {
    this._selection_listener(
      (fun) =>
        document.querySelector(".input").addEventListener("touchstart", fun),
      (fun) =>
        window.addEventListener("touchmove", (e) => fun(e.touches[0].clientX)),
      (fun) =>
        document.querySelector(".input").addEventListener("touchend", fun)
    );
  },
  mouseSelection() {
    this._selection_listener(
      (fun) =>
        document.querySelector(".input").addEventListener("mousedown", fun),
      (fun) => window.addEventListener("mousemove", (e) => fun(e.clientX)),
      (fun) => document.querySelector(".input").addEventListener("mouseup", fun)
    );
  },

  _selection_listener(pressListener, moveListener, releaseListener) {
    let pressed = false;
    const viewRect = this.number_view.getBoundingClientRect();

    pressListener(() => (pressed = true));
    moveListener((x) => pressed && this._selection_scroll(x, viewRect));
    releaseListener(() => (pressed = false));
  },
  _selection_scroll(x, viewRect) {
    this._basic_scroll(x < viewRect.x, x > viewRect.x + viewRect.width);
  },
  _basic_scroll(leftPredicate, rightPredicate) {
    if (leftPredicate && this.x < 0) {
      this.x += 20;
    } else if (rightPredicate && -this.x < this._getMaxScroll()) {
      this.x -= 20;
    }
    this.number_view.style.transform = `translateX(${this.x}px)`;
  },
  addCharacter(char) {
    this.numbers += char;
    this.number_view.textContent = this.numbers;
    this._returnToStart();
  },
  removeLastCharacter() {
    this.numbers = this.numbers.slice(0, -1);
    this.number_view.textContent = this.numbers;
    this._returnToStart();
  },
  _getMaxScroll() {
    return this.number_view.scrollWidth - this.number_view.clientWidth;
  },
  _returnToStart() {
    this.x = -this._getMaxScroll();
    this.number_view.style.transform = `translateX(${this.x}px)`;
  },
};

const toolboxHandler = () => {
  const toolbox_btn = document.querySelector(".trig-btn");
  const toolbox = document.querySelector(".fun-toolbox");
  document.addEventListener("click", (e) => {
    if (e.target === toolbox_btn) {
      const pos = toolbox_btn.getBoundingClientRect();
      Object.assign(toolbox.style, {
        display: "block",
        top: pos.y + "px",
        left: pos.x + "px",
      });
    } else if (e.target !== toolbox) {
      toolbox.style.display = "none";
    }
  });
};

const checkResultAndReplace = () => {
  if (typeof number_output.result === "number") {
    const expView = document.querySelector(".exp-num-view");

    number_output.numbers = number_output.result.toString();
    number_output.result = null;

    expView.style.transform = `translate(${0}px,${0}px)`;
    expView.lastElementChild.remove();

    document.querySelector(".input-messages").innerHTML = ''
  }
};
const keyboardHandler = () => {
  document.querySelectorAll(".num-btn").forEach((button) => {
    button.addEventListener("click", () => {
      checkResultAndReplace();
      number_output.addCharacter(button.textContent);
    });
  });
};

const operationsHandler = () => {
  document.querySelectorAll(".op-btn").forEach((button) => {
    button.addEventListener("click", () => {
      checkResultAndReplace();
      const prevChar = number_output.numbers.at(-1);
      if (!isNaN(parseInt(prevChar)) || prevChar === "(" || prevChar === ")") {
        number_output.addCharacter(button.textContent);
      }
    });
  });
};

const clearHandler = () => {
  document.querySelector(".clear").addEventListener("click", () => {
    checkResultAndReplace();
    number_output.removeLastCharacter();
  });
};

const paranthesesHandler = () => {
  document.querySelectorAll(".pr-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const selection = window.getSelection().toString();
      if (selection.length === 0) {
        number_output.addCharacter(button.textContent);
      } else {
        const selectionText = selection.trim();
        const wrappedText = "(" + selectionText + ")";
        number_output.numbers = number_output.numbers.replace(
          selectionText,
          wrappedText
        );

        number_output.number_view.textContent = number_output.numbers;
      }
    });
  });
};

const dotHandler = () => {
  const findNearestExpression = (expression) => {
    let resExp = "";
    for (let index = expression.length - 1; index !== 0; index--) {
      const char = expression[index];
      if (!isNaN(parseInt(char)) || char === ".") {
        resExp += char;
      } else {
        break;
      }
    }
    return resExp;
  };
  document.querySelector(".dot-btn").addEventListener("click", () => {
    checkResultAndReplace();
    const nearExp = findNearestExpression(number_output.numbers);
    if (!nearExp.includes(".") && nearExp.length !== 0) {
      number_output.addCharacter(".");
    }
  });
};

const toolboxBtnHandler = () => {
  document.querySelectorAll(".tool-item").forEach((button) => {
    button.addEventListener("click", () => {
      number_output.addCharacter(`${button.textContent.toLowerCase()}(`);
    });
  });
};
const getHeaderInput = (message) => {
  const msgElement = document.createElement("p");
  msgElement.textContent = message;
  return msgElement;
};
const getErrorMessageElement = (message) => {
  const element = getHeaderInput(message);
  element.classList.add("error-message")
  return element;
};

const getHeaderInputBtn = (message) => {
  const element = getHeaderInput(message);
  element.classList.add("input-up-btn")
  return element;
};

const equalBtnHandler = () => {
  document.querySelector(".equality").addEventListener("click", () => {
    console.log(number_output );
    const expView = document.querySelector(".exp-num-view");

    const headerBtn = getHeaderInputBtn("Return to expression");
    document.querySelector(".input-messages").append(headerBtn);
    headerBtn.addEventListener("click", () => {
      expView.style.transform = `translate(${0}px,${0}px)`;
      expView.lastElementChild.remove();
      headerBtn.remove()
      number_output.result = null
    });

    const result = document.createElement("p");
    
    const calculatedResult = calculate(number_output.numbers);
    if (typeof calculatedResult === "object") {
      document
        .querySelector(".input-messages")
        .append(getErrorMessageElement(calculatedResult.err));
    } else {
      number_output.result = calculatedResult;
      result.textContent = number_output.result;
      expView.append(result);
      expView.style.transform = `translate(${0}px,${-30}px)`;
    }
  });
};

toolboxHandler();
keyboardHandler();
operationsHandler();
clearHandler();
paranthesesHandler();
dotHandler();
toolboxBtnHandler();
equalBtnHandler();

number_output.addCharacter("");
number_output.wheelScroll();
number_output.mobileSelection();
number_output.mouseSelection();
