// // components/TodoList.tsx
// import type { Todo } from "../types/types";

// type Props = {
//   todos: Todo[];
// };

// export function TodoList({ todos }: Props) {
//   return (
//     <ul className="space-y-4">
//       {todos.map((todo) => (
//         <li
//           key={todo.id}
//           className="flex items-center justify-between border p-4 rounded"
//         >
//           <form method="post" className="flex items-center gap-2">
//             <input type="hidden" name="id" value={todo.id} />
//             <input type="hidden" name="_action" value="toggle" />
//             <input
//               type="checkbox"
//               name="isDone"
//               value={!todo.isDone ? "true" : "false"}
//               defaultChecked={todo.isDone}
//               onChange={() => {
//                 // チェック時に自動 submit（JS 要）
//                 // 非JS環境なら submit ボタンが必要
//                 (e.target as HTMLInputElement).form?.submit();
//               }}
//             />
//             <span className={todo.isDone ? "line-through" : ""}>
//               {todo.title}
//             </span>
//           </form>

//           <form method="post">
//             <input type="hidden" name="id" value={todo.id} />
//             <input type="hidden" name="_action" value="delete" />
//             <button type="submit" className="text-red-500 hover:underline">
//               削除
//             </button>
//           </form>
//         </li>
//       ))}
//     </ul>
//   );
// }
