import ImageConverter from "@/components/ImageConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/image-converter");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Format Converter</h1>
      <ImageConverter />
    </>
  );
}
