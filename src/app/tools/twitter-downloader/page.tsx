import BaseVideoDownloader from "@/components/BaseVideoDownloader";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/twitter-downloader");

export default function Page() {
  return (
    <BaseVideoDownloader
      platform="twitter"
      title="Twitter / X Video Downloader"
      description="Download videos from Twitter (X) tweets. Paste any public tweet URL and save the embedded video at the best available quality. No login required. Powered by Cobalt."
      placeholder="https://twitter.com/user/status/... or https://x.com/user/status/..."
      accentColor="slate"
    />
  );
}
