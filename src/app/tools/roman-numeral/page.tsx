import RomanNumeralConverter from "@/components/RomanNumeralConverter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/roman-numeral");
export default function Page() { return (
    <>
      <h1 className="sr-only">Roman Numeral</h1>
      <RomanNumeralConverter />
    </>
  ); }
