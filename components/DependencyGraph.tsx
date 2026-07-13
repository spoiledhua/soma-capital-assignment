"use client";
import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

interface TodoForGraph {
  id: number;
  title: string;
  isOnCriticalPath: boolean;
  dependsOn: { prerequisiteId: number }[];
}

interface DependencyGraphProps {
  todos: TodoForGraph[];
}

export default function DependencyGraph({ todos }: DependencyGraphProps) {
  // Create a map for quick lookup
  const todoMap = useMemo(() => new Map(todos.map((t) => [t.id, t])), [todos]);

  // Calculate positions using simple layered layout
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // Calculate levels (topological layers)
    const levels = new Map<number, number>();
    const inDegree = new Map<number, number>();

    // Initialize
    todos.forEach((todo) => {
      inDegree.set(todo.id, todo.dependsOn.length);
      if (todo.dependsOn.length === 0) {
        levels.set(todo.id, 0);
      }
    });

    // BFS to assign levels
    let changed = true;
    while (changed) {
      changed = false;
      todos.forEach((todo) => {
        if (levels.has(todo.id)) return;

        // Check if all prerequisites have levels assigned
        const prereqLevels = todo.dependsOn.map((d) => levels.get(d.prerequisiteId));
        if (prereqLevels.every((l) => l !== undefined)) {
          const maxLevel = Math.max(...(prereqLevels as number[]));
          levels.set(todo.id, maxLevel + 1);
          changed = true;
        }
      });
    }

    // Handle any remaining nodes (disconnected or cycles)
    todos.forEach((todo) => {
      if (!levels.has(todo.id)) {
        levels.set(todo.id, 0);
      }
    });

    // Group by level
    const nodesByLevel = new Map<number, number[]>();
    todos.forEach((todo) => {
      const level = levels.get(todo.id)!;
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, []);
      }
      nodesByLevel.get(level)!.push(todo.id);
    });

    // Create nodes with positions
    const nodes: Node[] = todos.map((todo) => {
      const level = levels.get(todo.id)!;
      const nodesAtLevel = nodesByLevel.get(level)!;
      const indexAtLevel = nodesAtLevel.indexOf(todo.id);
      const totalAtLevel = nodesAtLevel.length;

      // Center nodes at each level
      const xSpacing = 200;
      const ySpacing = 120;
      const xOffset = ((totalAtLevel - 1) * xSpacing) / 2;

      return {
        id: String(todo.id),
        data: {
          label: (
            <div className="text-center">
              <div className="font-medium truncate max-w-[150px]">{todo.title}</div>
              {todo.isOnCriticalPath && (
                <div className="text-xs mt-1 text-red-600 font-semibold">Critical Path</div>
              )}
            </div>
          ),
        },
        position: {
          x: indexAtLevel * xSpacing - xOffset + 400,
          y: level * ySpacing + 50,
        },
        style: {
          background: todo.isOnCriticalPath ? "#fee2e2" : "#f3f4f6",
          border: todo.isOnCriticalPath ? "2px solid #ef4444" : "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "10px",
          minWidth: "150px",
        },
      };
    });

    // Create edges
    const edges: Edge[] = [];
    todos.forEach((todo) => {
      todo.dependsOn.forEach((dep) => {
        const prereq = todoMap.get(dep.prerequisiteId);
        const isCriticalEdge = todo.isOnCriticalPath && prereq?.isOnCriticalPath;

        edges.push({
          id: `${dep.prerequisiteId}-${todo.id}`,
          source: String(dep.prerequisiteId),
          target: String(todo.id),
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isCriticalEdge ? "#ef4444" : "#9ca3af",
          },
          style: {
            stroke: isCriticalEdge ? "#ef4444" : "#9ca3af",
            strokeWidth: isCriticalEdge ? 2 : 1,
          },
          animated: isCriticalEdge,
        });
      });
    });

    return { nodes, edges };
  }, [todos, todoMap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when todos change
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (todos.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No tasks to display</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] bg-white rounded-lg shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background color="#e5e7eb" gap={16} />
      </ReactFlow>
    </div>
  );
}
