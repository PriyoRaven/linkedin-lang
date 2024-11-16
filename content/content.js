// content/content.js
// Translation function using Google Translate API
async function translateText(text, targetLang) {
  try {
    // Split text into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);

    // Let's translate sentence by sentence
    const translatedSentences = await Promise.all(
      sentences.map(async (sentence) => {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
            sentence.trim()
          )}`
        );

        if (!response.ok) throw new Error("Translation API request failed");

        const data = await response.json();
        // this is to extract translated text or fallback to original if response is invalid
        return data[0]?.[0]?.[0] || sentence;
      })
    );

    // Join all translated parts back together
    return translatedSentences.join(" ");
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation failed. Please try again.";
  }
}

// Function to add translation buttons to received chat messages
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
      translateImage.src = chrome.runtime.getURL("images/mainimg.png");
      translateImage.alt = "Translate";
      translateImage.classList.add("translate-image");

      translateButton.appendChild(translateImage);
      message.appendChild(translateButton);

      translateButton.addEventListener("click", async () => {
        // translation exist checker here
        if (message.querySelector(".translated-message")) {
          return;
        }

        // Get saved target language
        chrome.storage.sync.get(["targetLanguage"], async function (result) {
          const targetLang = result.targetLanguage || "en";

          // Show loading state. Do I need to give a svg loader to make it look better🤔?
          const loadingDiv = document.createElement("div");
          loadingDiv.classList.add("translated-message");
          loadingDiv.textContent = "Translating...";
          message.appendChild(loadingDiv);

          const translatedText = await translateText(messageText, targetLang);

          loadingDiv.textContent = translatedText;

          // Maybe I will add this translation count feature later. It's not necessary for now
          // chrome.runtime.sendMessage({ action: "updateStats" });
        });
      });
    }
  });
}

// Function to add translation button to the input area
function addTranslateToInput() {
  const messageInputs = document.querySelectorAll(
    '.msg-form__contenteditable[contenteditable="true"]'
  );

  messageInputs.forEach((input) => {
    if (!input.parentElement.querySelector(".translate-input-button")) {
      // Translate button for input area designs and all
      const translateButton = document.createElement("div");
      translateButton.classList.add("translate-input-button");
      translateButton.style.cssText = `
        position: absolute;
        right: 10px;
        bottom: 0px;
        cursor: pointer;
        z-index: 1000;
      `;

      const translateImage = document.createElement("img");
      translateImage.src = chrome.runtime.getURL("images/mainimg.png");
      translateImage.alt = "Translate";
      translateImage.style.width = "20px";
      translateImage.style.height = "20px";

      translateButton.appendChild(translateImage);
      input.parentElement.style.position = "relative";
      input.parentElement.appendChild(translateButton);

      // Add click event for translation
      translateButton.addEventListener("click", async () => {
        const textToTranslate = input.textContent.trim();
        if (!textToTranslate) return;
        chrome.storage.sync.get(["targetLanguage"], async function (result) {
          const targetLang = result.targetLanguage || "en";
          translateButton.style.opacity = "0.5";
          const translatedText = await translateText(
            textToTranslate,
            targetLang
          );

          // Wrap both original and translated text in <p> tags
          const originalTextParagraph = document.createElement("p");
          originalTextParagraph.textContent = textToTranslate;

          const translatedTextParagraph = document.createElement("p");
          translatedTextParagraph.textContent = translatedText;

          // Create a temporary div to handle HTML content properly
          const tempDiv = document.createElement("div");
          tempDiv.appendChild(originalTextParagraph);
          tempDiv.appendChild(translatedTextParagraph);

          // Clear existing content and append new content
          input.innerHTML = tempDiv.innerHTML;

          // Put cursor to the end of the input area
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(input);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);

          // Trigger input event to update LinkedIn's UI
          input.dispatchEvent(new Event("input", { bubbles: true }));
          translateButton.style.opacity = "1";

          // Update translation count for milestone notifications which I will add later
          // chrome.runtime.sendMessage({ action: "updateStats" });
        });
      });
    }
  });
}

// Initialize both translation features
function initializeTranslation() {
  addTranslateToChats(); // For received messages
  addTranslateToInput(); // For input translation
}

// Run initialization periodically to catch dynamically added elements
setInterval(initializeTranslation, 1000);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    initializeTranslation();
  }
  return true;
});

// Handle dynamic content changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      initializeTranslation();
    }
  });
});

// Observe body for dynamic changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
