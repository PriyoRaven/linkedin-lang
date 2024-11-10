function addTranslateToChats() {
  const chatMessages = document.querySelectorAll(
    ".msg-s-event-listitem__message-bubble"
  );

  chatMessages.forEach((message) => {
    if (!message.querySelector(".translate-text")) {
      const translateText = document.createElement("div");
      translateText.textContent = "Translate";
      translateText.classList.add("translate-text");

      message.appendChild(translateText);
    }
  });
}

setInterval(addTranslateToChats, 3000);
