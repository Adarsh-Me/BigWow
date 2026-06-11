import { generateToolMetadata } from "@/lib/metadata";
import UUIDGenerator from "@/components/UUIDGenerator";

export const metadata = generateToolMetadata("/tools/uuid-generator");

export default function UUIDGeneratorPage() {
  return (
    <>
      <h1 className="sr-only">UUID Generator</h1>
      <UUIDGenerator />
    </>
  );
}
