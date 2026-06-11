import VideoEditor from "@/components/VideoEditor";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/video");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Video Editor</h1>
      <VideoEditor />
    </>
  );
}
