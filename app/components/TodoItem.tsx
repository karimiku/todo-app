// import type { Todo } from "../types/types";

// type Props = {
//   todo: Todo;
//   onToggle: (todo: Todo) => void; // 今回は使わない（form経由で自動submit）
//   onDelete: (id: string) => void; // 同上
// };

// export function TodoItem({ todo }: Props) {
//   return (
//     <li className="flex items-center justify-between border p-4 rounded">
//       {/* ✅ isDone 切り替え */}
//       <form method="post" className="flex items-center space-x-3">
//         <input type="hidden" name="_action" value="toggle" />
//         <input type="hidden" name="id" value={todo.id} />
//         <input
//           type="checkbox"
//           name="isDone"
//           value={!todo.isDone ? "true" : "false"}
//           defaultChecked={todo.isDone}
//           onChange={(e) => e.currentTarget.form?.submit()}
//         />
//         <span className={todo.isDone ? "line-through text-gray-500" : ""}>
//           {todo.title}
//         </span>
//       </form>

//       {/* ❌ 削除ボタン */}
//       <form method="post">
//         <input type="hidden" name="_action" value="delete" />
//         <input type="hidden" name="id" value={todo.id} />
//         <button type="submit" className="text-red-500 hover:text-red-700 ml-4">
//           削除
//         </button>
//       </form>
//     </li>
//   );
// }
