import { aStarSearch } from "./pathFinder/aStar.js";
import bfsSearch from "./pathFinder/bfs.js";
import dfsSearch from "./pathFinder/dfs.js";
import dijkstraSearch from "./pathFinder/djikstra.js";
import floodFillSearch from "./pathFinder/floodfill.js";

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

// Eating control (no delay to avoid deaths)
var isEating = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d"); // used for drawing on the board

  placeFood();

  setInterval(update, 1000 / 10); // 100 milliseconds = 0.1 seconds run the update function
};

// algorithm selection
// 1: BFS, 2: DFS, 3: A*, 4: Dijkstra, 5: Flood Fill
let currentAlgorithm = "astar";
window.addEventListener("keydown", (e) => {
  if (e.key === "1") currentAlgorithm = "bfs";
  if (e.key === "2") currentAlgorithm = "dfs";
  if (e.key === "3") currentAlgorithm = "astar";
  if (e.key === "4") currentAlgorithm = "dijkstra";
  if (e.key === "5") currentAlgorithm = "flood";
});

function drawCell(gridX, gridY, color, alpha = 1) {
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.fillRect(gridX * blockSize, gridY * blockSize, blockSize, blockSize);
  context.globalAlpha = 1;
}

function update() {
  if (gameOver) {
    return;
  }

  // board
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  // snake eating food (no delay)
  if (snakeX == foodX && snakeY == foodY && !isEating) {
    isEating = true;
    snakeBody.push([foodX, foodY]);
    placeFood();
    isEating = false;
  }

  // move the snake's body
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  // Move the head of the snake
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // Pathfinding + visualization
  const start = [snakeX / blockSize, snakeY / blockSize];
  const goal = [foodX / blockSize, foodY / blockSize];
  // Convert snake body to grid units and exclude the head cell
  const snakeBodyGrid = snakeBody
    .map((p) => [p[0] / blockSize, p[1] / blockSize])
    .filter((p) => !(p[0] === start[0] && p[1] === start[1]));
  let visitedCurrent = [];
  let visitedNeighbors = [];
  const onVisit = (node, type) => {
    if (type === "current") visitedCurrent.push(node);
    else visitedNeighbors.push(node);
  };
  let path = [];
  if (currentAlgorithm === "bfs") {
    path = bfsSearch(start, goal, cols, rows, snakeBodyGrid, onVisit);
  } else if (currentAlgorithm === "dfs") {
    path = dfsSearch(start, goal, cols, rows, snakeBodyGrid, onVisit);
  } else if (currentAlgorithm === "dijkstra") {
    path = dijkstraSearch(start, goal, cols, rows, snakeBodyGrid, onVisit);
  } else if (currentAlgorithm === "flood") {
    path = floodFillSearch(start, goal, cols, rows, snakeBodyGrid, onVisit);
  } else {
    path = aStarSearch(start, goal, cols, rows, snakeBodyGrid, onVisit);
  }

  // draw visited nodes
  for (const n of visitedNeighbors) drawCell(n[0], n[1], "#2a6df5", 0.6);
  for (const n of visitedCurrent) drawCell(n[0], n[1], "#87aafc", 0.8);

  // draw path
  if (path.length > 0) {
    for (const step of path) drawCell(step[0], step[1], "#ffd54a", 0.6);
  }

  // food (on top)
  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  // Update velocity from path
  if (path && path.length > 1) {
    let nextIndex = 1;
    let nextStep = path[nextIndex];
    const dx = nextStep[0] - start[0];
    const dy = nextStep[1] - start[1];
    // Prevent immediate 180-degree turns if snake has a body
    const reversing =
      snakeBody.length > 0 && dx === -velocityX && dy === -velocityY;
    if (reversing && path.length > 2) {
      nextIndex = 2;
      nextStep = path[nextIndex];
    }
    const ndx = nextStep[0] - start[0];
    const ndy = nextStep[1] - start[1];
    if (!(snakeBody.length > 0 && ndx === -velocityX && ndy === -velocityY)) {
      velocityX = ndx;
      velocityY = ndy;
    }
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

// velocity update based on path is done right before movement

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
