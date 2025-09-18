// A* helper functions
export function aStarSearch(start, goal, cols, rows, snakeBody) {
  const openList = new Map(); // Changed to a Map for better performance
  const closedList = new Set(); // Set for faster lookup
  const gCost = new Map();
  const fCost = new Map();
  const cameFrom = new Map();

  gCost.set(start.toString(), 0);
  fCost.set(start.toString(), manhattanDistance(start, goal));

  openList.set(start.toString(), start);

  while (openList.size > 0) {
    // Get the node with the lowest f cost
    let current = Array.from(openList.values()).reduce((lowest, node) =>
      fCost.get(node.toString()) < fCost.get(lowest.toString()) ? node : lowest
    );

    // If we reach the goal, reconstruct the path
    if (current[0] === goal[0] && current[1] === goal[1]) {
      return reconstructPath(cameFrom, current);
    }

    openList.delete(current.toString());
    closedList.add(current.toString());

    // Pass snakeBody to getNeighbors
    const neighbors = getNeighbors(current, cols, rows, snakeBody);

    for (let neighbor of neighbors) {
      if (closedList.has(neighbor.toString())) {
        continue; // Ignore already evaluated neighbors
      }

      const tentativeGCost = gCost.get(current.toString()) + 1;

      if (
        !openList.has(neighbor.toString()) ||
        tentativeGCost < gCost.get(neighbor.toString())
      ) {
        cameFrom.set(neighbor.toString(), current);
        gCost.set(neighbor.toString(), tentativeGCost);
        fCost.set(
          neighbor.toString(),
          tentativeGCost + manhattanDistance(neighbor, goal)
        );

        if (!openList.has(neighbor.toString())) {
          openList.set(neighbor.toString(), neighbor);
        }
      }
    }
  }

  return []; // No path found
}

function manhattanDistance(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// Updated getNeighbors function to accept snakeBody
function getNeighbors(node, cols, rows, snakeBody) {
  const neighbors = [];
  const directions = [
    [0, -1], // Up
    [0, 1], // Down
    [-1, 0], // Left
    [1, 0], // Right
  ];

  for (let direction of directions) {
    const newNode = [node[0] + direction[0], node[1] + direction[1]];

    // Ensure the new node is within bounds and not part of the snake's body
    if (
      newNode[0] >= 0 &&
      newNode[0] < cols &&
      newNode[1] >= 0 &&
      newNode[1] < rows &&
      !snakeBody.some(
        (bodyPart) => bodyPart[0] === newNode[0] && bodyPart[1] === newNode[1]
      )
    ) {
      neighbors.push(newNode);
    }
  }

  return neighbors;
}

// Reconstruct the path once the goal is reached
function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(current.toString())) {
    current = cameFrom.get(current.toString());
    path.unshift(current);
  }
  return path;
}
