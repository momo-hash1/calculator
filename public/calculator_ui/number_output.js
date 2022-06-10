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
        this.scrollOffset += 1;
        this.renderExpression(this.getTruncatedExp());
      }
    },
    renderExpression(expression) {
      const getCursor = () => {
        const cursor = document.createElement("div");
        cursor.classList.add("cursor");
        return cursor;
      };

      NUM_VIEW.innerHTML = "";
      const actualCurPos = this.cursorPosition - this.scrollOffset;
      const cursor = getCursor();
      const exp_num_view = document.querySelector(".exp-num-view");

      const appendCursorAfterNumView = () => {
        if (exp_num_view.children.length === 1) {
          exp_num_view.append(cursor);
        } else {
          cursor.remove();
        }
      };
      actualCurPos === AMOUNT_SHOWED_CHARS && appendCursorAfterNumView();
      this.cursorPosition === null && appendCursorAfterNumView();

      expression.split("").forEach((char, index) => {
        if (index === actualCurPos && this.cursorPosition !== null) {
          NUM_VIEW.append(getCursor());
          if (exp_num_view.children.length !== 1) {
            exp_num_view.lastChild.remove();
          }
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
