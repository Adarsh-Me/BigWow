import { generateToolMetadata } from "@/lib/metadata";
import JWTDecoder from "@/components/JWTDecoder";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/jwt-decoder");

export default function JWTDecoderPage() {
  return (
    <>
      <h1 className="sr-only">JWT Decoder</h1>
      <JWTDecoder />
      <RelatedPrivacyGuides toolPath="/tools/jwt-decoder" />
    </>
  );
}
