import FakeDataGenerator from "@/components/FakeDataGenerator";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/fake-data");
export default function Page() { return (
    <>
      <h1 className="sr-only">Fake Data Generator</h1>
      <FakeDataGenerator />
    </>
  ); }
