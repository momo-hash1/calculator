import calculate from "./calculate/calculate";
import getNumOutput from "./calculator_ui/number_output";

const number_output = getNumOutput();

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

    document.querySelector(".input-messages").innerHTML = "";
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

      number_output.addCharacter(button.textContent);
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
    const nearExp = findNearestExpression(number_output.expression);
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
  element.classList.add("error-message");
  return element;
};

const getHeaderInputBtn = (message) => {
  const element = getHeaderInput(message);
  element.classList.add("input-up-btn");
  return element;
};

const equalBtnHandler = () => {
  document.querySelector(".equality").addEventListener("click", () => {
    const expView = document.querySelector(".exp-num-view");

    const headerBtn = getHeaderInputBtn("Return to expression");
    document.querySelector(".input-messages").append(headerBtn);
    headerBtn.addEventListener("click", () => {
      expView.style.transform = `translate(${0}px,${0}px)`;
      expView.lastElementChild.remove();
      headerBtn.remove();
      number_output.result = null;
    });

    const result = document.createElement("p");

    const calculatedResult = calculate(number_output.expression);
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

// number_output.addCharacter("");
// number_output.wheelScroll();
// number_output.mobileSelection();
// number_output.mouseSelection();
number_output.mouseScroll();
number_output.swipeScroll();
number_output.setCursor();
