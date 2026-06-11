import AIRulesGenerator from "@/components/AIRulesGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/ai-rules-generator");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">AI Rules Generator</h1>
      <AIRulesGenerator />
    </>
  );
}
