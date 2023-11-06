chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.hasOwnProperty('extensionEnabled')) {
    chrome.storage.local.set({ 'extensionEnabled': request.extensionEnabled }, function () {
      if (chrome.runtime.lastError) {
        console.error('Error setting extensionEnabled:', chrome.runtime.lastError);
      } else {
        // Отправляем ответ обратно, если это необходимо
        sendResponse({ status: "extensionEnabled updated" });
      }
    });
    // Возвращаем true, если мы хотим асинхронно ответить (например, после асинхронной операции)
    return true;
  }
});
