import db from "./db";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const rowToTask = (row: { id: string; title: string; completed: number | boolean; createdAt: string }): Task => ({
  ...row,
  completed: row.completed === 1,
});

export const getTasks = (): Task[] => {
  const stmt = db.prepare("SELECT * FROM tasks ORDER BY createdAt DESC");
  const rows = stmt.all();
  return rows.map(rowToTask);
};

export const addTask = (title: string): Task => {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(
    "INSERT INTO tasks (id, title, completed, createdAt) VALUES (?, ?, ?, ?)"
  );
  stmt.run(id, title, 0, createdAt);
  return { id, title, completed: false, createdAt };
};

export const updateTask = (id: string, completed: boolean): Task | null => {
  const stmt = db.prepare("UPDATE tasks SET completed = ? WHERE id = ?");
  const result = stmt.run(completed ? 1 : 0, id);
  if (result.changes === 0) return null;
  const selectStmt = db.prepare("SELECT * FROM tasks WHERE id = ?");
  const row = selectStmt.get(id);
  return row ? rowToTask(row) : null;
};

export const deleteTask = (id: string): boolean => {
  const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
};