import { useState } from "react";
import type { Route } from "./+types/todos.index";
import type { Todo } from "../types/types";
import type { LoaderArgs, ActionArgs } from "../types/cloudflare";
import { NewTodoButton } from "~/components/NewTodoButton";

export async function loader({ request, context }: LoaderArgs) {
  const cookie = request.headers.get("cookie") || "";
  const res = await fetch(`${context.cloudflare.env.API_URL}/todos`, {
    headers: { cookie },
  });
  const data: { todos: Todo[] } = await res.json();
  return data.todos.sort((a, b) => a.priority - b.priority);
}

export async function action({ request, context }: ActionArgs) {
  const cookie = request.headers.get("cookie") || "";
  const formData = await request.formData();
  const actionType = formData.get("_action");
  const todoId = formData.get("id");

  if (!todoId || typeof todoId !== "string") {
    return new Response("Invalid ID", { status: 400 });
  }

  if (actionType === "toggle") {
    const isDone = formData.get("isDone") === "true";
    const res = await fetch(
      `${context.cloudflare.env.API_URL}/todos/${todoId}/toggle`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          cookie,
        },
        body: JSON.stringify({ isDone }),
      }
    );
    return new Response(null, { status: res.status });
  }

  if (actionType === "delete") {
    const res = await fetch(
      `${context.cloudflare.env.API_URL}/todos/${todoId}`,
      {
        method: "DELETE",
        headers: { cookie },
      }
    );
    return new Response(null, { status: res.status });
  }

  return new Response("Invalid action", { status: 400 });
}

export default function TodosIndex({ loaderData }: Route.ComponentProps) {
  const [todos] = useState<Todo[]>(loaderData ?? []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Todo一覧</h2>
      <NewTodoButton />

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border p-4 rounded"
          >
            <form method="post" className="flex items-center gap-2">
              <input type="hidden" name="_action" value="toggle" />
              <input type="hidden" name="id" value={todo.id} />
              <input
                type="checkbox"
                name="isDone"
                value={!todo.isDone ? "true" : "false"}
                defaultChecked={todo.isDone}
                onChange={(e) => {
                  e.currentTarget.form?.submit();
                }}
              />
              <span className={todo.isDone ? "line-through" : ""}>
                {todo.title}
              </span>
            </form>

            <form method="post">
              <input type="hidden" name="_action" value="delete" />
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                className="text-red-500 hover:underline ml-2"
              >
                削除
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
