import ContextWindowCalculator from "@/components/ContextWindowCalculator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/context-window");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Context Window Calculator</h1>
      <ContextWindowCalculator />
    </>
  );
}
