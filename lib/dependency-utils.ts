import { Prisma } from "@prisma/client";

type TodoWithRelations = Prisma.TodoGetPayload<{
  include: { dependsOn: true; dependentTasks: true };
}>;

// Check if adding a dependency would create a cycle
export function wouldCreateCycle(
  todos: TodoWithRelations[],
  dependentId: number,
  prerequisiteId: number
): boolean {
  const todoMap = new Map(todos.map((t) => [t.id, t]));
  const visited = new Set<number>();

  function canReach(currentId: number, targetId: number): boolean {
    if (currentId === targetId) return true;
    if (visited.has(currentId)) return false;

    visited.add(currentId);
    const todo = todoMap.get(currentId);
    if (!todo) return false;

    for (const dep of todo.dependsOn) {
      if (canReach(dep.prerequisiteId, targetId)) {
        return true;
      }
    }
    return false;
  }

  return canReach(prerequisiteId, dependentId);
}

// Find the longest path in the dependency graph (critical path)
// Also calculates earliest start date for each task
export function calculateCriticalPath<
  T extends { id: number; dueDate: Date; dependsOn: { prerequisiteId: number }[] }
>(todos: T[]): (T & { isOnCriticalPath: boolean; earliestStartDate: Date })[] {
  if (todos.length === 0) return [];

  const todoMap = new Map(todos.map((t) => [t.id, t]));

  // Build adjacency list (prerequisite -> dependents)
  const dependents = new Map<number, number[]>();
  for (const todo of todos) {
    dependents.set(todo.id, []);
  }
  for (const todo of todos) {
    for (const dep of todo.dependsOn) {
      dependents.get(dep.prerequisiteId)?.push(todo.id);
    }
  }

  // Topological sort + calculate longest path and earliest start
  const longestPathTo = new Map<number, number>();
  const predecessors = new Map<number, Set<number>>(); // Track ALL predecessors with max path
  const earliestStart = new Map<number, Date>();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inDegree = new Map<number, number>();
  for (const todo of todos) {
    inDegree.set(todo.id, todo.dependsOn.length);
    predecessors.set(todo.id, new Set());
  }

  const queue: number[] = [];
  inDegree.forEach((degree, id) => {
    if (degree === 0) {
      queue.push(id);
      longestPathTo.set(id, 1);
      earliestStart.set(id, today);
    }
  });

  const sorted: number[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    const currentTodo = todoMap.get(current)!;

    for (const dependent of dependents.get(current) || []) {
      const newDegree = (inDegree.get(dependent) || 0) - 1;
      inDegree.set(dependent, newDegree);

      // Update longest path
      const pathThroughCurrent = (longestPathTo.get(current) || 0) + 1;
      const currentLongest = longestPathTo.get(dependent) || 0;

      if (pathThroughCurrent > currentLongest) {
        // New longer path found - reset predecessors
        longestPathTo.set(dependent, pathThroughCurrent);
        predecessors.set(dependent, new Set([current]));
      } else if (pathThroughCurrent === currentLongest && currentLongest > 0) {
        // Tie - add to predecessors
        predecessors.get(dependent)?.add(current);
      }

      // Update earliest start date (max of all prerequisite due dates)
      const currentEarliestStart = earliestStart.get(dependent) || today;
      const prereqDueDate = new Date(currentTodo.dueDate);
      if (prereqDueDate > currentEarliestStart) {
        earliestStart.set(dependent, prereqDueDate);
      }

      if (newDegree === 0) queue.push(dependent);
    }
  }

  // Find the maximum path length
  let maxLength = 0;
  longestPathTo.forEach((length) => {
    if (length > maxLength) maxLength = length;
  });

  // Find all end nodes with the maximum path length
  const endNodes: number[] = [];
  longestPathTo.forEach((length, id) => {
    if (length === maxLength) endNodes.push(id);
  });

  // Backtrack from all end nodes to find all nodes on any critical path
  const criticalPathNodes = new Set<number>();
  const toVisit = [...endNodes];
  while (toVisit.length > 0) {
    const current = toVisit.pop()!;
    if (criticalPathNodes.has(current)) continue;
    criticalPathNodes.add(current);

    const preds = predecessors.get(current);
    if (preds) {
      for (const pred of preds) {
        toVisit.push(pred);
      }
    }
  }

  return todos.map((todo) => ({
    ...todo,
    isOnCriticalPath: criticalPathNodes.has(todo.id),
    earliestStartDate: earliestStart.get(todo.id) || today,
  }));
}
