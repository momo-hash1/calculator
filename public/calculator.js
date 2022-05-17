const number_output = {
  number_view: document.querySelector(".exp-nums"),
  view: document.querySelector(".exp-view"),
  x: 0,
  numbers: "8*sin(78+98)",
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
    const maxScroll = this.number_view.scrollWidth - 315;
    if (leftPredicate && this.x !== 0) {
      this.x += 20;
    }
    if (rightPredicate && -this.x < maxScroll) {
      this.x -= 20;
    }
    this.number_view.style.transform = `translateX(${this.x}px)`;
  },
  addCharacter(char) {
    this.numbers += char;
    this.number_view.textContent = this.numbers;
    this.x = this.number_view.scrollWidth - 315;
    this.number_view.style.transform = `translateX(${-this.x}px)`;
  },
  removeLastCharacter() {
    this.numbers = this.numbers.slice(0, -1);
    this.number_view.textContent = this.numbers;
    this.x = this.number_view.scrollWidth - 315;
    this.number_view.style.transform = `translateX(${-this.x}px)`;
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
      if (!isNaN(parseInt(number_output.numbers.at(-1)))) {
        number_output.addCharacter(button.textContent)
      }
    });
  });
};

const clearHandler = () => {
  document.querySelector(".clear").addEventListener("click", () => {
    number_output.removeLastCharacter();
  });
};

toolboxHandler();
keyboardHandler();
operationsHandler();
clearHandler();

number_output.wheelScroll();
number_output.mobileSelection();
number_output.mouseSelection();
