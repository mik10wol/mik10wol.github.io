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

function drawBasket() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawObject() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(object.x, object.y, object.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

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

function moveBasket() {
    if (keys['ArrowLeft'] && basket.x > 0) {
        basket.x -= basket.dx;
    }
    if (keys['ArrowRight'] && basket.x + basket.width < canvas.width) {
        basket.x += basket.dx;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const keys = {};
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

function gameLoop() {
    clearCanvas();
    drawBasket();
    drawObject();
    drawScore();
    moveBasket();
    updateObject();
    requestAnimationFrame(gameLoop);
}

gameLoop();
