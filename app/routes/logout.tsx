import { redirect } from "react-router";

export async function action() {
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": "token=; Path=/; Max-Age=0;",
      Location: "/login",
    },
  });
}
