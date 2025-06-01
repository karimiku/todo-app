import { redirect } from "react-router";
import type { ActionArgsWithParams } from "../types/cloudflare";

export async function action({
  request,
  params,
  context,
}: ActionArgsWithParams) {
  const cookie = request.headers.get("cookie") || "";

  const res = await fetch(
    `${context.cloudflare.env.API_URL}/todos/${params.id}`,
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
