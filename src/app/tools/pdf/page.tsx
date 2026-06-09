import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/pdf");

export default function Page() {
  return (
    <>
      <PDFTools />
      <RelatedPrivacyGuides toolPath="/tools/pdf" />
    </>
  );
}
