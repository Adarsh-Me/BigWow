import MermaidViewer from "@/components/MermaidViewer";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/mermaid");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Mermaid Diagram Viewer</h1>
      <MermaidViewer />
    </>
  );
}
