const toolboxHandler = () => {
    const toolbox_btn = document.querySelector(".trig-btn");
    const toolbox = document.querySelector('.fun-toolbox')
    document.addEventListener('click', (e) => {
        console.log(e.target);
        if (e.target === toolbox_btn) {
            const pos = toolbox_btn.getBoundingClientRect()
            Object.assign(toolbox.style, {display: 'block', top: pos.y+"px", left: pos.x+"px"})
        }else
        if (e.target !== toolbox) {
            toolbox.style.display = 'none';
        }
    })
}

toolboxHandler()