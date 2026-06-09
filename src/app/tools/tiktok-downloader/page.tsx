import BaseVideoDownloader from "@/components/BaseVideoDownloader";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/tiktok-downloader");

export default function Page() {
  return (
    <BaseVideoDownloader
      platform="tiktok"
      title="TikTok Downloader"
      description="Download TikTok videos without watermark. Save TikTok clips in full quality directly to your device. Optionally remove the TikTok watermark. Powered by Cobalt."
      placeholder="https://www.tiktok.com/@username/video/..."
      accentColor="cyan"
    />
  );
}
