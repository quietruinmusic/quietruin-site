document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".reveal");

    if (!sections.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        sections.forEach((section) => section.classList.add("visible"));
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
        threshold: 0.14,
        rootMargin: "0px 0px -6% 0px"
    });

    sections.forEach((section) => observer.observe(section));
});
