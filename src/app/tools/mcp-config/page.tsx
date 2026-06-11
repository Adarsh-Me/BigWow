import McpConfigGenerator from "@/components/McpConfigGenerator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/mcp-config");
export default function Page() { return (
    <>
      <h1 className="sr-only">MCP Config Generator</h1>
      <McpConfigGenerator />
    </>
  ); }
