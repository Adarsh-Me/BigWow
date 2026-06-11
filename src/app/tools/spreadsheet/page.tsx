import SpreadsheetViewer from "@/components/SpreadsheetViewer";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/spreadsheet");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">CSV/Excel Viewer</h1>
      <SpreadsheetViewer />
      <RelatedPrivacyGuides toolPath="/tools/spreadsheet" />
    </>
  );
}

