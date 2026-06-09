import UnitConverter from "@/components/UnitConverter";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/unit-converter");

export default function UnitConverterPage() {
  return (
    <>
      <UnitConverter />
      <RelatedPrivacyGuides toolPath="/tools/unit-converter" />
    </>
  );
}

