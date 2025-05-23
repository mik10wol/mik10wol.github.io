(function() {
  // VERSION 1.1 added a bit of dialog
  // made for nairi <3
  // Configuration
  const dogImageSrc = 'https://purepng.com/public/uploads/large/dog-ank.png';
  const heartImageSrc = 'https://png.pngtree.com/png-vector/20220428/ourmid/pngtree-smooth-glossy-heart-vector-file-ai-and-png-png-image_4557871.png';
  const speechStrings = [
    'Woof!',
    'Ruff ruff!',
    'Bark!',
    'Arooo!',
    '*happy panting*',
    '*tail wags*',
    'Play time?',
    'Treat please!',
    'Hello there!',
    '*licks screen*',
    'Thanks for the pets!'
  ];
  const heartCount = 5;
  const heartLifespan = 1500; // milliseconds
  const speechBubbleDuration = 2000; // milliseconds
  const dogSpeed = 2; // pixels per interval
  const dogSize = 100; // pixels

  let dog = null;
  let speechBubble = null;
  let roamingInterval;
  let isMovingRight = true;
  let isMovingDown = true;

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getRandomArrayElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createFloatingImage(src, x, y, className = '') {
    const img = document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.width = '30px';
    img.style.height = 'auto';
    img.classList.add(className);
    document.body.appendChild(img);
    return img;
  }

  function createSpeechBubble(x, y, text) {
    if (speechBubble) {
      speechBubble.remove();
    }
    speechBubble = document.createElement('div');
    speechBubble.style.position = 'absolute';
    speechBubble.style.left = `${x}px`;
    speechBubble.style.top = `${y - 30}px`;
    speechBubble.style.backgroundColor = '#eee';
    speechBubble.style.color = '#333';
    speechBubble.style.padding = '5px 10px';
    speechBubble.style.borderRadius = '10px';
    speechBubble.style.fontSize = '14px';
    speechBubble.textContent = text;
    document.body.appendChild(speechBubble);

    setTimeout(() => {
      if (speechBubble) {
        speechBubble.remove();
        speechBubble = null;
      }
    }, speechBubbleDuration);
  }

  function createHearts(x, y) {
    for (let i = 0; i < heartCount; i++) {
      const heartX = x + getRandom(-20, 20);
      const heartY = y - 20;
      const heart = createFloatingImage(heartImageSrc, heartX, heartY, 'heart');
      const driftX = getRandom(-1, 1);
      const driftY = getRandom(-3, -1);
      const scale = getRandom(0.5, 1);
      heart.style.transform = `scale(${scale})`;
      heart.style.opacity = 1;

      const animationInterval = setInterval(() => {
        heart.style.left = `${parseFloat(heart.style.left) + driftX}px`;
        heart.style.top = `${parseFloat(heart.style.top) + driftY}px`;
        heart.style.opacity -= 0.02;
        heart.style.transform = `scale(${scale + (1 - scale) * (1 - parseFloat(heart.style.opacity))})`;

        if (parseFloat(heart.style.opacity) <= 0) {
          clearInterval(animationInterval);
          heart.remove();
        }
      }, 20);

      setTimeout(() => {
        if (heart && heart.parentNode) {
          clearInterval(animationInterval);
          heart.remove();
        }
      }, heartLifespan);
    }
  }

  function moveDog() {
    const maxX = window.innerWidth - dogSize;
    const maxY = window.innerHeight - dogSize;
    let currentX = parseFloat(dog.style.left);
    let currentY = parseFloat(dog.style.top);

    if (isMovingRight) {
      currentX += dogSpeed;
      if (currentX > maxX) {
        isMovingRight = false;
      }
    } else {
      currentX -= dogSpeed;
      if (currentX < 0) {
        isMovingRight = true;
      }
    }

    if (isMovingDown) {
      currentY += dogSpeed;
      if (currentY > maxY) {
        isMovingDown = false;
      }
    } else {
      currentY -= dogSpeed;
      if (currentY < 0) {
        isMovingDown = true;
      }
    }

    dog.style.left = `${currentX}px`;
    dog.style.top = `${currentY}px`;
  }

  function handleDogClick(event) {
    const dogRect = dog.getBoundingClientRect();
    const dogCenterX = dogRect.left + dogRect.width / 2;
    const dogCenterY = dogRect.top + dogRect.height / 2;
    createHearts(dogCenterX, dogCenterY);
    createSpeechBubble(dogRect.left, dogRect.top, getRandomArrayElement(speechStrings));
  }

  function initializeDog() {
    dog = document.createElement('img');
    dog.src = dogImageSrc;
    dog.style.position = 'fixed';
    dog.style.width = `${dogSize}px`;
    dog.style.height = 'auto';
    dog.style.cursor = 'pointer';
    dog.style.left = `${getRandom(0, window.innerWidth - dogSize)}px`;
    dog.style.top = `${getRandom(0, window.innerHeight - dogSize)}px`;
    dog.addEventListener('click', handleDogClick);
    document.body.appendChild(dog);

    roamingInterval = setInterval(moveDog, 50);
  }

  // Initialize when the script is executed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDog);
  } else {
    initializeDog();
  }
})();
