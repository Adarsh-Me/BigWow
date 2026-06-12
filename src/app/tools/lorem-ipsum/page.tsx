import LoremIpsumGenerator from "@/components/LoremIpsumGenerator";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/lorem-ipsum");

export default function LoremIpsumPage() {
  return (
    <>
      <h1 className="sr-only">Free Lorem Ipsum Generator — Placeholder Text for Designers & Developers</h1>
      <LoremIpsumGenerator />
    </>
  );
}
