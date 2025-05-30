import type { Route } from "./+types/login";
import { Form, Link, redirect, useActionData } from "react-router";
import type { ActionArgs } from "../types/cloudflare";

export async function loader({ request }: Route.LoaderArgs) {
  //tokenがあれば/todosに遷移
  const cookie = request.headers.get("cookie") || "";
  const hasToken = cookie.includes("token=");
  if (hasToken) {
    return redirect("/todos");
  }
  return null;
}

export async function action({ request, context }: ActionArgs) {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return new Response("無効な入力", { status: 400 });
  }

  const res = await fetch(`${context.cloudflare.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    return { error: err?.error ?? "ログインに失敗しました" };
  }

  const { token } = (await res.json()) as { token: string };

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/todos",
      "Set-Cookie": `token=${token}; Path=/; HttpOnly; Max-Age=3600; SameSite=Lax; Secure`,
    },
  });
}

export default function LoginPage() {
  const actionData = useActionData();
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>

        {actionData?.error && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {actionData.error}
          </p>
        )}

        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="パスワード"
              className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            ログイン
          </button>
        </Form>
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
