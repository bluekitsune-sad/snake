import { aStarSearch } from "./pathFinder/aStar.js";

// board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

// snake
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var snakeBody = []; // Initially, snakeBody is empty

// food
var foodX;
var foodY;

// direction
var velocityX = 0;
var velocityY = 0;

// game over
var gameOver = false;

// Eating the food
var isEating = false; // To check if the snake is in the process of eating the food

window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d"); // used for drawing on the board

  placeFood();

  setInterval(update, 1000 / 10); // 100 milliseconds = 0.1 seconds run the update function
};

function update() {
  if (gameOver) {
    return;
  }

  // board
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  // food
  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  // snake eating food
  if (snakeX == foodX && snakeY == foodY && !isEating) {
    isEating = true; // Set the flag to indicate the snake is eating the food

    // Add the food to the snake's body at the end (tail)
    snakeBody.push([foodX, foodY]);

    // Delay before continuing
    setTimeout(() => {
      placeFood(); // Place new food
      isEating = false; // Reset the flag
    }, 300);

    // exit early to prevent pathfinding during the eating process
    return;
  }

  // move the snake's body
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  // Move the head of the snake
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // Pathfinding: Calculate path to the food
  if (!isEating) {
    playingWithAStar();
  }

  // snake movement
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;

  // check for collision after the snake moves
  if (checkCollision()) {
    gameOver = true;
    alert("Game Over");
    setTimeout(resetGame, 1000); // Restart the game after 1 second
    return;
  }

  // draw snake
  context.fillStyle = "lime";
  context.fillRect(snakeX, snakeY, blockSize, blockSize);
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }
}

function playingWithAStar() {
  console.log("Calculating path using A* algorithm...");
  console.log("Snake Position:", snakeX, snakeY);
  console.log("Food Position:", foodX, foodY);

  // Pathfinding: Calculate path to the food
  const start = [snakeX / blockSize, snakeY / blockSize];
  const goal = [foodX / blockSize, foodY / blockSize];
  const path = aStarSearch(start, goal, cols, rows, snakeBody);

  if (path.length > 1) {
    const nextStep = path[1]; // Take the next step in the path
    const dx = nextStep[0] - start[0];
    const dy = nextStep[1] - start[1];

    // Update snake's velocity based on the path
    velocityX = dx;
    velocityY = dy;
  }
}

function checkCollision() {
  // Check if the snake collides with itself (excluding the head)
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
      return true;
    }
  }

  // Check if the snake hits the wall
  if (
    snakeX < 0 ||
    snakeX >= cols * blockSize ||
    snakeY < 0 ||
    snakeY >= rows * blockSize
  ) {
    return true;
  }

  return false;
}

function resetGame() {
  // Reset snake position
  snakeX = blockSize * 5;
  snakeY = blockSize * 5;

  // Reset snake body
  snakeBody = [];

  // Reset the velocity
  velocityX = 0;
  velocityY = 0;

  // Reset the game over flag
  gameOver = false;

  // Place new food
  placeFood();
}

function placeFood() {
  let validPosition = false;

  // Loop until a valid position is found (not on the snake's body)
  while (!validPosition) {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;

    // Check if the food spawns on the snake's body
    validPosition = !snakeBody.some(
      (bodyPart) => bodyPart[0] === foodX && bodyPart[1] === foodY
    );
  }
}
