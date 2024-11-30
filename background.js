chrome.runtime.onInstalled.addListener(() => {
    console.log("IRCTC Autofill Extension Installed");
});

// Listen for messages from the popup or content script to trigger automation
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openAndAutomate") {
        // Open a new tab with the train-search URL
        chrome.tabs.create({ url: "https://www.irctc.co.in/nget/train-search" }, (tab) => {
            console.log("New tab opened: " + (tab.url || "unknown"));

            // Wait for the tab to load before injecting the content script
            const listener = (tabId, changeInfo) => {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener); // Remove listener after execution

                    // Inject the content.js script
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["js/content.js"], // Adjust path based on manifest.json
                    }, (injectionResults) => {
                        if (chrome.runtime.lastError) {
                            console.error("Script injection error:", chrome.runtime.lastError.message);
                            sendResponse({ status: "failure", message: "Failed to inject content script" });
                            return;
                        }

                        console.log("Content script injected successfully.");

                        // Call the autofill function within the content script
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: () => {
                                if (typeof autofillJourneyDetails === "function") {
                                    autofillJourneyDetails();
                                } else {
                                    console.error("Autofill function not found in content script.");
                                }
                            },
                        }, () => {
                            if (chrome.runtime.lastError) {
                                console.error("Error executing autofill function:", chrome.runtime.lastError.message);
                                sendResponse({ status: "failure", message: "Autofill function execution failed" });
                                return;
                            }

                            console.log("Automation triggered successfully.");
                            sendResponse({ status: "success", message: "Automation completed" });
                        });
                    });
                }
            };

            chrome.tabs.onUpdated.addListener(listener);
        });

        return true; // Keeps the message channel open for asynchronous response
    }
});
