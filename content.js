
"use strict";

// Prevent duplicate initialization
if (window.__autoDirectionInitialized) {
    // Re-scan when the extension icon is clicked
    window.__autoDirectionApply?.();
} else {

window.__autoDirectionInitialized = true;

const PERSIAN_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const ENGLISH_REGEX = /[a-zA-Z]/;

const processed = new WeakMap();


// Detect direction based on the entire text
function detectDirection(text) {

    if (!text) return null;

    // If text contains at least one Persian/Arabic character
    if (PERSIAN_REGEX.test(text)) {
        return "rtl";
    }

    // If text contains English characters and no Persian characters
    if (ENGLISH_REGEX.test(text)) {
        return "ltr";
    }

    return null;
}


// Extract direct text
function getDirectText(element) {

    let text = "";

    for (const node of element.childNodes) {

        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
        }

    }

    return text.trim();
}


// Extract element content
function getElementText(element) {

    const tag = element.tagName.toLowerCase();

    // Form elements
    if (tag === "input" || tag === "textarea") {
        return element.value || element.placeholder || "";
    }

    if (tag === "select") {
        return element.selectedOptions?.[0]?.textContent || "";
    }

    // Ignore code blocks
    if (tag === "pre" || tag === "code") {
        return "";
    }

    // Elements containing complete text content
    const textElements = [
        "p", "h1", "h2", "h3",
        "h4", "h5", "h6",
        "li", "blockquote",
        "figcaption", "dt", "dd"
    ];

    if (textElements.includes(tag)) {
        return element.textContent.trim();
    }

    // Other elements: inspect only direct text
    return getDirectText(element);
}


// Apply direction
function applyDirection(element) {

    if (!(element instanceof HTMLElement)) return;

    const text = getElementText(element);
    const direction = detectDirection(text);

    if (!direction) return;

    const previous = processed.get(element);

    // Avoid unnecessary DOM modifications
    if (
        previous === direction &&
        element.getAttribute("dir") === direction
    ) {
        return;
    }

    element.setAttribute("dir", direction);

    element.style.setProperty(
        "direction",
        direction,
        "important"
    );

    processed.set(element, direction);
}


// Process a complete subtree
function processElement(element) {

    if (!(element instanceof Element)) return;

    applyDirection(element);

    for (const child of element.children) {
        processElement(child);
    }

}


// Process added nodes, including TEXT_NODE
function processNode(node) {

    if (node instanceof Element) {

        processElement(node);

    } else if (node.nodeType === Node.TEXT_NODE) {

        if (node.parentElement) {
            applyDirection(node.parentElement);
        }

    }

}


// Full document scan
function applyToDocument() {

    processElement(document.documentElement);

}


// Handle dynamic DOM changes
const observer = new MutationObserver((mutations) => {

    for (const mutation of mutations) {

        if (mutation.type === "childList") {

            // New text or elements
            for (const node of mutation.addedNodes) {
                processNode(node);
            }

            // Recheck direct text of parent
            if (mutation.target instanceof Element) {
                applyDirection(mutation.target);
            }

        }

        else if (mutation.type === "characterData") {

            const parent = mutation.target.parentElement;

            if (parent) {
                applyDirection(parent);
            }

        }

        else if (mutation.type === "attributes") {

            if (mutation.target instanceof Element) {
                applyDirection(mutation.target);
            }

        }

    }

});


// Start observing before initial scan
observer.observe(document.documentElement, {

    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,

    attributeFilter: [
        "value",
        "placeholder",
        "title",
        "aria-label"
    ]

});


// Input events
function handleInput(event) {

    if (event.target instanceof Element) {
        applyDirection(event.target);
    }

}

document.addEventListener("input", handleInput, true);
document.addEventListener("change", handleInput, true);
document.addEventListener("compositionend", handleInput, true);


// Manual re-scan
window.__autoDirectionApply = applyToDocument;

chrome.runtime.onMessage.addListener((message) => {

    if (message.action === "APPLY_DIRECTION") {
        applyToDocument();
    }

});


// Initial scan
applyToDocument();

}
