import { generateToolMetadata } from "@/lib/metadata";
import AgeCalculator from "@/components/AgeCalculator";

export const metadata = generateToolMetadata("/tools/age-calculator");

export default function AgeCalculatorPage() {
  return (
    <>
      <h1 className="sr-only">Age Calculator</h1>
      <AgeCalculator />
    </>
  );
}
