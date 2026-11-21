
"use strict";

chrome.action.onClicked.addListener(async (tab) => {

    if (!tab.id) return;

    try {

        await chrome.tabs.sendMessage(tab.id, {
            action: "APPLY_DIRECTION"
        });

    } catch (error) {

        console.warn(
            "Auto Direction: Cannot access this page.",
            error.message
        );

    }

});
