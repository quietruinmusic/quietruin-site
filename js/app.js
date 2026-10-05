const navigation = document.getElementById("navigation");

let revealed = false;

const revealNavigation = (delay = 250) => {
    if (revealed || !navigation) {
        return;
    }

    revealed = true;

    window.setTimeout(() => {
        navigation.classList.add("visible");
    }, delay);
};

if (navigation && !window.matchMedia("(max-width: 820px)").matches) {
    document.addEventListener("mousemove", revealNavigation);
}
