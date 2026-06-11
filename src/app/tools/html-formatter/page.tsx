import HtmlFormatter from "@/components/HtmlFormatter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/html-formatter");
export default function Page() { return (
    <>
      <h1 className="sr-only">HTML Formatter</h1>
      <HtmlFormatter />
    </>
  ); }
