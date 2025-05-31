import { redirect } from "react-router";
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
    console.error("更新に失敗しました");
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
    throw new Error("TODO取得に失敗しました");
  }

  const { todo }: any = await res.json();
  return todo;
}

export default function EditTodo({ loaderData }: Route.ComponentProps) {
  return (
    <TodoForm
      defaultValues={loaderData}
      submitLabel="更新する"
      heading="Todo編集"
    />
  );
}
