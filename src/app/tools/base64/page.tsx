import Base64Converter from "@/components/Base64Converter";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/base64");

export default function Page() {
  return (
    <>
      <Base64Converter />
      <RelatedPrivacyGuides toolPath="/tools/base64" />
    </>
  );
}

