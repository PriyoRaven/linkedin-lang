function addTranslateToChats() {
  const chatMessages = document.querySelectorAll(
    ".msg-s-event-listitem__message-bubble"
  );

  chatMessages.forEach((message) => {
    if (!message.querySelector(".translate-text")) {
      const translateText = document.createElement("div");
      translateText.classList.add("translate-text");

      // Image element is here
      const translateImage = document.createElement("img");
      translateImage.src = chrome.runtime.getURL("images/testimg.png");
      translateImage.alt = "Translate";
      translateImage.classList.add("translate-image");
      // translateImage.style.width = "20px";
      // translateImage.style.height = "20px";

      translateText.appendChild(translateImage);
      message.appendChild(translateText);
    }
  });
}

setInterval(addTranslateToChats, 3000);
