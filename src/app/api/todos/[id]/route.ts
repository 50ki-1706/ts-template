import { and, eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { todos } from '@/lib/db/schema';

// PATCH /api/todos/[id] - Update a todo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, completed } = body;

    // Verify the todo belongs to the user
    const existingTodo = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
      .limit(1);

    if (existingTodo.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const updatedTodo = await db
      .update(todos)
      .set({
        title: title ?? existingTodo[0].title,
        description:
          description !== undefined ? description : existingTodo[0].description,
        completed: completed ?? existingTodo[0].completed,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
      .returning();

    return NextResponse.json(updatedTodo[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 },
    );
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the todo belongs to the user before deleting
    const existingTodo = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)))
      .limit(1);

    if (existingTodo.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, session.user.id)));

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 },
    );
  }
}
