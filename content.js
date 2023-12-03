var extensionEnabled = false;
var activeKey = 'Alt';

function updateExtensionState() {
  chrome.storage.local.get(['extensionEnabled'], function (result) {
    extensionEnabled = result.extensionEnabled || false;
  });
}

updateExtensionState();

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    if (key === 'extensionEnabled') {
      extensionEnabled = changes[key].newValue;
    }
  }
});

function findMediaElement(element) {
  if (!element) return null;
  
  if (element.tagName.toLowerCase() === 'img' || element.tagName.toLowerCase() === 'video') {
    return element;
  }

  // Поиск как изображения, так и видео
  let imgElement = element.querySelector('img');
  let videoElement = element.querySelector('video');
  return imgElement || videoElement;
}

function addHighlightStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    .highlighted-image {
      // outline: 1px solid #ff62ab !important;
      // box-shadow: inset 0 0 0px 3px rgba(0, 0, 255, 0.5) !important;
      // z-index: 9995 !important;
      // border: 1px solid lime !important;
      // opacity: 0.5 !important;
      // background: red !important;
      cursor: cell !important;
    }
  `;
  document.head.appendChild(style);
}

addHighlightStyles();

document.addEventListener('click', function (e) {
  if (!extensionEnabled || !e.getModifierState(activeKey)) return;

  let clickedElement = document.elementFromPoint(e.clientX, e.clientY);
  let mediaElement = findMediaElement(clickedElement);

  while (!mediaElement && clickedElement) {
    clickedElement = clickedElement.parentElement;
    mediaElement = findMediaElement(clickedElement);
  }

  if (mediaElement) {
    const mediaRect = mediaElement.getBoundingClientRect();
    const isInBounds =
      e.clientX >= mediaRect.left &&
      e.clientX <= mediaRect.right &&
      e.clientY >= mediaRect.top &&
      e.clientY <= mediaRect.bottom;

    if (isInBounds) {
      if (mediaElement.tagName.toLowerCase() === 'img') {
        console.log('Изображение найдено:', mediaElement.src);
        window.open(mediaElement.src, '_blank');
      } else if (mediaElement.tagName.toLowerCase() === 'video') {
        // Проверка наличия источника видео
        let videoSrc = mediaElement.currentSrc || mediaElement.src;
        if (videoSrc && videoSrc.startsWith('blob:')) {
          console.log('Видео в формате Blob:', videoSrc);
          // Здесь можно реализовать логику для обработки Blob URL
        } else if (videoSrc) {
          console.log('Видео найдено:', videoSrc);
          window.open(videoSrc, '_blank');
        } else {
          console.log('Прямая ссылка на видео не найдена.');
        }
      }
    }
  } else {
    console.log('Медиа не найдено.');
  }
}, true);



document.addEventListener('mouseover', function(e) {
  if (!extensionEnabled) return;

  let hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
  let imgElement = findMediaElement(hoveredElement);

  if (imgElement) {
    let targetElement = imgElement.parentElement; // Используем родительский элемент изображения
    // Проверяем, не применен ли уже стиль к элементу
    if (targetElement && !targetElement.classList.contains('highlighted-image')) {
      targetElement.classList.add('highlighted-image');
    }
  }
});

document.addEventListener('mouseout', function(e) {
  let highlightedElements = document.querySelectorAll('.highlighted-image');
  highlightedElements.forEach(function(element) {
    element.classList.remove('highlighted-image');
  });
});

function downloadBlobVideo(blobUrl) {
  fetch(blobUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'video.mp4'; // Устанавливаем имя файла
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(e => console.error('Ошибка при скачивании видео:', e));
}
