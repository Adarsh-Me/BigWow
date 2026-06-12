import ImageCompression from "@/components/ImageCompression";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/image-compression");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Free Image Compressor Online — Compress Images Without Uploading</h1>
      <ImageCompression />
      <RelatedPrivacyGuides toolPath="/tools/image-compression" />
    </>
  );
}
