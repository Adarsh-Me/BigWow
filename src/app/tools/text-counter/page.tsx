import TextCounter from "@/components/TextCounter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/text-counter");

export default function TextCounterPage() {
  return (
    <>
      <h1 className="sr-only">Free Word Counter Online — Character, Sentence & Paragraph Count</h1>
      <TextCounter />
    </>
  );
}
