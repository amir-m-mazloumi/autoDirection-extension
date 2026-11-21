
"use strict";

// Persian and Arabic Unicode ranges
const PERSIAN_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const ENGLISH_REGEX = /[a-zA-Z]/;


// Detect text direction based on first meaningful character
function detectDirection(text) {

    if (!text) return null;

    for (const char of text) {

        if (PERSIAN_REGEX.test(char)) {
            return "rtl";
        }

        if (ENGLISH_REGEX.test(char)) {
            return "ltr";
        }
    }

    return null;
}


// Get only direct text nodes of an element
function getDirectText(element) {

    let text = "";

    for (const node of element.childNodes) {

        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
        }
    }

    return text.trim();
}


// Get text from form elements and other special elements
function getElementText(element) {

    const tag = element.tagName;

    // Input elements
    if (tag === "INPUT") {

        const type = (element.type || "").toLowerCase();

        if (["password", "hidden", "file", "checkbox", "radio", "color", "range", "image"].includes(type)) {
            return "";
        }

        return element.value || element.placeholder || "";
    }

    // Textarea
    if (tag === "TEXTAREA") {
        return element.value || element.placeholder || "";
    }

    // Select
    if (tag === "SELECT") {
        return element.selectedOptions?.[0]?.textContent || "";
    }

    // Button-like elements
    if (tag === "BUTTON") {
        return getDirectText(element);
    }

    // Other elements
    return getDirectText(element);
}


// Apply direction to an element
function applyDirection(element) {

    if (!(element instanceof HTMLElement)) {
        return;
    }

    const text = getElementText(element);

    if (!text) return;

    const direction = detectDirection(text);

    if (!direction) return;

    element.setAttribute("dir", direction);

    element.style.setProperty(
        "direction",
        direction,
        "important"
    );
}


// Process one element and its descendants
function processElement(element) {

    if (!(element instanceof Element)) return;

    applyDirection(element);

    for (const child of element.children) {
        processElement(child);
    }
}


// Process entire document
function applyToDocument() {

    processElement(document.documentElement);

}


// Handle dynamic changes
const observer = new MutationObserver((mutations) => {

    for (const mutation of mutations) {

        if (mutation.type === "childList") {

            for (const node of mutation.addedNodes) {

                if (node instanceof Element) {
                    processElement(node);
                }
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


// Update direction while typing
document.addEventListener("input", (event) => {

    if (event.target instanceof Element) {
        applyDirection(event.target);
    }

}, true);


// Handle changes in select elements
document.addEventListener("change", (event) => {

    if (event.target instanceof Element) {
        applyDirection(event.target);
    }

}, true);


// Listen for toolbar click
chrome.runtime.onMessage.addListener((message) => {

    if (message.action === "APPLY_DIRECTION") {
        applyToDocument();
    }

});


// Start extension
applyToDocument();


// Observe dynamic content
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
