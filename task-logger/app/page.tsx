import { getTasks } from "@/lib/tasks-db";
import TaskManager from "./components/TaskManager";

export default async function Home() {

  const tasks = getTasks();
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-gray-100 py-8"> <div className="max-w-2xl mx-auto mb-4 p-4 bg-white rounded-lg shadow text-center">
        <p className="text-gray-700">
          📊 Real database stats: <strong>{tasks.length}</strong> total tasks,{" "}
          <strong>{completedCount}</strong> completed.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Data is persisted in <strong>tasks.db</strong> (SQLite)
        </p>
      </div>
       <TaskManager />
    </main>
  );
}