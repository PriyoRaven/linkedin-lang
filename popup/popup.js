// popup/popup.js
document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.includes("linkedin.com")) {
    // Display the LinkedIn-specific popup section
    document.getElementById("first-popup").classList.add("hidden");
    document.getElementById("inside-LinkedIn").classList.remove("hidden");

    // Fetch saved language preference for LinkedIn
    chrome.storage.sync.get("preferredLang", (data) => {
      const lang = data.preferredLang?.value;
      const langContent = data.preferredLang?.text;
      if (lang && langContent) {
        document.getElementById(
          "selectedLangLinkedIn"
        ).innerText = `Selected Language: ${langContent}`;
      } else {
        document.getElementById("selectedLangLinkedIn").innerText =
          "Please select a language from the dropdown.";
      }
    });

    // Fetch available languages and populate the dropdown
    const langsDropdown = document.getElementById("languagesLinkedIn");
    langsDropdown.innerHTML = "<option>Loading...</option>";
    const languages = await fetchLang();

    if (languages) {
      langsDropdown.innerHTML = "";
      for (const [langCode, langData] of Object.entries(languages)) {
        langsDropdown.innerHTML += `<option value="${langCode}">${langData.name}</option>`;
      }
    } else {
      document.getElementById("errorMessage").innerText =
        "Failed to load languages. Check API key.";
    }
  } else {
    // Display the generic popup section
    document.getElementById("first-popup").classList.remove("hidden");
    document.getElementById("inside-LinkedIn").classList.add("hidden");
  }
});

// Save the selected language preference for LinkedIn
document.getElementById("saveBtnLinkedIn").addEventListener("click", () => {
  const langSelect = document.getElementById("languagesLinkedIn");
  const lang = langSelect.value;
  const langContent = langSelect.options[langSelect.selectedIndex].text;

  chrome.storage.sync.set(
    { preferredLang: { text: langContent, value: lang } },
    () => {
      const confirmation = document.getElementById("confirmationLinkedIn");
      if (chrome.runtime.lastError) {
        console.error("Error saving language:", chrome.runtime.lastError);
        confirmation.style.color = "#FF0000";
        confirmation.innerText = "Error saving language!";
      } else {
        confirmation.style.color = "#25D366";
        confirmation.innerText = "Language preference saved!";
        document.getElementById(
          "selectedLangLinkedIn"
        ).innerText = `Selected Language: ${langContent}`;

        // Clear the confirmation message after a few seconds
        setTimeout(() => {
          confirmation.innerText = "";
        }, 3000);
      }
    }
  );
});
