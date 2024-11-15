// This script runs in the background and manages the extension's functionality.
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Below part is executed when the extension is installed for the first time to set the default values
    chrome.storage.sync.set({
      targetLanguage: "en",
      isEnabled: true,
      translationCount: 0,
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // Check for LinkedIn site or not
    const isLinkedIn = tab.url && tab.url.includes("linkedin.com");

    // Update extension icon based on the site
    updateExtensionIcon(isLinkedIn);

    // Inject content script if needed
    if (isLinkedIn) {
      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ["content.js"],
        })
        .catch((err) => console.error("Script injection failed:", err));
    }
  }
});

// Function to update extension icon
function updateExtensionIcon(isLinkedIn) {
  const iconPath = isLinkedIn
    ? {
        16: "images/testimg.png",
        48: "images/testimg.png",
        128: "images/testimg.png",
      }
    : {
        16: "images/testimg-disabled.png",
        48: "images/testimg-disabled.png",
        128: "images/testimg-disabled.png",
      };

  chrome.action.setIcon({ path: iconPath });
}

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "getTabInfo":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const isLinkedIn = tabs[0]?.url?.includes("linkedin.com") || false;
        sendResponse({ isLinkedIn });
      });
      return true;

    case "translateText":
      handleTranslation(request.text, request.targetLang)
        .then((result) => sendResponse({ success: true, translation: result }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "updateStats":
      updateTranslationStats();
      return true;
  }
});

// Function to clean up any emojis or symbols which is causing issues with translation
function cleanTranslation(text) {
  return text.replace(/[\u{1F300}-\u{1F6FF}]/gu, "");
}

function updateTranslationStats() {
  chrome.storage.sync.get(["translationCount"], (result) => {
    const count = result.translationCount || 0;
    if (count % 100 === 0 && count > 0) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/testimg.png",
        title: "Translation Milestone!",
        message: `You've translated ${count} messages with LinkedTranslate!`,
      });
    }
  });
}

// Handle extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Create context menu items
    chrome.contextMenus.create({
      id: "translateSelection",
      title: "Translate Selection",
      contexts: ["selection"],
    });
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateSelection") {
    chrome.storage.sync.get(["targetLanguage"], (result) => {
      const targetLang = result.targetLanguage || "en";
      handleTranslation(info.selectionText, targetLang)
        .then((translation) => {
          // Send translation back to content script
          chrome.tabs.sendMessage(tab.id, {
            action: "showTranslation",
            translation: translation,
          });
        })
        .catch((error) => console.error("Translation failed:", error));
    });
  }
});
