import type { Route } from "./+types/todos";
import { Form, Outlet } from "react-router";
import { requireToken } from "../util/requireToken";

export async function loader({ request }: Route.LoaderArgs) {
  await requireToken(request);
  return null;
}

export default function Todos() {
  return (
    <div>
      <header className="flex justify-end p-4">
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
          >
            ログアウト
          </button>
        </Form>
      </header>
      <Outlet />
    </div>
  );
}
