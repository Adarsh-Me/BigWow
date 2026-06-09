import TextEncryption from "@/components/TextEncryption";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/text-encryption");

export default function Page() {
  return (
    <>
      <TextEncryption />
      <RelatedPrivacyGuides toolPath="/tools/text-encryption" />
    </>
  );
}

