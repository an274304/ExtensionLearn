chrome.runtime.onInstalled.addListener(() => {
    console.log("IRCTC Autofill Extension Installed");
});

// Listen for messages to trigger automation
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openAndAutomate") {
        chrome.tabs.create({ url: "https://www.irctc.co.in/nget/train-search" }, (tab) => {
            console.log("New tab opened: " + (tab.url || "unknown"));

            // Inject content script initially
            const injectContentScript = (tabId) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["js/content.js"],
                }, (injectionResults) => {
                    if (chrome.runtime.lastError) {
                        console.error("Script injection error:", chrome.runtime.lastError.message);
                        return;
                    }
                    console.log("Content script injected successfully.");
                });
            };

            // Listen for tab updates (navigation to `/train-list` or `/psgninput`)
            const listener = (tabId, changeInfo) => {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.get(tabId, (tabInfo) => {
                        if (tabInfo.url.includes("/train-list")) {
                            console.log("Navigated to train-list. Re-injecting content script...");
                            injectContentScript(tabId);
                        }
                        else if (tabInfo.url.includes("/psgninput")) {
                            console.log("Navigated to psgninput. Re-injecting content script...");
                            injectContentScript(tabId);
                        }
                        else if (tabInfo.url.includes("/bkgPaymentOptions")) {
                            console.log("Navigated to bkgPaymentOptions. Re-injecting content script...");
                            injectContentScript(tabId);
                        }
                    });
                }
            };

            chrome.tabs.onUpdated.addListener(listener);
            injectContentScript(tab.id); // Initial injection for `/train-search`
        });

        return true; // Keeps the message channel open for asynchronous response
    }
});
