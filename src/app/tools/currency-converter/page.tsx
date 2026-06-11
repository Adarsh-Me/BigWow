import CurrencyConverter from "@/components/CurrencyConverter";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/currency-converter");

export default function CurrencyConverterPage() {
  return (
    <>
      <h1 className="sr-only">Currency Converter</h1>
      <CurrencyConverter />
      <RelatedPrivacyGuides toolPath="/tools/currency-converter" />
    </>
  );
}

