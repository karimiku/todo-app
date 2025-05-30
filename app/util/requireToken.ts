import { redirect } from "react-router";
import { parse } from "cookie";

export async function requireToken(request: Request) {
  const cookie = request.headers.get("Cookie");
  const token = cookie && parse(cookie).token;

  // トークンがなければリダイレクト（中身の検証はしない）
  if (!token) throw redirect("/login");

  return token; // もしくは cookie オブジェクトそのものを返してもOK
}
