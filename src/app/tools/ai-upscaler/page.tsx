import AIUpscaler from "@/components/AIUpscaler";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/ai-upscaler");

export default function Page() {
  return <AIUpscaler />;
}
