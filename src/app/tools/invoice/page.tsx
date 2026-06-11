import InvoiceGenerator from "@/components/InvoiceGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/invoice");

export default function InvoicePage() {
  return (
    <>
      <h1 className="sr-only">Invoice Generator</h1>
      <InvoiceGenerator />
      <RelatedPrivacyGuides toolPath="/tools/invoice" />
    </>
  );
}

