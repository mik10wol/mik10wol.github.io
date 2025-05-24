const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Game settings
let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let gameOver = false;
let floorY = canvas.height - 60; // Fixed floor position (60px from the bottom)
let player = {
    x: 100,
    y: floorY - 40, // Player starts just above the floor
    width: 40,
    height: 40,
    velocityY: 0,
    jumpPower: -12,
    gravity: 0.5,
    grounded: false
};

// Obstacles
let spikes = [];
let platforms = [];
let platformSpeed = 2; // Speed at which platforms move left

// Keypresses
let keys = {};
let spacePressed = false;

// Event Listeners
window.addEventListener("keydown", (e) => {
    if (e.key === " " && !gameOver) {
        spacePressed = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (e.key === " ") {
        spacePressed = false;
    }
});

// Functions to manage the game

function generateLevel() {
    // Generate a platform at a fixed height above the floor
    let platformHeight = floorY - Math.random() * 150 - 100; // Random height between floorY - 150px to floorY - 100px
    let platformWidth = Math.random() * 200 + 100; // Random width between 100px and 300px
    platforms.push({ x: canvas.width, y: platformHeight, width: platformWidth, height: 20 });

    // Generate spikes on platforms, ensuring they're on the floor
    let spikeCount = Math.floor(Math.random() * 3) + 1; // Between 1 and 3 spikes on the platform
    for (let i = 0; i < spikeCount; i++) {
        let spikeX = platformWidth * Math.random() + platforms[platforms.length - 1].x;
        spikes.push({ x: spikeX, y: floorY - 10, width: 20, height: 10 }); // Spikes always on the floor
    }
}

function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = "green";
    for (const platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function drawSpikes() {
    ctx.fillStyle = "black";
    for (const spike of spikes) {
        ctx.fillRect(spike.x, spike.y, spike.width, spike.height);
    }
}

function movePlatforms() {
    for (const platform of platforms) {
        platform.x -= platformSpeed;
    }
    // Remove platforms that are off-screen
    platforms = platforms.filter(platform => platform.x + platform.width > 0);
}

function moveSpikes() {
    for (const spike of spikes) {
        spike.x -= platformSpeed;
    }
    // Remove spikes that are off-screen
    spikes = spikes.filter(spike => spike.x + spike.width > 0);
}

function checkCollisions() {
    // Check for collisions with platforms
    player.grounded = false;
    for (const platform of platforms) {
        if (player.x + player.width > platform.x && player.x < platform.x + platform.width &&
            player.y + player.height <= platform.y && player.y + player.height + player.velocityY >= platform.y) {
            player.velocityY = 0;
            player.grounded = true;
            player.y = platform.y - player.height;
        }
    }

    // Check for collisions with spikes
    for (const spike of spikes) {
        if (player.x + player.width > spike.x && player.x < spike.x + spike.width &&
            player.y + player.height > spike.y && player.y < spike.y + spike.height) {
            gameOver = true;
        }
    }
}

function jump() {
    if (player.grounded) {
        player.velocityY = player.jumpPower;
        player.grounded = false;
    }
}

function update() {
    if (gameOver) {
        // Reset the game when player loses
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
        }
        score = 0;
        platforms = [];
        spikes = [];
        player.y = floorY - 40; // Reset the player's position above the fixed floor
        player.velocityY = 0;
        gameOver = false;
    }

    // Update player gravity and movement
    if (!player.grounded) {
        player.velocityY += player.gravity;
    }

    if (spacePressed) {
        jump();
    }

    player.y += player.velocityY;

    // Generate new level parts when needed
    if (platforms.length === 0 || platforms[platforms.length - 1].x < canvas.width - 300) {
        generateLevel();
    }

    // Move platforms and spikes
    movePlatforms();
    moveSpikes();

    // Check for collisions
    checkCollisions();

    // Update score
    score++;

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawSpikes();
    drawPlayer();

    // Draw score and highscore
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Highscore: " + highscore, 20, 60);

    requestAnimationFrame(update);
}

// Start the game
update();
