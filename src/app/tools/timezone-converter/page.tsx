import { generateToolMetadata } from "@/lib/metadata";
import TimeZoneConverter from "@/components/TimeZoneConverter";

export const metadata = generateToolMetadata("/tools/timezone-converter");

export default function TimeZoneConverterPage() {
  return (
    <>
      <h1 className="sr-only">Time Zone Converter</h1>
      <TimeZoneConverter />
    </>
  );
}
