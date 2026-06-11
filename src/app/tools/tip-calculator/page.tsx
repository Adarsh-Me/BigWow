import TipCalculator from "@/components/TipCalculator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/tip-calculator");
export default function Page() { return (
    <>
      <h1 className="sr-only">Tip Calculator</h1>
      <TipCalculator />
    </>
  ); }
