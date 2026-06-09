import HlsDownloader from "@/components/HlsDownloader";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/hls-downloader");

export default function Page() {
  return <HlsDownloader />;
}
