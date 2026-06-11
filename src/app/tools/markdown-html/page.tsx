import MarkdownToHtml from "@/components/MarkdownToHtml";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/markdown-html");
export default function Page() { return (
    <>
      <h1 className="sr-only">Markdown to HTML</h1>
      <MarkdownToHtml />
    </>
  ); }
