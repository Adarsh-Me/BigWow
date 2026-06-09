import ZipTool from "@/components/ZipTools";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/zip");

export default function Page() {
  return (
    <>
      <ZipTool />
      <RelatedPrivacyGuides toolPath="/tools/zip" />
    </>
  );
}

