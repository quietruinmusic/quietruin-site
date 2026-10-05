document.addEventListener("DOMContentLoaded", () => {
    const triggers = Array.from(document.querySelectorAll(".shop-lightbox-image"));
    if (!triggers.length) {
        return;
    }

    let overlay;
    let enlargedImage;
    let closeButton;
    let activeTrigger;
    let savedScrollPosition = 0;

    const closeViewer = () => {
        if (!overlay) {
            return;
        }

        overlay.hidden = true;
        document.body.style.overflow = "";
        window.scrollTo(0, savedScrollPosition);
        triggers.forEach((item) => {
            item.inert = false;
        });
        activeTrigger?.focus();
        activeTrigger = null;
    };

    const openViewer = (trigger) => {
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "shop-lightbox";
            overlay.setAttribute("role", "dialog");
            overlay.setAttribute("aria-modal", "true");
            overlay.setAttribute("aria-label", "Enlarged product image");

            enlargedImage = document.createElement("img");
            enlargedImage.className = "shop-lightbox-image-large";

            closeButton = document.createElement("button");
            closeButton.className = "shop-lightbox-close";
            closeButton.type = "button";
            closeButton.setAttribute("aria-label", "Close enlarged image");
            closeButton.textContent = "×";

            overlay.append(enlargedImage, closeButton);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", (event) => {
                if (event.target === overlay) {
                    closeViewer();
                }
            });
            closeButton.addEventListener("click", closeViewer);
        }

        activeTrigger = trigger;
        savedScrollPosition = window.scrollY;
        enlargedImage.src = trigger.currentSrc || trigger.src;
        enlargedImage.alt = trigger.alt;
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        triggers.forEach((item) => {
            item.inert = true;
        });
        closeButton.focus();
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => openViewer(trigger));
        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openViewer(trigger);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay && !overlay.hidden) {
            closeViewer();
        }
    });
});
