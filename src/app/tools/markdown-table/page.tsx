import MarkdownTableGenerator from "@/components/MarkdownTableGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/markdown-table");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Markdown Table Generator</h1>
      <MarkdownTableGenerator />
    </>
  );
}
