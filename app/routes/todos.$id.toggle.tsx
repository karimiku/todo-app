import { redirect } from "react-router";
import type { ActionArgsWithParams } from "../types/cloudflare";

export async function action({
  request,
  params,
  context,
}: ActionArgsWithParams) {
  const cookie = request.headers.get("cookie") || "";
  const formData = await request.formData();
  const isDone = formData.get("isDone") === "true";

  const res = await fetch(
    `${context.cloudflare.env.API_URL}/todos/${params.id}/toggle`,
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
