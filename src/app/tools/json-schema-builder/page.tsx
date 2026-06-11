import JsonSchemaBuilder from "@/components/JsonSchemaBuilder";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/json-schema-builder");
export default function Page() { return (
    <>
      <h1 className="sr-only">JSON Schema Builder</h1>
      <JsonSchemaBuilder />
    </>
  ); }
