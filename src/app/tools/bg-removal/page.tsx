import dynamic from "next/dynamic";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

const BgRemoval = dynamic(() => import("@/components/BgRemoval"), { ssr: false });

export const metadata = generateToolMetadata("/tools/bg-removal");

export default function Page() {
  return (
    <>
      <BgRemoval />
      <RelatedPrivacyGuides toolPath="/tools/bg-removal" />
    </>
  );
}
