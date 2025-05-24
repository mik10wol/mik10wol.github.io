const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Game properties
const gravity = 0.5;
const defaultSpeed = 5;

// Player properties
const player = {
    x: 50,
    y: 500,
    width: 40,
    height: 40,
    dx: 0,
    dy: 0,
    speed: defaultSpeed,
    jumpStrength: 10,
    grounded: false,
    color: "red"
};

// Camera properties
let cameraOffsetX = 0;

// Power-Up properties
let powerUp = {
    x: 800,
    y: 450,
    width: 30,
    height: 30,
    active: true,
    color: "blue",
    speedBoost: 3,
    duration: 5000 // 5 seconds
};

// Platforms
const platforms = [
    { x: 0, y: 550, width: 800, height: 50 },
    { x: 300, y: 450, width: 150, height: 20 },
    { x: 600, y: 350, width: 200, height: 20 },
    { x: 900, y: 250, width: 200, height: 20 },
    { x: 1300, y: 400, width: 150, height: 20 },
    { x: 1600, y: 300, width: 150, height: 20 },
    { x: 2000, y: 350, width: 200, height: 20 }
];

// Coins
const coins = [
    { x: 320, y: 410, radius: 10, collected: false },
    { x: 620, y: 310, radius: 10, collected: false },
    { x: 920, y: 210, radius: 10, collected: false },
    { x: 1350, y: 360, radius: 10, collected: false },
    { x: 1650, y: 260, radius: 10, collected: false },
    { x: 2050, y: 310, radius: 10, collected: false }
];

// Enemies
const enemies = [
    { x: 500, y: 520, width: 40, height: 30, dx: 2 },
    { x: 1100, y: 480, width: 40, height: 30, dx: -2 },
    { x: 1700, y: 470, width: 40, height: 30, dx: 3 }
];

// Keyboard controls
const keys = {};

// Event listeners for controls
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Collision detection
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Power-up collection
function collectPowerUp() {
    if (powerUp.active && isColliding(player, powerUp)) {
        powerUp.active = false;
        player.speed += powerUp.speedBoost;
        setTimeout(() => {
            player.speed = defaultSpeed;
        }, powerUp.duration);
    }
}

// Update player
function updatePlayer() {
    // Horizontal movement
    if (keys["ArrowRight"]) player.dx = player.speed;
    else if (keys["ArrowLeft"]) player.dx = -player.speed;
    else player.dx = 0;

    // Jump
    if (keys[" "] && player.grounded) {
        player.dy = -player.jumpStrength;
        player.grounded = false;
    }

    // Gravity
    player.dy += gravity;

    // Update position
    player.x += player.dx;
    player.y += player.dy;

    // Check collisions with platforms
    player.grounded = false;
    for (const platform of platforms) {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height <= platform.y + platform.height
        ) {
            player.dy = 0;
            player.grounded = true;
            player.y = platform.y - player.height;
        }
    }

    // Prevent falling out of bounds
    if (player.y > canvas.height) {
        alert("You fell! Game Over.");
        document.location.reload();
    }

    // Scrolling camera
    cameraOffsetX = Math.max(player.x - canvas.width / 2, 0);
}

// Update enemies
function updateEnemies() {
    for (const enemy of enemies) {
        enemy.x += enemy.dx;

        // Reverse direction at edges
        if (enemy.x < 0 || enemy.x + enemy.width > 2400) {
            enemy.dx *= -1;
        }

        // Check collision with player
        if (isColliding(player, enemy)) {
            alert("You were caught by an enemy! Game Over.");
            document.location.reload();
        }
    }
}

// Collect coins
function collectCoins() {
    for (const coin of coins) {
        if (
            !coin.collected &&
            Math.hypot(player.x + player.width / 2 - coin.x, player.y + player.height / 2 - coin.y) <
                coin.radius + player.width / 2
        ) {
            coin.collected = true;
        }
    }

    // Check win condition
    if (coins.every((coin) => coin.collected)) {
        alert("You collected all coins! You win!");
        document.location.reload();
    }
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - cameraOffsetX, player.y, player.width, player.height);
}

// Draw platforms
function drawPlatforms() {
    ctx.fillStyle = "green";
    for (const platform of platforms) {
        ctx.fillRect(
            platform.x - cameraOffsetX,
            platform.y,
            platform.width,
            platform.height
        );
    }
}

// Draw coins
function drawCoins() {
    for (const coin of coins) {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x - cameraOffsetX, coin.y, coin.radius, 0, Math.PI * 2);
            ctx.fillStyle = "gold";
            ctx.fill();
            ctx.closePath();
        }
    }
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = "purple";
    for (const enemy of enemies) {
        ctx.fillRect(
            enemy.x - cameraOffsetX,
            enemy.y,
            enemy.width,
            enemy.height
        );
    }
}

// Draw power-up
function drawPowerUp() {
    if (powerUp.active) {
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(
            powerUp.x - cameraOffsetX,
            powerUp.y,
            powerUp.width,
            powerUp.height
        );
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    updateEnemies();
    collectPowerUp();
    collectCoins();
    drawPlatforms();
    drawCoins();
    drawEnemies();
    drawPowerUp();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
