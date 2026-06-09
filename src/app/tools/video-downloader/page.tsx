import BaseVideoDownloader from "@/components/BaseVideoDownloader";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/video-downloader");

export default function Page() {
  return (
    <BaseVideoDownloader
      platform="universal"
      title="Universal Media Downloader"
      description="Download videos and audio from YouTube, TikTok, Instagram, Twitter, Reddit, SoundCloud, and more. Paste any supported URL to get started."
      placeholder="https://www.youtube.com/watch?v=... or any supported URL"
      accentColor="indigo"
    />
  );
}
