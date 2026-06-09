import BaseVideoDownloader from "@/components/BaseVideoDownloader";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/soundcloud-downloader");

export default function Page() {
  return (
    <BaseVideoDownloader
      platform="soundcloud"
      title="SoundCloud Downloader"
      description="Download SoundCloud tracks as MP3 audio files. Paste any public SoundCloud track URL and save the audio instantly to your device. Powered by Cobalt."
      placeholder="https://soundcloud.com/artist/track-name"
      accentColor="orange"
    />
  );
}
