document.addEventListener("DOMContentLoaded", () => {
    const shell = document.querySelector(".signal-shell");

    if (!shell) {
        return;
    }

    requestAnimationFrame(() => {
        shell.classList.add("visible");
    });
});
