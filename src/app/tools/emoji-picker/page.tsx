import EmojiPicker from "@/components/EmojiPicker";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/emoji-picker");
export default function Page() { return (
    <>
      <h1 className="sr-only">Emoji Picker</h1>
      <EmojiPicker />
    </>
  ); }
