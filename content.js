var extensionEnabled = false;

function updateExtensionState() {
  chrome.storage.local.get(['extensionEnabled'], function(result) {
    extensionEnabled = result.extensionEnabled || false;
  });
}

updateExtensionState();

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    if (key === 'extensionEnabled') {
      extensionEnabled = changes[key].newValue;
    }
  }
});

document.addEventListener('click', function(e) {
  if (!extensionEnabled) return;

  // Функция для поиска элемента img, включая вложенные элементы
  function findImgElement(element) {
    if (element.tagName.toLowerCase() === 'img') {
      return element;
    }
    if (element.querySelector) {
      return element.querySelector('img');
    }
    return null;
  }

  // Получаем элемент по координатам клика
  let clickedElement = document.elementFromPoint(e.clientX, e.clientY);
  let imgElement = findImgElement(clickedElement);

  // Если элемент не найден, пытаемся найти в родителях
  while (!imgElement && clickedElement) {
    clickedElement = clickedElement.parentElement;
    imgElement = findImgElement(clickedElement);
  }

  // Если изображение найдено, проверяем, был ли клик внутри его границ
  if (imgElement) {
    const imgRect = imgElement.getBoundingClientRect();
    const isInBounds =
      e.clientX >= imgRect.left &&
      e.clientX <= imgRect.right &&
      e.clientY >= imgRect.top &&
      e.clientY <= imgRect.bottom;

    if (isInBounds) {
      // Клик был сделан непосредственно по изображению
      console.log('Изображение найдено:', imgElement.src);
      window.open(imgElement.src, '_blank');
    }
  } else {
    console.log('Изображение не найдено.');
  }
}, true);

  