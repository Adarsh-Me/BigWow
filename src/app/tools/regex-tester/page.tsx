import { generateToolMetadata } from "@/lib/metadata";
import RegexTester from "@/components/RegexTester";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/regex-tester");

export default function Page() {
  return (
    <>
      <RegexTester />
      <RelatedPrivacyGuides toolPath="/tools/regex-tester" />
    </>
  );
}

