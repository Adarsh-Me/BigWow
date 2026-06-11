import { generateToolMetadata } from "@/lib/metadata";
import NumberBaseConverter from "@/components/NumberBaseConverter";

export const metadata = generateToolMetadata("/tools/number-base-converter");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Number Base Converter</h1>
      <NumberBaseConverter />
    </>
  );
}
