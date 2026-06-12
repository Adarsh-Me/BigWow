import ImageConverter from "@/components/ImageConverter";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/image-converter");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Free Image Converter Online — HEIC to JPG, WebP to JPG, PNG to JPG</h1>
      <ImageConverter />
    </>
  );
}
