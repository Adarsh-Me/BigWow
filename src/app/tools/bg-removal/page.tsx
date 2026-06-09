import BgRemoval from "@/components/BgRemoval";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/bg-removal");

export default function Page() {
  return (
    <>
      <BgRemoval />
      <RelatedPrivacyGuides toolPath="/tools/bg-removal" />
    </>
  );
}
