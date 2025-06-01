import { redirect, useActionData } from "react-router";
import type { Route } from "./+types/todos.$id";
import { TodoForm } from "~/components/TodoForm";
import type {
  LoaderArgsWithParams,
  ActionArgsWithParams,
} from "../types/cloudflare";

export async function action({
  request,
  params,
  context,
}: ActionArgsWithParams) {
  const form = await request.formData();
  const title = form.get("title")?.toString() || "";
  const description = form.get("description")?.toString() || "";
  const priority = Number(form.get("priority"));
  const dueDate = form.get("dueDate")?.toString() || "";
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

  const res = await fetch(
    `${context.cloudflare.env.API_URL}/todos/${params.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify({
        title,
        description,
        isDone: false,
        priority,
        dueDate,
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("更新に失敗しました:", res.status, errorText);
    return new Response("更新失敗", { status: 500 });
  }

  return redirect("/todos");
}

export async function loader({
  params,
  request,
  context,
}: LoaderArgsWithParams) {
  const cookie = request.headers.get("cookie") || "";

  const res = await fetch(
    `${context.cloudflare.env.API_URL}/todos/${params.id}`,
    {
      headers: { cookie },
    }
  );

  if (!res.ok) {
    console.error("TODO取得に失敗:", res.status);
    throw new Response("TODO取得に失敗", { status: 500 });
  }

  const { todo }: any = await res.json();
  return todo;
}

export default function EditTodo({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData();
  return (
    <TodoForm
      defaultValues={loaderData}
      submitLabel="更新する"
      heading="Todo編集"
      errorMessage={actionData?.error}
    />
  );
}
