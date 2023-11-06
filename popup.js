document.addEventListener('DOMContentLoaded', function() {
  var checkbox = document.getElementById('toggleSwitch');

  // Проверяем сохраненное состояние и обновляем чекбокс
  chrome.storage.local.get('extensionEnabled', function(data) {
    checkbox.checked = data.extensionEnabled;
  });

  // Слушаем изменение состояния чекбокса
  checkbox.onchange = function() {
    var enabled = checkbox.checked;
    // Отправляем сообщение в фоновый скрипт
    chrome.runtime.sendMessage({extensionEnabled: enabled});
  };
});