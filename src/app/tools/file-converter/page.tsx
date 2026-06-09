import FileConverter from "@/components/FileConverter";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/file-converter");

export default function Page() {
  return (
    <>
      <FileConverter />
      <RelatedPrivacyGuides toolPath="/tools/file-converter" />
    </>
  );
}

