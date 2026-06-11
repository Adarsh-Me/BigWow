import AspectRatioCalculator from "@/components/AspectRatioCalculator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/aspect-ratio");
export default function Page() { return (
    <>
      <h1 className="sr-only">Aspect Ratio Calculator</h1>
      <AspectRatioCalculator />
    </>
  ); }
