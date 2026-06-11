import MetaTagsGenerator from "@/components/MetaTagsGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/meta-tags");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Meta Tags Generator</h1>
      <MetaTagsGenerator />
    </>
  );
}
