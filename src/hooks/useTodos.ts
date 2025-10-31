'use client';

import useSWR, { mutate } from 'swr';
import type { Todo } from '@/lib/db/schema';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
};

export function useTodos() {
  const { data, error, isLoading } = useSWR<Todo[]>('/api/todos', fetcher);

  return {
    todos: data,
    isLoading,
    isError: error,
  };
}

export async function createTodo(title: string, description?: string) {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });

  if (!res.ok) {
    throw new Error('Failed to create todo');
  }

  const newTodo = await res.json();
  mutate('/api/todos');
  return newTodo;
}

export async function updateTodo(
  id: string,
  updates: { title?: string; description?: string; completed?: boolean }
) {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error('Failed to update todo');
  }

  const updatedTodo = await res.json();
  mutate('/api/todos');
  return updatedTodo;
}

export async function deleteTodo(id: string) {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete todo');
  }

  mutate('/api/todos');
  return res.json();
}
