import BaseVideoDownloader from "@/components/BaseVideoDownloader";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/youtube-downloader");

export default function Page() {
  return (
    <BaseVideoDownloader
      platform="youtube"
      title="YouTube Downloader"
      description="Download YouTube videos and audio for free. Supports 1080p, 720p, 480p quality and audio-only MP3 extraction. Powered by the open-source Cobalt engine."
      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      accentColor="red"
    />
  );
}
