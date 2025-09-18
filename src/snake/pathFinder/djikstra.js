export function dijkstraSearch(start, goal, cols, rows, snakeBody, onVisit) {
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();
  const queue = new Set();

  const startKey = start.toString();
  const goalKey = goal.toString();

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const key = `${x},${y}`.replace(",", ",");
      // placeholders: we'll only consider nodes not in snake body on the fly
    }
  }

  dist.set(startKey, 0);
  queue.add(startKey);

  const keyToPoint = new Map();
  keyToPoint.set(startKey, start);

  if (onVisit) onVisit(start, "current");

  function getNeighbors(node) {
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

  while (queue.size > 0) {
    // extract node with smallest dist
    let currentKeyMin = null;
    let minDist = Infinity;
    for (const key of queue) {
      const d = dist.get(key) ?? Infinity;
      if (d < minDist) {
        minDist = d;
        currentKeyMin = key;
      }
    }
    queue.delete(currentKeyMin);
    visited.add(currentKeyMin);

    const current =
      keyToPoint.get(currentKeyMin) || currentKeyMin.split(",").map(Number);
    if (onVisit) onVisit(current, "current");
    if (currentKeyMin === goalKey) {
      return reconstructPath(prev, current);
    }

    for (const neighbor of getNeighbors(current)) {
      const nKey = neighbor.toString();
      if (visited.has(nKey)) continue;
      const alt = (dist.get(currentKeyMin) ?? Infinity) + 1;
      if (alt < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, alt);
        prev.set(nKey, current);
        keyToPoint.set(nKey, neighbor);
        queue.add(nKey);
        if (onVisit) onVisit(neighbor, "neighbor");
      }
    }
  }

  return [];
}

function reconstructPath(prev, current) {
  const path = [current];
  while (prev.has(current.toString())) {
    current = prev.get(current.toString());
    path.unshift(current);
  }
  return path;
}

export default dijkstraSearch;
