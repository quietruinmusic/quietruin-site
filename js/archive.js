document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".reveal");

    if (!items.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px"
    });

    items.forEach((item) => observer.observe(item));
});
