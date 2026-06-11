import HttpStatusCodes from "@/components/HttpStatusCodes";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/http-status");
export default function Page() { return (
    <>
      <h1 className="sr-only">HTTP Status Codes</h1>
      <HttpStatusCodes />
    </>
  ); }
