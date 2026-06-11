import JsonToTs from "@/components/JsonToTs";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/json-to-ts");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">JSON → TypeScript</h1>
      <JsonToTs />
    </>
  );
}
