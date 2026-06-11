import TextBinaryConverter from "@/components/TextBinaryConverter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/text-binary");
export default function Page() { return (
    <>
      <h1 className="sr-only">Text to Binary</h1>
      <TextBinaryConverter />
    </>
  ); }
