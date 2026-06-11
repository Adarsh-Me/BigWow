import AICostCalculator from "@/components/AICostCalculator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/ai-cost-calculator");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">AI Cost Calculator</h1>
      <AICostCalculator />
    </>
  );
}
