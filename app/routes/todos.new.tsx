import { redirect, useActionData } from "react-router";
import { TodoForm } from "../components/TodoForm";
import type { ActionArgs } from "~/types/cloudflare";

export async function action({ request, context }: ActionArgs) {
  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");
  const priority = Number(form.get("priority"));
  const dueDate = form.get("dueDate");
  const cookie = request.headers.get("cookie") || "";

  if (!title || !description || !priority || !dueDate) {
    return new Response(
      JSON.stringify({ error: "すべての項目を入力してください" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const res = await fetch(`${context.cloudflare.env.API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ title, description, priority, dueDate }),
    credentials: "include",
  });

  if (!res.ok) {
    console.error("登録に失敗しました");
  }

  return redirect("/todos");
}

export default function NewTodo() {
  const actionData = useActionData();
  return (
    <TodoForm
      submitLabel="登録"
      heading="Todo登録"
      errorMessage={actionData?.error}
    />
  );
}
