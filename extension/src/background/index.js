chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CLAIM_CLICKED") {
    console.log("Claim clicked in background script:", message.text);
    chrome.storage.session.set({ lastClickedClaim: message.text, lastClickedContext: message.context }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting session storage:", chrome.runtime.lastError);
      } else {
        console.log("Claim saved to session storage.");
        // Optionally open the popup here, but for now, we'll assume the user opens it.
        // For Chrome 114+ you could use chrome.action.openPopup();
      }
    });
  }
});

console.log("WebTruth background script loaded and listening for messages.");

