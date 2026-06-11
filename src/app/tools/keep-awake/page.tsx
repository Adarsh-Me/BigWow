import KeepAwake from "@/components/KeepAwake";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/keep-awake");
export default function Page() { return (
    <>
      <h1 className="sr-only">Keep Awake</h1>
      <KeepAwake />
    </>
  ); }
