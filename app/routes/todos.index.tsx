import { useState } from "react";
import { Link, redirect } from "react-router";
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
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("トグル更新失敗:", res.status, errorText);
      return new Response("トグル更新失敗", { status: 500 });
    }

    return redirect("/todos");
  }

  if (actionType === "delete") {
    const res = await fetch(
      `${context.cloudflare.env.API_URL}/todos/${todoId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          cookie,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("削除失敗:", res.status, errorText);
      return new Response("削除失敗", { status: 500 });
    }

    return redirect("/todos");
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
            className="flex items-start justify-between border p-4 rounded"
          >
            <form
              method="post"
              action={`/todos/${todo.id}/toggle`}
              className="flex flex-col gap-2 flex-grow"
            >
              <input type="hidden" name="_action" value="toggle" />
              <input type="hidden" name="id" value={todo.id} />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isDone"
                  value={!todo.isDone ? "true" : "false"}
                  defaultChecked={todo.isDone}
                  onChange={(e) => {
                    e.currentTarget.form?.submit();
                  }}
                />
                <span
                  className={`text-lg font-medium ${
                    todo.isDone ? "line-through" : ""
                  }`}
                >
                  {todo.title}
                </span>
              </label>
              <div className="ml-6 space-y-1">
                <p className="text-gray-600">{todo.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    優先度: {todo.priority}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    締切:{" "}
                    {new Date(todo.dueDate).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </form>

            {/* ✅ 編集 & 削除ボタン */}
            <div className="flex flex-col items-end gap-2 ml-4">
              <Link
                to={`/todos/${todo.id}`}
                className="text-blue-500 hover:underline"
              >
                編集
              </Link>
              <form
                method="post"
                action={`/todos/${todo.id}/delete`}
                onSubmit={(e) => {
                  if (!window.confirm("削除しますか？")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="id" value={todo.id} />
                <button type="submit" className="text-red-500 hover:underline">
                  削除
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
