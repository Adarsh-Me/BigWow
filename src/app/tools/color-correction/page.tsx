import ColorCorrection from "@/components/ColorCorrection";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/color-correction");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Color Correction</h1>
      <ColorCorrection />
    </>
  );
}
