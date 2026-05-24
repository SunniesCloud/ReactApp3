"use client";

import { useState, useEffect, FormEvent } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      await fetchTasks();
       setNewTaskTitle("");
    } catch (err) {
      setError("Could not add task");
    }
  };


  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      await fetchTasks();
    } catch {
      setError("Could not update task");
    }
  };


  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      await fetchTasks();
    } catch {
      setError("Could not delete task");
    }
  };

  if (loading) return <div className="p-4 text-center">Loading tasks...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Task Logger</h2>


  <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

       <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id, task.completed)}
                className="w-5 h-5"
              />
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.title}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="text-gray-500 text-center">No tasks yet. Add one!</li>
        )}
      </ul>
    </div>
  );
}
