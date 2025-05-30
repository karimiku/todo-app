import { Link } from "react-router";

export default function IndexPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">TODO App</h1>

        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            ログイン
          </Link>
          <Link
            to="/signup"
            className="block w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            新規登録
          </Link>
        </div>
      </div>
    </main>
  );
}
