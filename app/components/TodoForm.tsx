// components/TodoForm.tsx
import { Form, Link } from "react-router";

type Props = {
  defaultValues?: {
    title?: string;
    description?: string;
    priority?: number;
    dueDate?: string;
  };
  submitLabel: string;
  heading: string;
  errorMessage?: string;
};

export function TodoForm({
  defaultValues,
  submitLabel,
  heading,
  errorMessage,
}: Props) {
  return (
    <div>
      <Form
        method="post"
        className="max-w-xl mx-auto p-6 space-y-6 bg-white text-gray-900 rounded shadow"
      >
        <h2 className="text-2xl font-bold border-b pb-2">{heading}</h2>

        {errorMessage && (
          <p className="text-red-600 bg-red-100 p-2 rounded">{errorMessage}</p>
        )}

        <div className="space-y-2">
          <label className="block">タイトル</label>
          <input
            type="text"
            name="title"
            defaultValue={defaultValues?.title}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block">説明</label>
          <textarea
            name="description"
            defaultValue={defaultValues?.description}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block">優先度</label>
          <input
            type="number"
            name="priority"
            defaultValue={defaultValues?.priority ?? 1}
            className="w-full border rounded p-2"
            min={1}
            max={1000}
          />
        </div>

        <div className="space-y-2">
          <label className="block">期限日</label>
          <input
            type="date"
            name="dueDate"
            defaultValue={defaultValues?.dueDate}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </Form>

      <div className="mt-4 text-center">
        <Link to="/todos" className="text-sm text-blue-600 hover:underline">
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
