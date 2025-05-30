import { Link } from "react-router";

export function NewTodoButton() {
  return (
    <div className="flex justify-end mb-4">
      <Link
        to="new"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
      >
        ＋ 新規作成
      </Link>
    </div>
  );
}
