import VideoFrameExtractor from "@/components/VideoFrameExtractor";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/video-frame-extractor");

export default function Page() {
  return <VideoFrameExtractor />;
}
