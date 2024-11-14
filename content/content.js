// Translation function using Google Translate API which is paid but thanks to ssut for finiding a free version of it. Kinda like cracked api.
async function translateText(text, targetLang) {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation failed. Please try again.";
  }
}

function addTranslateToChats() {
  const chatMessages = document.querySelectorAll(
    ".msg-s-event-listitem__message-bubble"
  );

  chatMessages.forEach((message) => {
    if (!message.querySelector(".translate-text")) {
      const messageText = message.textContent.trim();
      const translateButton = document.createElement("div");
      translateButton.classList.add("translate-text");

      const translateImage = document.createElement("img");
      translateImage.src = chrome.runtime.getURL("images/testimg.png");
      translateImage.alt = "Translate";
      translateImage.classList.add("translate-image");

      translateButton.appendChild(translateImage);
      message.appendChild(translateButton);

      // Add click event for translation
      translateButton.addEventListener("click", async () => {
        // Check if translation already exists
        if (message.querySelector(".translated-message")) {
          return;
        }

        // Get saved target language
        chrome.storage.sync.get(["targetLanguage"], async function (result) {
          const targetLang = result.targetLanguage || "en";

          // Show loading state
          const loadingDiv = document.createElement("div");
          loadingDiv.classList.add("translated-message");
          loadingDiv.textContent = "Translating...";
          message.appendChild(loadingDiv);

          // Perform translation
          const translatedText = await translateText(messageText, targetLang);

          // Update with translated text
          loadingDiv.textContent = translatedText;
        });
      });
    }
  });
}

// Initialize translation buttons
setInterval(addTranslateToChats, 1000);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    addTranslateToChats();
  }
  return true;
});
