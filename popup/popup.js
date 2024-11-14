document.addEventListener("DOMContentLoaded", function () {
  const languageSelect = document.getElementById("languagesLinkedIn");
  const saveBtn = document.getElementById("saveBtnLinkedIn");
  const confirmation = document.getElementById("confirmationLinkedIn");
  const selectedLangDisplay = document.getElementById("selectedLangLinkedIn");
  const firstPopup = document.getElementById("first-popup");
  const insideLinkedIn = document.getElementById("inside-LinkedIn");
  const errorMessage = document.getElementById("errorMessage");

  // Language options
  const languages = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    hi: "Hindi",
    bn: "Bengali",
    te: "Telugu",
    ta: "Tamil",
    mr: "Marathi",
    ur: "Urdu",
    gu: "Gujarati",
    kn: "Kannada",
    or: "Oriya",
    ml: "Malayalam",
    pa: "Punjabi",
    fa: "Persian",
    ar: "Arabic",
    tr: "Turkish",
    th: "Thai",
    vi: "Vietnamese",
    id: "Indonesian",
    ms: "Malay",
    tl: "Filipino",
    sw: "Swahili",
    nl: "Dutch",
    sv: "Swedish",
    fi: "Finnish",
    da: "Danish",
    no: "Norwegian",
    pl: "Polish",
    cs: "Czech",
    sk: "Slovak",
    hu: "Hungarian",
    ro: "Romanian",
    bg: "Bulgarian",
    el: "Greek",
    uk: "Ukrainian",
    hr: "Croatian",
    sr: "Serbian",
    sl: "Slovenian",
    et: "Estonian",
    lv: "Latvian",
    lt: "Lithuanian",
    si: "Sinhala",
  };

  // Check if we're on LinkedIn
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    if (url.includes("linkedin.com")) {
      firstPopup.classList.add("hidden");
      insideLinkedIn.classList.remove("hidden");
    }
  });

  // Populate language dropdown
  languageSelect.innerHTML = Object.entries(languages)
    .map(([code, name]) => `<option value="${code}">${name}</option>`)
    .join("");

  // Load saved language preference
  chrome.storage.sync.get(["targetLanguage"], function (result) {
    if (result.targetLanguage) {
      languageSelect.value = result.targetLanguage;
      selectedLangDisplay.textContent = `Selected Language: ${
        languages[result.targetLanguage]
      }`;
    }
  });

  // Save language preference
  saveBtn.addEventListener("click", function () {
    const selectedLanguage = languageSelect.value;
    chrome.storage.sync.set(
      {
        targetLanguage: selectedLanguage,
      },
      function () {
        confirmation.textContent = "Settings saved!";
        selectedLangDisplay.textContent = `Selected Language: ${languages[selectedLanguage]}`;
        setTimeout(() => {
          confirmation.textContent = "";
        }, 2000);
      }
    );
  });
});
