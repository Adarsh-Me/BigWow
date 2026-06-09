import BaseVideoDownloader from "@/components/BaseVideoDownloader";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/instagram-downloader");

export default function Page() {
  return (
    <BaseVideoDownloader
      platform="instagram"
      title="Instagram Downloader"
      description="Download Instagram Reels, videos, and stories from public accounts. Save content as MP4 or audio. Paste the post URL and download instantly. Powered by Cobalt."
      placeholder="https://www.instagram.com/reel/..."
      accentColor="pink"
    />
  );
}
