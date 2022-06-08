const NUM_VIEW = document.querySelector(".exp-nums");
const AMOUNT_SHOWED_CHARS = 7;
const LEFT_DIR = "left_dir";
const RIGHT_DIR = "right_dir";

const getNumOutput = () => {
  return {
    expression: "",
    scrollOffset: 0,
    cursorPosition: null,
    addCharacter(char) {
      if (this.cursorPosition === null) {
        this.expression += char;
        this.returnToStart()
      } else {
        this.expression =
          this.expression.slice(0, this.cursorPosition) +
          char +
          this.expression.slice(this.cursorPosition, this.expression.length);
      }
    },
    renderExpression(expression) {
      NUM_VIEW.innerHTML = "";
      expression.split("").forEach((char) => {
        const charEl = document.createElement("p");
        charEl.textContent = char;
        NUM_VIEW.append(charEl);
      });
    },

    scroll(direction) {
      const maxOffset = this.expression.length - AMOUNT_SHOWED_CHARS;
      if (direction === LEFT_DIR && this.scrollOffset > 0) {
        this.scrollOffset -= 1;
      } else if (direction === RIGHT_DIR && this.scrollOffset < maxOffset) {
        this.scrollOffset += 1;
      }
      this.renderExpression(this.getTruncatedExp())
    },
    returnToStart() {
      const checkLength = this.expression.length < AMOUNT_SHOWED_CHARS;
      this.scrollOffset = this.expression.length - AMOUNT_SHOWED_CHARS;
      const showedExpression = checkLength
        ? this.expression
        : this.getTruncatedExp();

      this.renderExpression(showedExpression);
    },
    mouseScroll() {
      const resolveDirection = (delta) => {
        return delta > 0 ? LEFT_DIR : RIGHT_DIR;
      };

      NUM_VIEW.addEventListener("wheel", (e) => {
        this.scroll(resolveDirection(e.deltaY));
      });
    },

    getWidthOffset() {
      return -(this.scrollOffset - 1) * WIDTH_OF_CHAR;
    },
    setTranslate(x) {
      NUM_VIEW.style.transform = `translateX(${x}px)`;
    },
    getTruncatedExp(){
      return this.expression.slice(this.scrollOffset, this.scrollOffset+AMOUNT_SHOWED_CHARS);
    }
  };
};

export default getNumOutput;
