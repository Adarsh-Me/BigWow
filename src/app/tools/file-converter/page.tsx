import FileConverter from "@/components/FileConverter";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/file-converter");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">File Converter</h1>
      <FileConverter />
      <RelatedPrivacyGuides toolPath="/tools/file-converter" />
    </>
  );
}

