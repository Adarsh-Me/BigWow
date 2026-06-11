import Stopwatch from "@/components/Stopwatch";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/stopwatch");
export default function Page() { return (
    <>
      <h1 className="sr-only">Stopwatch</h1>
      <Stopwatch />
    </>
  ); }
