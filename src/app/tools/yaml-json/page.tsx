import YamlJsonConverter from "@/components/YamlJsonConverter";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/yaml-json");
export default function Page() { return (
    <>
      <h1 className="sr-only">YAML ↔ JSON</h1>
      <YamlJsonConverter />
    </>
  ); }
