import YoutubeThumbnail from "@/components/YoutubeThumbnail";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/youtube-thumbnail");

export default function Page() {
  return <YoutubeThumbnail />;
}
