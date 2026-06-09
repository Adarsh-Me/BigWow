import InvoiceGenerator from "@/components/InvoiceGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/invoice");

export default function InvoicePage() {
  return (
    <>
      <InvoiceGenerator />
      <RelatedPrivacyGuides toolPath="/tools/invoice" />
    </>
  );
}

