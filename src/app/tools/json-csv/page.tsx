import JsonCsvConverter from "@/components/JsonCsvConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/json-csv");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">JSON to CSV</h1>
      <JsonCsvConverter />
    </>
  );
}
