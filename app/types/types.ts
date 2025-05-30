export type Todo = {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  priority: number;
  dueDate: string;
};

export interface Env {
  API_URL: string;
  JWT_SECRET: string;
}
