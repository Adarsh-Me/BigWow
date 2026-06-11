import { generateToolMetadata } from "@/lib/metadata";
import RegexTester from "@/components/RegexTester";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/regex-tester");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Regex Tester</h1>
      <RegexTester />
      <RelatedPrivacyGuides toolPath="/tools/regex-tester" />
    </>
  );
}

