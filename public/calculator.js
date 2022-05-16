const number_output = {
  number_view: document.querySelector(".exp-nums"),
  view: document.querySelector(".exp-view"),
  x: 0,
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
    this.number_view.textContent += char;
    const maxScroll = this.number_view.scrollWidth - 315;
    this.number_view.style.transform = `translateX(${-maxScroll}px)`;
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

toolboxHandler();

number_output.wheelScroll();
number_output.mobileSelection();
number_output.mouseSelection();
