const NOTES_MANIFEST_URL = "notes/manifest.json";

const escapeHtml = (value) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

const renderReveal = () => {
    const revealItems = document.querySelectorAll(".reveal");

    if (!revealItems.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("visible"));
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

    revealItems.forEach((item) => observer.observe(item));
};

const loadManifest = async () => {
    const response = await fetch(NOTES_MANIFEST_URL, { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Failed to load notes manifest");
    }
    return response.json();
};

const renderIndex = async () => {
    const leftList = document.getElementById("notes-list-left");
    const rightList = document.getElementById("notes-list-right");
    if (!leftList || !rightList) {
        return;
    }

    const manifest = await loadManifest();
    const leftNotes = manifest.notes.slice(0, 5);
    const rightNotes = manifest.notes.slice(5);

    leftList.innerHTML = leftNotes.map((note) => `
        <li class="notes-entry">
            <a class="notes-entry-link" href="note.html?slug=${encodeURIComponent(note.slug)}">
                <p class="notes-entry-title">${escapeHtml(note.title)}</p>
                <p class="notes-entry-meta">Note ${note.number}</p>
            </a>
        </li>
    `).join("");

    rightList.innerHTML = rightNotes.map((note) => `
        <li class="notes-entry">
            <a class="notes-entry-link" href="note.html?slug=${encodeURIComponent(note.slug)}">
                <p class="notes-entry-title">${escapeHtml(note.title)}</p>
                <p class="notes-entry-meta">Note ${note.number}</p>
            </a>
        </li>
    `).join("");
};

const parseMarkdown = (markdown) => {
    const cleaned = markdown.replace(/\r\n/g, "\n").trim();
    const lines = cleaned.split("\n");
    const title = lines[0].replace(/^#\s*/, "").trim();
    const body = lines.slice(1).join("\n").trim();

    const paragraphs = body
        .split(/\n\s*\n/g)
        .filter(Boolean)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, " ")}</p>`)
        .join("");

    return { title, paragraphs };
};

const renderNote = async () => {
    const article = document.getElementById("note-article");
    const nav = document.getElementById("note-nav");
    if (!article || !nav) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug") || "residue";
    const manifest = await loadManifest();
    const index = manifest.notes.findIndex((note) => note.slug === slug);
    const note = manifest.notes[index >= 0 ? index : 0];
    if (!note) {
        return;
    }

    const response = await fetch(note.file, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Failed to load note content: ${note.file}`);
    }

    const markdown = await response.text();
    const parsed = parseMarkdown(markdown);
    const noteTitle = parsed.title || note.title;
    const pageDescription = parsed.paragraphs
        ? `${noteTitle} — Quiet Ruin note essay.`
        : "Quiet Ruin note essay.";

    document.title = `Quiet Ruin - ${noteTitle}`;

    const canonicalLink = document.getElementById("canonical-link");
    if (canonicalLink) {
        canonicalLink.href = `https://quietruinmusic.com/note.html?slug=${encodeURIComponent(note.slug)}`;
    }

    const ogUrl = document.getElementById("og-url");
    if (ogUrl) {
        ogUrl.content = `https://quietruinmusic.com/note.html?slug=${encodeURIComponent(note.slug)}`;
    }

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
        descriptionMeta.content = pageDescription;
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.content = pageDescription;
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.content = `Quiet Ruin - ${noteTitle}`;
    }

    article.innerHTML = `
        <h1 class="note-title">${escapeHtml(noteTitle)}</h1>
        <div class="note-body">${parsed.paragraphs}</div>
    `;

    const prev = manifest.notes[index - 1];
    const next = manifest.notes[index + 1];
    const prevHref = prev ? `note.html?slug=${encodeURIComponent(prev.slug)}` : "notes.html";
    const nextHref = next ? `note.html?slug=${encodeURIComponent(next.slug)}` : "notes.html";
    nav.innerHTML = `
        <a href="${prevHref}">Previous Note</a>
        <a href="${nextHref}">Next Note</a>
    `;
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (document.getElementById("notes-list-left") && document.getElementById("notes-list-right")) {
            await renderIndex();
        }

        if (document.getElementById("note-article")) {
            await renderNote();
        }
    } finally {
        renderReveal();
    }
});
