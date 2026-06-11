import ScreenRecorder from "@/components/ScreenRecorder";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/screen-recorder");
export default function Page() { return (
    <>
      <h1 className="sr-only">Screen Recorder</h1>
      <ScreenRecorder />
    </>
  ); }
