import { redirect, Form, Link, useActionData } from "react-router";
import type { ActionArgs } from "../types/cloudflare";

export async function action({ request, context }: ActionArgs) {
  const form = await request.formData();
  const email = form.get("email")?.toString() || "";
  const password = form.get("password")?.toString() || "";
  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください。" };
  }

  const res = await fetch(`${context.cloudflare.env.API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    return { error: err?.error };
  }

  return redirect("/login");
}

export default function SignupPage() {
  const actionData = useActionData();

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6">新規登録</h2>

        {actionData?.error && (
          <p className="text-red-500 text-sm mb-4 text-center">
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              8文字以上で、大文字・小文字・数字をすべて含めてください。
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            登録する
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
