import SystemPromptBuilder from "@/components/SystemPromptBuilder";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/system-prompt-builder");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">System Prompt Builder</h1>
      <SystemPromptBuilder />
    </>
  );
}
