import ImageResizer from "@/components/ImageResizer";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/image-resizer");
export default function Page() { return (
    <>
      <h1 className="sr-only">Free Image Resizer Online — Resize Images Without Uploading</h1>
      <ImageResizer />
    </>
  ); }
