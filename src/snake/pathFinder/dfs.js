export function dfsSearch(start, goal, cols, rows, snakeBody, onVisit) {
  const stack = [start];
  const visited = new Set([start.toString()]);
  const cameFrom = new Map();

  if (onVisit) onVisit(start, "current");

  while (stack.length > 0) {
    const current = stack.pop();
    if (onVisit) onVisit(current, "current");
    if (current[0] === goal[0] && current[1] === goal[1]) {
      return reconstructPath(cameFrom, current);
    }

    const neighbors = getNeighbors(current, cols, rows, snakeBody);
    for (const neighbor of neighbors) {
      const key = neighbor.toString();
      if (visited.has(key)) continue;
      visited.add(key);
      cameFrom.set(key, current);
      stack.push(neighbor);
      if (onVisit) onVisit(neighbor, "neighbor");
    }
  }

  return [];
}

function getNeighbors(node, cols, rows, snakeBody) {
  const neighbors = [];
  const dirs = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  for (const d of dirs) {
    const nx = node[0] + d[0];
    const ny = node[1] + d[1];
    if (
      nx >= 0 &&
      nx < cols &&
      ny >= 0 &&
      ny < rows &&
      !snakeBody.some((p) => p[0] === nx && p[1] === ny)
    ) {
      neighbors.push([nx, ny]);
    }
  }
  return neighbors;
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(current.toString())) {
    current = cameFrom.get(current.toString());
    path.unshift(current);
  }
  return path;
}

export default dfsSearch;
