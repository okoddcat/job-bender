chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message && message.message === 'fill') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'fill' });
    });
  }
});