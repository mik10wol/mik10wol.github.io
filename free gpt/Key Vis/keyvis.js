// Select the body element
const body = document.body;

// Object to keep track of which keys are pressed
let keysPressed = {};

// Function to create a square
function createSquare(key) {
    // Create the square element
    const square = document.createElement('div');
    square.classList.add('square');
    
    // Set the text of the square to the key's name (or letter)
    square.textContent = key;

    // Random position for the square
    const randomX = Math.random() * (window.innerWidth - 100); // Subtract width of square to prevent overflow
    const randomY = Math.random() * (window.innerHeight - 100); // Subtract height of square to prevent overflow

    square.style.left = `${randomX}px`;
    square.style.top = `${randomY}px`;

    // Append the square to the body
    body.appendChild(square);

    // Wait for the key to be released to fade out and remove the square
    window.addEventListener('keyup', function onKeyUp(event) {
        if (event.key === key) {
            // Fade out and remove the square
            square.style.opacity = '0';
            // After fade out, remove square from DOM
            setTimeout(() => {
                square.remove();
            }, 500); // match the fade duration
            // Remove the event listener after key release
            window.removeEventListener('keyup', onKeyUp);
        }
    });
}

// Function to handle keydown events
function handleKeyDown(event) {
    if (!keysPressed[event.key]) {
        // Mark the key as pressed
        keysPressed[event.key] = true;
        // Create the square for the pressed key
        createSquare(event.key);
    }
}

// Function to handle keyup events
function handleKeyUp(event) {
    // Mark the key as not pressed
    keysPressed[event.key] = false;
}

// Add event listeners for keydown and keyup
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
