import { Link } from "react-router";
import type { Todo } from "../types/types";

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="flex justify-between items-start p-4 border rounded-lg shadow-sm bg-white">
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={() => onToggle(todo)}
        className="mr-4 mt-1"
      />
      <div className="flex-1">
        <h3
          className={`text-lg font-semibold ${
            todo.isDone ? "line-through text-gray-400" : ""
          }`}
        >
          {todo.title}
        </h3>
        <p className="text-sm text-gray-600">{todo.description}</p>
        <div className="text-xs text-gray-500 mt-1">
          締切: {new Date(todo.dueDate).toLocaleDateString()} | 優先度:{" "}
          {todo.priority}
        </div>
      </div>
      <div className="ml-4 space-x-2">
        <Link to={todo.id} className="text-blue-600 hover:underline text-sm">
          編集
        </Link>
        <button
          className="text-red-600 hover:underline text-sm"
          onClick={() => {
            if (confirm("本当に削除しますか？")) onDelete(todo.id);
          }}
        >
          削除
        </button>
      </div>
    </li>
  );
}
