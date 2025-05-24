(() => {
  // VERSION 1.4.5 : added comments
  // Add styling to page
  const style = document.createElement('style');
  style.textContent = `
    /* Spray can image that follows the cursor */
    #sprayCursor {
      position: fixed;
      pointer-events: none;
      display: none;
      width: 40px;
      height: 40px;
      z-index: 10000;
    }
    /* Controls panel in bottom right */
    #sprayControls {
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 10001;
      padding: 10px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ccc;
      font-family: sans-serif;
      font-size: 14px;
      max-width: 250px;
    }
    #sprayControls input[type="number"] {
      width: 60px;
    }
    /* Sprayed image or text */
    .sprayImage, .sprayText {
      position: absolute;
      z-index: 9999;
    }
    .sprayText {
      font-size: 16px;
      font-weight: bold;
      color: black;
    }
    /* Toggle for advanced settings */
    #advancedToggle {
      cursor: pointer;
      font-weight: bold;
      color: #0077cc;
      margin-bottom: 5px;
      display: inline-block;
    }
    #advancedSettings {
      display: none;
      margin-bottom: 8px;
    }
    /* Welcome speech bubble */
    #speechBubble {
      position: fixed;
      bottom: 10px;
      left: 10px;
      z-index: 10002;
      background: white;
      border: 2px solid #333;
      border-radius: 10px;
      padding: 10px;
      max-width: 200px;
      font-family: sans-serif;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    #speechBubble button {
      margin: 5px 5px 0 0;
      font-size: 12px;
    }
    /* Tray holding image thumbnails */
    #imageTray {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 8px;
      max-height: 100px;
      overflow-y: auto;
    }
    .trayItem {
      width: 40px;
      height: 40px;
      object-fit: cover;
      cursor: pointer;
      border: 2px solid transparent;
    }
    .trayItem:hover {
      border-color: #0077cc;
    }
  `;
  document.head.appendChild(style);

  // Spray can image that follows the mouse
  const sprayCursor = document.createElement('img');
  sprayCursor.id = 'sprayCursor';
  sprayCursor.src = 'https://png.pngtree.com/png-vector/20230906/ourmid/pngtree-aerosol-can-hairspray-png-image_9972179.png';
  document.body.appendChild(sprayCursor);

  // Control panel UI
  const controls = document.createElement('div');
  controls.id = 'sprayControls';
  controls.innerHTML = `
    <div id="advancedToggle">▶ Advanced Settings</div>
    <div id="advancedSettings">
      Size: <input type="number" id="spraySize" value="100"><br>
      Opacity: <input type="number" id="sprayOpacity" value="1" step="0.1" min="0" max="1"><br>
      <label><input type="checkbox" id="sprayTextMode"> Text instead of image</label><br>
      <button id="clearSprays">Clear All</button>
      <button id="clearTray">Clear Tray</button>
    </div>
    <div id="imageTray"></div>
    <div>
      Image/Text: <input type="text" id="imageURL" placeholder="Enter link or text" size="30">
    </div>
  `;
  document.body.appendChild(controls);

  // Get references to important UI elements
  const input = document.getElementById('imageURL');
  const sizeInput = document.getElementById('spraySize');
  const opacityInput = document.getElementById('sprayOpacity');
  const textModeCheckbox = document.getElementById('sprayTextMode');
  const clearButton = document.getElementById('clearSprays');
  const clearTrayButton = document.getElementById('clearTray');
  const advancedToggle = document.getElementById('advancedToggle');
  const advancedSettings = document.getElementById('advancedSettings');
  const imageTray = document.getElementById('imageTray');

  // Set to store unique tray images
  const trayImages = new Set();

  // Toggle advanced settings visibility
  advancedToggle.addEventListener('click', () => {
    const visible = advancedSettings.style.display === 'block';
    advancedSettings.style.display = visible ? 'none' : 'block';
    advancedToggle.textContent = visible ? '▶ Advanced Settings' : '▼ Advanced Settings';
  });

  // Whether spray mode is on or off
  let sprayMode = false;

  // Pressing P toggles spray mode
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'p') {
      sprayMode = !sprayMode;
      sprayCursor.style.display = sprayMode ? 'block' : 'none';
    }
  });

  // Move the spray cursor image with the mouse
  document.addEventListener('mousemove', e => {
    if (sprayMode) {
      sprayCursor.style.left = `${e.clientX + 10}px`;
      sprayCursor.style.top = `${e.clientY + 10}px`;
    }
  });

  // When user clicks in spray mode, embed image/text at that spot
  document.addEventListener('click', e => {
    if (!sprayMode) return;
    const value = input.value.trim();
    if (!value) return;

    const size = parseInt(sizeInput.value) || 100;
    const opacity = parseFloat(opacityInput.value);
    const x = window.scrollX + e.clientX;
    const y = window.scrollY + e.clientY;

    if (textModeCheckbox.checked) {
      // Spray as text
      const span = document.createElement('span');
      span.textContent = value;
      span.className = 'sprayText';
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.opacity = opacity;
      span.style.fontSize = `${size / 4}px`;
      document.body.appendChild(span);
    } else {
      // Spray as image
      const img = document.createElement('img');
      img.src = value;
      img.className = 'sprayImage';
      img.style.width = `${size}px`;
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.opacity = opacity;
      document.body.appendChild(img);

      // Add image to tray if it's new
      if (!trayImages.has(value)) {
        trayImages.add(value);
        const trayImg = document.createElement('img');
        trayImg.src = value;
        trayImg.className = 'trayItem';
        trayImg.title = value;
        trayImg.addEventListener('click', () => {
          input.value = value;
        });
        imageTray.appendChild(trayImg);
      }
    }
  });

  // Clear all sprayed images/text
  clearButton.addEventListener('click', () => {
    document.querySelectorAll('.sprayImage, .sprayText').forEach(el => el.remove());
  });

  // Clear all images in the tray
  clearTrayButton.addEventListener('click', () => {
    trayImages.clear();
    imageTray.innerHTML = '';
  });

  // Speech bubble asking if user is new
  const bubble = document.createElement('div');
  bubble.id = 'speechBubble';
  bubble.innerHTML = `
    <div id="bubbleText">Hello, are you new?</div>
    <button id="bubbleYes">Yes</button>
    <button id="bubbleNo">No</button>
  `;
  document.body.appendChild(bubble);

  // If "Yes" clicked, shows lots of text and allow dismiss
  document.getElementById('bubbleYes').addEventListener('click', () => {
    const text = document.getElementById('bubbleText');
    text.textContent = 'Thats cool! find an image online and copy the link, then paste it into the image url and press p to start spraying! press p again to stop spraying. all images are left in the tray and the advanced setting have lots of usefull stuff so also look there. Anyways that is enough from me cya!';
    const dismiss = document.createElement('button');
    dismiss.textContent = 'Dismiss';
    dismiss.id = 'bubbleDismiss';
    bubble.appendChild(dismiss);
    document.getElementById('bubbleYes').remove();
    document.getElementById('bubbleNo').remove();
    dismiss.addEventListener('click', () => bubble.remove());
  });

  // If "No" clicked, remove speech bubble immediately
  document.getElementById('bubbleNo').addEventListener('click', () => {
    bubble.remove();
  });
})();
