# Snake AI

This project demonstrates a classic Snake game controlled by several popular AI pathfinding and search algorithms. Instead of manual control, the snake's movement is determined autonomously, providing a platform to visualize and compare the behavior of different AI strategies in a dynamic environment.

## Features

*   **Algorithmic Control:** The snake's path is managed by one of several selectable AI algorithms.
*   **Algorithm Visualization:** Watch the snake navigate the grid using:
    *   **Breadth-First Search (BFS):** Finds the shortest path to the food by exploring the grid layer by layer.
    *   **Depth-First Search (DFS):** Explores a single path as far as possible before backtracking.
    *   **A* Search:** A powerful algorithm that uses a heuristic (e.g., Manhattan distance) to find the most optimal path efficiently.
    *   **Dijkstra's Algorithm:** Finds the lowest-cost path from the snake's head to the food.
    *   **Flood Fill:** A method to find and ensure there is a clear, contiguous area to avoid trapping the snake.
*   **Interactive Gameplay:** Observe how each algorithm tackles the challenge of growing the snake while avoiding collisions.
*   **Extensible Code:** A modular design allows for easy integration of additional algorithms or game enhancements.

## Technologies Used

*   **JavaScript:** The core programming language for the game logic.






#################################################################################################################################################################

later need to add edge cases like how it should traverse so that there is always a path to the apple rather then dieign because it did not find aa path.


few noticed issue

A*:
  solution: longest path.
            80% reachable constraint at all time.
            Always-possible path to food.
