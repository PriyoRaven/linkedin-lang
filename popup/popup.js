document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.includes("linkedin.com")) {
    document.getElementById("first-popup").classList.add("hidden");
    document.querySelector("#translatorOptions").classList.remove("hidden");
  }
});
