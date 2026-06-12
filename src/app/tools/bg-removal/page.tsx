import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";
import BgRemovalWrapper from "@/components/BgRemovalWrapper";

export const metadata = generateToolMetadata("/tools/bg-removal");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Free AI Background Remover — No Upload, No Account</h1>
      <BgRemovalWrapper />
      <RelatedPrivacyGuides toolPath="/tools/bg-removal" />
    </>
  );
}
