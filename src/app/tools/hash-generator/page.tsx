import { generateToolMetadata } from "@/lib/metadata";
import HashGenerator from "@/components/HashGenerator";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/hash-generator");

export default function HashGeneratorPage() {
  return (
    <>
      <h1 className="sr-only">Hash Generator</h1>
      <HashGenerator />
      <RelatedPrivacyGuides toolPath="/tools/hash-generator" />
    </>
  );
}

