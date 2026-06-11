import TextSimilarity from "@/components/TextSimilarity";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/text-similarity");
export default function Page() { return (
    <>
      <h1 className="sr-only">Text Similarity</h1>
      <TextSimilarity />
    </>
  ); }
