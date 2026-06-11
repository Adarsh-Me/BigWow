import SqlFormatter from "@/components/SqlFormatter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/sql-formatter");
export default function Page() { return (
    <>
      <h1 className="sr-only">SQL Formatter</h1>
      <SqlFormatter />
    </>
  ); }
