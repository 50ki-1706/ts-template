import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { todos } from '@/lib/db/schema';

// GET /api/todos - Get all todos for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, session.user.id))
      .orderBy(todos.createdAt);

    return NextResponse.json(userTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 },
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newTodo = await db
      .insert(todos)
      .values({
        id: crypto.randomUUID(),
        title,
        description: description || null,
        completed: false,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newTodo[0], { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 },
    );
  }
}
