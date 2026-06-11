import TodoList from "@/components/TodoList";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/todo");

export default function TodoPage() {
  return (
    <>
      <h1 className="sr-only">Todo List</h1>
      <TodoList />
    </>
  );
}
