import PasswordGenerator from "@/components/PasswordGenerator";
import { generateToolMetadata } from "@/lib/metadata";
import RelatedPrivacyGuides from "@/components/RelatedPrivacyGuides";

export const metadata = generateToolMetadata("/tools/password-generator");

export default function PasswordGeneratorPage() {
  return (
    <>
      <h1 className="sr-only">Free Password Generator Online — Secure, Private, No Account</h1>
      <PasswordGenerator />
      <RelatedPrivacyGuides toolPath="/tools/password-generator" />
    </>
  );
}

