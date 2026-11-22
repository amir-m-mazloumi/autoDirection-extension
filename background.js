
"use strict";

chrome.action.onClicked.addListener(async (tab) => {

    if (!tab.id) return;

    try {

        // Try communicating with existing content script
        await chrome.tabs.sendMessage(tab.id, {
            action: "APPLY_DIRECTION"
        });

    } catch (error) {

        // Content script is not available.
        // Inject it without reloading the page.

        try {

            await chrome.scripting.executeScript({
                target: {
                    tabId: tab.id,
                    allFrames: true
                },
                files: ["content.js"]
            });

        } catch (injectionError) {

            console.error(
                "Auto Direction injection failed:",
                injectionError
            );

        }

    }

});
