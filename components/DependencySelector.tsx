"use client";
import { useState } from "react";

interface Todo {
  id: number;
  title: string;
}

interface DependencySelectorProps {
  todoId: number;
  currentPrerequisites: number[];
  allTodos: Todo[];
  onAddDependency: (prerequisiteId: number) => Promise<void>;
  onRemoveDependency: (prerequisiteId: number) => Promise<void>;
  onClose: () => void;
}

export default function DependencySelector({
  todoId,
  currentPrerequisites,
  allTodos,
  onAddDependency,
  onRemoveDependency,
  onClose,
}: DependencySelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter out the current todo from the list
  const availableTodos = allTodos.filter((t) => t.id !== todoId);

  const handleToggle = async (prereqId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      if (currentPrerequisites.includes(prereqId)) {
        await onRemoveDependency(prereqId);
      } else {
        await onAddDependency(prereqId);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update dependency");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Manage Dependencies
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Select tasks that must be completed before this task can start:
        </p>

        {availableTodos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No other tasks available</p>
        ) : (
          <ul className="space-y-2">
            {availableTodos.map((todo) => (
              <li key={todo.id}>
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentPrerequisites.includes(todo.id)}
                    onChange={() => handleToggle(todo.id)}
                    disabled={isLoading}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{todo.title}</span>
                </label>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
