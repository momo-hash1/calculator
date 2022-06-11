import calculate from "./calculate/calculate";
import getNumOutput from "./number_output";

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

const keyboardHandler = () => {
  document.querySelectorAll(".num-btn").forEach((button) => {
    button.addEventListener("click", () => {
      number_output.addCharacter(button.textContent);
    });
  });
};

const operationsHandler = () => {
  document.querySelectorAll(".op-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const prevChar = number_output.expression.at(-1);
      if (!isNaN(parseInt(prevChar)) || prevChar === "(" || prevChar === ")") {
        number_output.addCharacter(button.textContent);
      }
    });
  });
};

const clearHandler = () => {
  document.querySelector(".clear").addEventListener("click", () => {
    number_output.removeCharacter();
  });
};

const paranthesesHandler = () => {
  document.querySelectorAll(".pr-btn").forEach((button) => {
    button.addEventListener("click", () => {
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
    const prevExp = number_output.expression
    const headerBtn = getHeaderInputBtn(prevExp);


    headerBtn.addEventListener("click", () => {
      headerBtn.remove();
      number_output.expression = prevExp
      number_output.renderExpression(number_output.getTruncatedExp())
    });

    const calculatedResult = calculate(number_output.expression);

    if (typeof calculatedResult === "object") {
      // document
      //   .querySelector(".input-messages")
      //   .append(getErrorMessageElement(calculatedResult.err));
      alert(calculatedResult.err)
    } else {
      document.querySelector(".input-messages").append(headerBtn);
      number_output.expression = `${calculate(number_output.expression)}`
      number_output.scrollOffset = 0
      number_output.cursorPosition = null
      number_output.renderExpression(number_output.expression)
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


number_output.mouseScroll();
number_output.swipeScroll();
number_output.setCursor();
