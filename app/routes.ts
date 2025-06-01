import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("signup", "./routes/signup.tsx"),

  route("login", "./routes/login.tsx"),
  route("logout", "./routes/logout.tsx"),
  route("todos", "./routes/todos.tsx", [
    index("./routes/todos.index.tsx"),
    route("new", "./routes/todos.new.tsx"),
    route(":id", "./routes/todos.$id.tsx"),
    route(":id/toggle", "./routes/todos.$id.toggle.tsx"),
    route(":id/delete", "./routes/todos.$id.delete.tsx"),
  ]),
] satisfies RouteConfig;
