import PercentageCalculator from "@/components/PercentageCalculator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/percentage-calculator");
export default function Page() { return (
    <>
      <h1 className="sr-only">Percentage Calculator</h1>
      <PercentageCalculator />
    </>
  ); }
