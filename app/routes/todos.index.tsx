import { useState } from "react";
import type { Route } from "./+types/todos.index";
import { TodoList } from "../components/TodoList";
import { NewTodoButton } from "../components/NewTodoButton";
import type { Todo } from "../types/types";
import type { LoaderArgs } from "../types/cloudflare";

export async function loader({ request, context }: LoaderArgs) {
  const cookie = request.headers.get("cookie") || "";
  const res = await fetch(`${context.cloudflare.env.API_URL}/todos`, {
    headers: { cookie },
  });
  const data: { todos: Todo[] } = await res.json();
  return data.todos.sort((a, b) => a.priority - b.priority);
}

export default function TodosIndex({ loaderData }: Route.ComponentProps) {
  const [todos, setTodos] = useState<Todo[]>(loaderData ?? []);

  const handleToggle = async (todo: Todo): Promise<void> => {
    const updated: Todo = { ...todo, isDone: !todo.isDone };
    setTodos((prev: Todo[]) =>
      prev.map((t: Todo) => (t.id === todo.id ? updated : t))
    );

    await fetch(`${import.meta.env.API_URL}/todos/${todo.id}/toggle`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isDone: updated.isDone }),
    });
  };

  const handleDelete = async (id: string): Promise<void> => {
    const res = await fetch(`${import.meta.env.API_URL}/todos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Todo一覧</h2>
      <NewTodoButton />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}
