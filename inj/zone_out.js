(function() {
  let originalTextNodes = [];
  let originalTitle = document.title;
  let blurLevel = 0;
  let blackLevel = 0;
  let intervalId = null;
  let isHoldingM = false;
  let styleElement = null;

  function replaceText() {
    originalTextNodes = [];
    function traverse(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim() !== "") {
          originalTextNodes.push({ node: node, original: node.textContent });
          node.textContent = "Blah blah blah.";
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
          traverse(node.childNodes[i]);
        }
      }
    }
    traverse(document.body);
    document.title = "Taking a break";
  }

  function revertText() {
    originalTextNodes.forEach(item => {
      item.node.textContent = item.original;
    });
    document.title = originalTitle;
    originalTextNodes = [];
  }

  function applyBlurAndBlack() {
    if (!styleElement) {
      styleElement = document.createElement('style');
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      body {
        filter: blur(${blurLevel}px) brightness(${1 - blackLevel});
      }
    `;
  }

  function updateEffects() {
    if (isHoldingM) {
      blurLevel = Math.min(20, blurLevel + 0.5);
      if (blurLevel >= 20) {
        blackLevel = Math.min(1, blackLevel + 0.05);
      }
    } else {
      if (blackLevel > 0) {
        blackLevel = Math.max(0, blackLevel - 0.05);
      } else {
        blurLevel = Math.max(0, blurLevel - 0.5);
      }
    }
    applyBlurAndBlack();

    if (!isHoldingM && blurLevel === 0 && blackLevel === 0 && originalTextNodes.length === 0 && document.title === originalTitle) {
      clearInterval(intervalId);
      intervalId = null;
      if (styleElement) {
        styleElement.remove();
        styleElement = null;
      }
    }
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'm' && !isHoldingM) {
      isHoldingM = true;
      replaceText();
      if (!intervalId) {
        intervalId = setInterval(updateEffects, 50);
      }
    }
  });

  document.addEventListener('keyup', function(event) {
    if (event.key === 'm' && isHoldingM) {
      isHoldingM = false;
      revertText();
    }
  });
})();
