import QRCodeGenerator from "@/components/QRCodeGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/qr-generator");

export default function QRGeneratorPage() {
  return (
    <>
      <h1 className="sr-only">QR Code Generator</h1>
      <QRCodeGenerator />
      <RelatedPrivacyGuides toolPath="/tools/qr-generator" />
    </>
  );
}

