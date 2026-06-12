import JsonFormatter from "@/components/JsonFormatter";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/json-formatter");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Free JSON Formatter Online — Format, Validate & Minify JSON</h1>
      <JsonFormatter />
      <RelatedPrivacyGuides toolPath="/tools/json-formatter" />
    </>
  );
}

