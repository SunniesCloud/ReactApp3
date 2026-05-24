import { NextResponse } from "next/server";
import { getTasks, addTask } from "@/lib/tasks-db";

export async function GET() {
  const tasks = getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const newTask = addTask(title);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
