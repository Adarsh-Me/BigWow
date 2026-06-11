import ZipTool from "@/components/ZipTools";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";
import { SUB_TOOLS } from "@/lib/sub-tools-config";

interface Props {
  searchParams: Promise<{ subTool?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { subTool } = await searchParams;
  return generateToolMetadata("/tools/zip", subTool);
}

export default async function Page({ searchParams }: Props) {
  const { subTool } = await searchParams;

  let heading = "ZIP Tools";
  if (subTool && SUB_TOOLS["/tools/zip"]) {
    const sub = SUB_TOOLS["/tools/zip"].find((s) => s.id === subTool);
    if (sub) {
      heading = sub.name;
    }
  }

  return (
    <>
      <h1 className="sr-only">{heading}</h1>
      <ZipTool />
      <RelatedPrivacyGuides toolPath="/tools/zip" />
    </>
  );
}
