// Connect to the Socket.IO server
const socket = io();

// Canvas and game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const squareSize = 50;
let squareX = 100;
let squareY = 100;
const targetX = 600;
const targetY = 400;
const targetSize = 50;
let score = 0;

// Draw the game elements
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the target
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(targetX, targetY, targetSize, targetSize);

    // Draw the square (player)
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(squareX, squareY, squareSize, squareSize);

    // Check for collision with target
    if (squareX < targetX + targetSize &&
        squareX + squareSize > targetX &&
        squareY < targetY + targetSize &&
        squareY + squareSize > targetY) {
        score++;
        alert('You reached the target! Score: ' + score);
        resetGame();
    }
}

// Reset the game state
function resetGame() {
    squareX = 100;
    squareY = 100;
}

// Handle keyboard controls
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const step = 10;

    if (key === 'ArrowUp') {
        squareY -= step;
    } else if (key === 'ArrowDown') {
        squareY += step;
    } else if (key === 'ArrowLeft') {
        squareX -= step;
    } else if (key === 'ArrowRight') {
        squareX += step;
    }

    // Keep the square within the canvas boundaries
    squareX = Math.max(0, Math.min(canvas.width - squareSize, squareX));
    squareY = Math.max(0, Math.min(canvas.height - squareSize, squareY));
});

// Update game every 16ms (~60 FPS)
setInterval(drawGame, 16);

// Function to handle sending a message
document.getElementById('sendMessageButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        socket.send(message);
        messageInput.value = '';
    }
});

// Function to handle receiving messages
socket.on('message', (msg) => {
    console.log('Received message:', msg);
    alert('New message: ' + msg);
});