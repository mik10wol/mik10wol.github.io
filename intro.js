// --- CONFIGURATION ---
const gifUrl = 'intro.gif'; // Change this if needed
const displayTime = 2000;    // milliseconds to show centered GIF
const moveDownDuration = 600; // ms (matches CSS transition)

// --- Inject CSS styles ---
const style = document.createElement('style');
style.textContent = `
  #whiteOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform ${moveDownDuration}ms ease-in, opacity ${moveDownDuration}ms ease-in;
    will-change: transform, opacity;
  }

  #introGif {
    max-width: 80%;
    max-height: 80%;
    transition: transform ${moveDownDuration}ms ease-in, opacity ${moveDownDuration}ms ease-in;
    will-change: transform, opacity;
  }

  .move-down {
    transform: translateY(100vh);
    opacity: 0;
  }
`;
document.head.appendChild(style);

// --- Create overlay and GIF ---
const overlay = document.createElement('div');
overlay.id = 'whiteOverlay';

const gif = document.createElement('img');
gif.id = 'introGif';
gif.src = gifUrl;

overlay.appendChild(gif);
document.body.appendChild(overlay);

// --- Wait for DOMContentLoaded ---
window.addEventListener('DOMContentLoaded', () => {
  // Optional small delay to ensure GIF is visible
  setTimeout(() => {
    gif.style.opacity = '1';

    // Wait displayTime, then move down
    setTimeout(() => {
      overlay.classList.add('move-down');
      gif.classList.add('move-down');

      // After moveDownDuration, remove overlay
      setTimeout(() => {
        overlay.remove();
        style.remove(); // Optional: clean up injected styles
      }, moveDownDuration);
    }, displayTime);
  }, 50);
});
