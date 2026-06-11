import TextRepeater from "@/components/TextRepeater";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/text-repeater");
export default function Page() { return (
    <>
      <h1 className="sr-only">Text Repeater</h1>
      <TextRepeater />
    </>
  ); }
