import { generateToolMetadata } from "@/lib/metadata";
import UnixTimestampConverter from "@/components/UnixTimestampConverter";

export const metadata = generateToolMetadata("/tools/unix-timestamp");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Unix Timestamp Converter</h1>
      <UnixTimestampConverter />
    </>
  );
}
