import TextCaseConverter from "@/components/TextCaseConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/text-case");

export default function TextCasePage() {
  return (
    <>
      <h1 className="sr-only">Free Case Converter Online — Uppercase, Lowercase, Title Case & More</h1>
      <TextCaseConverter />
    </>
  );
}
