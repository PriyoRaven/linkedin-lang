// popup/popup.js
document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.includes("linkedin.com")) {
    document.getElementById("first-popup").classList.add("hidden");
    document.getElementById("inside-LinkedIn").classList.remove("hidden");
  } else {
    document.getElementById("first-popup").classList.remove("hidden");
    document.getElementById("inside-LinkedIn").classList.add("hidden");
  }
});
