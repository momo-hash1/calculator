const NUM_VIEW = document.querySelector(".exp-nums");
const AMOUNT_SHOWED_CHARS = 7;
const LEFT_DIR = "left_dir";
const RIGHT_DIR = "right_dir";
const WIDTH_OF_CHAR = 27;

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
        this.returnToStart();
      } else {
        this.expression =
          this.expression.slice(0, this.cursorPosition) +
          char +
          this.expression.slice(this.cursorPosition, this.expression.length);
        if (this.expression.length > AMOUNT_SHOWED_CHARS) {
          this.scrollOffset += char.length;
        }
        this.renderExpression(this.getTruncatedExp());
      }
    },
    removeCharacter() {
      console.log(this.cursorPosition)

      if (this.cursorPosition === null) {
        this.expression = this.expression.slice(0, -1);
        this.returnToStart();
      } else if (this.cursorPosition > 0) {
        this.expression =
          this.expression.slice(0, this.cursorPosition - 1) +
          this.expression.slice(this.cursorPosition);
        this.cursorPosition -= 1;
          if (this.cursorPosition === 0) {
            this.cursorPosition = null;
          }
        this.renderExpression(this.getTruncatedExp());
      }
    },
    renderExpression(expression) {
      const getCursor = () => {
        const cursor = document.createElement("div");
        cursor.classList.add("_cursor");
        return cursor;
      };

      NUM_VIEW.innerHTML = "";
      const actualCurPos = this.cursorPosition - this.scrollOffset;

      expression.split("").forEach((char, index) => {
        if (index === actualCurPos && this.cursorPosition !== null) {
          NUM_VIEW.append(getCursor());
        }
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
      this.renderExpression(this.getTruncatedExp());
    },
    returnToStart() {
      const checkLength = this.expression.length < AMOUNT_SHOWED_CHARS;
      let showedExpression = this.expression;
      if (!checkLength) {
        showedExpression = this.getTruncatedExp();
        this.scrollOffset = this.expression.length - AMOUNT_SHOWED_CHARS;
      }
      this.renderExpression(showedExpression);
    },
    mouseScroll() {
      NUM_VIEW.addEventListener("wheel", (e) => {
        this.scroll(resolveDirection(e.deltaY), 1);
      });
    },
    swipeScroll() {
      let prevPos = 0;
      let prevAmount = 0;
      document
        .querySelector(".exp-wrapper")
        .addEventListener("touchstart", (e) => {
          prevPos = e.touches[0].clientX;

          e.target.addEventListener("touchmove", (e) => {
            let currPos = e.touches[0].clientX;
            let currAmount = Math.round((prevPos - currPos) / WIDTH_OF_CHAR);
            diffPrev = prevAmount - currAmount;

            this.scroll(resolveDirection(diffPrev), Math.abs(diffPrev));

            prevAmount = currAmount;
          });
          e.target.addEventListener("touchend", () => {
            prevAmount = 0;
            prevPos = 0;
          });
        });
    },
    setCursor() {
      NUM_VIEW.addEventListener("click", (e) => {
        const boundRect = e.target.getBoundingClientRect();
        const posOfView = NUM_VIEW.getBoundingClientRect().x;
        const middle = boundRect.x + boundRect.width / 2;
        if (e.clientX < middle) {
          this.cursorPosition = Math.round(
            (boundRect.x - posOfView) / WIDTH_OF_CHAR
          );
        } else {
          this.cursorPosition = Math.round(
            (boundRect.x + boundRect.width - posOfView) / WIDTH_OF_CHAR
          );
        }

        this.cursorPosition += this.scrollOffset;

        this.renderExpression(this.getTruncatedExp());
      });
    },
    getTruncatedExp() {
      return this.expression.slice(
        this.scrollOffset,
        this.scrollOffset + AMOUNT_SHOWED_CHARS
      );
    },
  };
};

export default getNumOutput;
