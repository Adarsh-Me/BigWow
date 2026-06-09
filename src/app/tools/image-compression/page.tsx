import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/image-compression");

export default function Page() {
  return (
    <>
      <ImageCompression />
      <RelatedPrivacyGuides toolPath="/tools/image-compression" />
    </>
  );
}
