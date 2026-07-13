"use client";
import { useState, useEffect } from "react";
import DependencySelector from "@/components/DependencySelector";
import dynamic from "next/dynamic";

// Dynamically import DependencyGraph to avoid SSR issues with ReactFlow
const DependencyGraph = dynamic(() => import("@/components/DependencyGraph"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-gray-50 rounded-lg">
      <p className="text-gray-500">Loading graph...</p>
    </div>
  ),
});

interface TodoDependency {
  id: number;
  dependentId: number;
  prerequisiteId: number;
}

interface Todo {
  id: number;
  title: string;
  createdAt: string;
  dueDate: string;
  imageUrl: string | null;
  dependsOn: TodoDependency[];
  dependentTasks: TodoDependency[];
  isOnCriticalPath: boolean;
  earliestStartDate: string;
}

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "graph">("list");
  const [editingDepsFor, setEditingDepsFor] = useState<number | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim() || !dueDate || isAdding) return;
    setIsAdding(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTodo,
          dueDate,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to add todo");
        return;
      }
      setNewTodo("");
      setDueDate("");
      fetchTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleAddDependency = async (todoId: number, prerequisiteId: number) => {
    const res = await fetch(`/api/todos/${todoId}/dependencies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prerequisiteId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to add dependency");
    }
    fetchTodos();
  };

  const handleRemoveDependency = async (todoId: number, prerequisiteId: number) => {
    const res = await fetch(`/api/todos/${todoId}/dependencies`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prerequisiteId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to remove dependency");
    }
    fetchTodos();
  };

  const getPrerequisiteNames = (todo: Todo): string[] => {
    return todo.dependsOn
      .map((dep) => {
        const prereq = todos.find((t) => t.id === dep.prerequisiteId);
        return prereq?.title || "Unknown";
      })
      .filter(Boolean);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const editingTodo = editingDepsFor ? todos.find((t) => t.id === editingDepsFor) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-red-500 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Things To Do App
        </h1>

        {/* Add Todo Form */}
        <div className={`flex flex-wrap gap-2 mb-6 transition-opacity ${isAdding ? "opacity-70" : ""}`}>
          <input
            type="text"
            className="flex-grow p-3 rounded-l-full focus:outline-none text-gray-700 min-w-[200px] disabled:bg-gray-100"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
            disabled={isAdding}
          />
          <input
            type="date"
            className="p-3 focus:outline-none text-gray-700 disabled:bg-gray-100"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            disabled={isAdding}
          />
          <button
            onClick={handleAddTodo}
            disabled={isAdding || !newTodo.trim() || !dueDate}
            className="bg-white text-indigo-600 p-3 rounded-r-full hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAdding ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </>
            ) : (
              "Add"
            )}
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === "list"
                ? "bg-white text-indigo-600"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("graph")}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === "graph"
                ? "bg-white text-indigo-600"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            Graph View
          </button>
        </div>

        {/* Graph View */}
        {viewMode === "graph" && (
          <div className="mb-6">
            <DependencyGraph todos={todos} />
            <p className="text-white/80 text-sm text-center mt-2">
              Red nodes and edges indicate the critical path. Drag to pan, scroll to zoom.
            </p>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <ul>
            {todos.map((todo) => {
              const prereqNames = getPrerequisiteNames(todo);
              const isOverdue = new Date(todo.dueDate) < new Date();

              return (
                <li
                  key={todo.id}
                  className={`flex justify-between items-start bg-white bg-opacity-90 p-4 mb-4 rounded-lg shadow-lg ${
                    todo.isOnCriticalPath ? "border-l-4 border-red-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-4 flex-grow">
                    {todo.imageUrl && (
                      <img
                        src={todo.imageUrl}
                        alt={todo.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex flex-col flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 font-medium">{todo.title}</span>
                        {todo.isOnCriticalPath && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                            Critical Path
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mt-1">
                        <span className={isOverdue ? "text-red-500" : ""}>
                          Due: {formatDate(todo.dueDate)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        Earliest Start: {formatDate(todo.earliestStartDate)}
                      </div>

                      {prereqNames.length > 0 && (
                        <div className="text-sm text-indigo-600 mt-1">
                          Depends on: {prereqNames.join(", ")}
                        </div>
                      )}

                      <button
                        onClick={() => setEditingDepsFor(todo.id)}
                        className="text-sm text-indigo-500 hover:text-indigo-700 mt-2 self-start"
                      >
                        Manage Dependencies
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 transition duration-300 flex-shrink-0 ml-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {todos.length === 0 && (
          <p className="text-white text-center opacity-80">No todos yet. Add one above!</p>
        )}
      </div>

      {/* Dependency Selector Modal */}
      {editingDepsFor && editingTodo && (
        <DependencySelector
          todoId={editingDepsFor}
          currentPrerequisites={editingTodo.dependsOn.map((d) => d.prerequisiteId)}
          allTodos={todos.map((t) => ({ id: t.id, title: t.title }))}
          onAddDependency={(prereqId) => handleAddDependency(editingDepsFor, prereqId)}
          onRemoveDependency={(prereqId) => handleRemoveDependency(editingDepsFor, prereqId)}
          onClose={() => setEditingDepsFor(null)}
        />
      )}
    </div>
  );
}
