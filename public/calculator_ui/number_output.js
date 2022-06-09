const NUM_VIEW = document.querySelector(".exp-nums");
const AMOUNT_SHOWED_CHARS = 7;
const LEFT_DIR = "left_dir";
const RIGHT_DIR = "right_dir";
const WIDTH_OF_CHAR = 27

const resolveDirection = (delta) => {
  return delta > 0 ? LEFT_DIR : RIGHT_DIR;
};

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

    scroll(direction, offset) {
      const maxOffset = this.expression.length - AMOUNT_SHOWED_CHARS;
      if (direction === LEFT_DIR && this.scrollOffset > 0) {
        this.scrollOffset -= offset;
      } else if (direction === RIGHT_DIR && this.scrollOffset < maxOffset) {
        this.scrollOffset += offset;
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
      NUM_VIEW.addEventListener("wheel", (e) => {
        this.scroll(resolveDirection(e.deltaY), 1);
      });
    },
    swipeScroll(){
      let prevPos = 0
      let prevAmount = 0
      document.querySelector('.exp-wrapper').addEventListener('touchstart', (e) => {
        prevPos = e.touches[0].clientX

        e.target.addEventListener('touchmove', (e) => {
          let currPos = e.touches[0].clientX
          let currAmount = Math.round((prevPos-currPos)/WIDTH_OF_CHAR)
          diffPrev = prevAmount - currAmount

          this.scroll(resolveDirection(diffPrev), Math.abs(diffPrev))

          prevAmount = currAmount
        })
        e.target.addEventListener('touchend', () => {
          prevAmount = 0
          prevPos = 0
        })
      })
    },
    getTruncatedExp(){
      return this.expression.slice(this.scrollOffset, this.scrollOffset+AMOUNT_SHOWED_CHARS);
    }
  };
};

export default getNumOutput;
