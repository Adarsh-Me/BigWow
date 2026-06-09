import BaseVideoDownloader from "@/components/BaseVideoDownloader";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/reddit-downloader");

export default function Page() {
  return (
    <BaseVideoDownloader
      platform="reddit"
      title="Reddit Video Downloader"
      description="Download Reddit videos and GIFs from public posts. Supports v.redd.it hosted videos and external links. Paste the post URL and grab the video. Powered by Cobalt."
      placeholder="https://www.reddit.com/r/subreddit/comments/..."
      accentColor="orange"
    />
  );
}
