import ModelComparison from "@/components/ModelComparison";
import { generateToolMetadata } from "@/lib/metadata";

export const metadata = generateToolMetadata("/tools/model-comparison");

export default function Page() {
  return (
    <>
      <h1 className="sr-only">Model Comparison</h1>
      <ModelComparison />
    </>
  );
}
