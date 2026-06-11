import { generateToolMetadata } from "@/lib/metadata";
import QRScanner from "@/components/QRScanner";

export const metadata = generateToolMetadata("/tools/qr-scanner");

export default function QRScannerPage() {
  return (
    <>
      <h1 className="sr-only">QR Code Scanner</h1>
      <QRScanner />
    </>
  );
}
