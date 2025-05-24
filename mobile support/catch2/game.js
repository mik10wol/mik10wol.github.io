const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const basket = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    dx: 7
};

const object = {
    x: Math.random() * canvas.width,
    y: 0,
    size: 20,
    dy: 3
};

let score = 0;

// Draw the basket
function drawBasket() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

// Draw the falling object
function drawObject() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(object.x, object.y, object.size, 0, Math.PI * 2);
    ctx.fill();
}

// Draw the score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Update the object's position
function updateObject() {
    object.y += object.dy;

    // Reset object if it goes off screen
    if (object.y > canvas.height) {
        object.x = Math.random() * canvas.width;
        object.y = 0;
    }

    // Check collision
    if (
        object.y + object.size > basket.y &&
        object.x > basket.x &&
        object.x < basket.x + basket.width
    ) {
        score++;
        object.x = Math.random() * canvas.width;
        object.y = 0;
    }
}

// Move the basket based on user input
let touchStartX = 0;
let touchEndX = 0;

// Touch events to control the basket
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX; // Record the initial touch position
}, false);

canvas.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX; // Update the touch position
    let move = touchEndX - touchStartX;
    
    if (move > 0 && basket.x + basket.width < canvas.width) {
        basket.x += basket.dx; // Move basket right
    } else if (move < 0 && basket.x > 0) {
        basket.x -= basket.dx; // Move basket left
    }

    touchStartX = touchEndX; // Update the start position for the next movement
}, false);

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Main game loop
function gameLoop() {
    clearCanvas();
    drawBasket();
    drawObject();
    drawScore();
    updateObject();
    requestAnimationFrame(gameLoop);
}

gameLoop();
