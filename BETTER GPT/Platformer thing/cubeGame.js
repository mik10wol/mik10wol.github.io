const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Player properties
const player = {
    x: 100,
    y: 100,
    width: 30,
    height: 30,
    color: "red",
    dx: 0,
    dy: 0,
    speed: 5,
    gravity: 0.5,
    isGrounded: false
};

// Blocks array
const blocks = [];

// Add a floor
blocks.push({ x: 0, y: canvas.height - 50, width: canvas.width, height: 50, color: "green" });

// Add gravity and collision detection
function updatePlayer() {
    // Horizontal movement
    if (keys["a"]) player.dx = -player.speed;
    else if (keys["d"]) player.dx = player.speed;
    else player.dx = 0;

    // Vertical movement (jump)
    if (keys["w"] && player.isGrounded) {
        player.dy = -10; // Jump strength
        player.isGrounded = false;
    }

    // Gravity
    player.dy += player.gravity;

    // Update position
    player.x += player.dx;
    player.y += player.dy;

    // Collision with blocks
    player.isGrounded = false; // Reset grounded state
    for (const block of blocks) {
        if (
            player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y + player.height > block.y &&
            player.y + player.height <= block.y + block.height
        ) {
            player.dy = 0; // Stop vertical movement
            player.y = block.y - player.height; // Place player on top of the block
            player.isGrounded = true;
        }

        // Horizontal collision
        if (
            player.x + player.width > block.x &&
            player.x < block.x + block.width &&
            player.y + player.height > block.y &&
            player.y < block.y + block.height
        ) {
            if (player.dx > 0) player.x = block.x - player.width; // Collision on the right
            if (player.dx < 0) player.x = block.x + block.width; // Collision on the left
        }
    }

    // Prevent player from leaving canvas bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    if (player.y > canvas.height) player.y = canvas.height - player.height;
}

// Handle block placement
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Add a new block where clicked
    blocks.push({
        x: Math.floor(mouseX / 30) * 30,
        y: Math.floor(mouseY / 30) * 30,
        width: 30,
        height: 30,
        color: "brown"
    });
});

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw blocks
function drawBlocks() {
    for (const block of blocks) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
    }
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Game loop
function gameLoop() {
    clearCanvas();
    updatePlayer();
    drawBlocks();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

// Keyboard input handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Start the game
gameLoop();
