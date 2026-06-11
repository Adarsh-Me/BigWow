import SkillBuilder from "@/components/SkillBuilder";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/skill-builder");
export default function Page() { return (
    <>
      <h1 className="sr-only">Skill / Agent Builder</h1>
      <SkillBuilder />
    </>
  ); }
