import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/tasks-db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { completed } = await request.json();
    if (typeof completed !== "boolean") {
      return NextResponse.json({ error: "Completed must be boolean" }, { status: 400 });
    }
    const updated = updateTask(id, completed);
    if (!updated) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteTask(id);
  if (!deleted) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}