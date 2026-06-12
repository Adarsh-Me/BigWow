import PDFTools from "@/components/PDFTools";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";
import { SUB_TOOLS } from "@/lib/sub-tools-config";

interface Props {
  searchParams: Promise<{ subTool?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { subTool } = await searchParams;
  return generateToolMetadata("/tools/pdf", subTool);
}

export default async function Page({ searchParams }: Props) {
  const { subTool } = await searchParams;

  let heading = "Free PDF Tools — Merge, Split, Compress PDF Without Uploading";
  if (subTool && SUB_TOOLS["/tools/pdf"]) {
    const sub = SUB_TOOLS["/tools/pdf"].find((s) => s.id === subTool);
    if (sub) {
      heading = sub.name;
    }
  }

  return (
    <>
      <h1 className="sr-only">{heading}</h1>
      <PDFTools />
      <RelatedPrivacyGuides toolPath="/tools/pdf" />
    </>
  );
}
