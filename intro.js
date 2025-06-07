<style>
  /* Basic styles for overlay and GIF */
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
    transition: transform 0.6s ease-in, opacity 0.6s ease-in;
    will-change: transform, opacity;
  }

  #introGif {
    max-width: 80%;
    max-height: 80%;
    transition: transform 0.6s ease-in, opacity 0.6s ease-in;
    will-change: transform, opacity;
  }

  /* Class to trigger moving down */
  .move-down {
    transform: translateY(100vh);
    opacity: 0;
  }
</style>

<script>
  // Create white overlay
  const overlay = document.createElement('div');
  overlay.id = 'whiteOverlay';

  // Create intro.gif image
  const gif = document.createElement('img');
  gif.id = 'introGif';
  gif.src = 'intro.gif';

  // Append GIF to overlay
  overlay.appendChild(gif);

  // Append overlay to body
  document.body.appendChild(overlay);

  // Wait for DOM to be fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    // Wait a small amount to ensure GIF is visible
    setTimeout(() => {
      gif.style.opacity = '1';

      // Wait 0.19 seconds, then move down
      setTimeout(() => {
        overlay.classList.add('move-down');
        gif.classList.add('move-down');

        // Wait for the animation to complete, then remove overlay
        setTimeout(() => {
          overlay.remove();
        }, 600); // matches CSS transition duration
      }, 190); // 0.19 seconds
    }, 50); // small delay to avoid visual glitch
  });
</script>
