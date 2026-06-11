import HabitTracker from "@/components/HabitTracker";
import { generateToolMetadata } from "@/lib/metadata";
export const metadata = generateToolMetadata("/tools/habit-tracker");
export default function Page() { return (
    <>
      <h1 className="sr-only">Habit Tracker</h1>
      <HabitTracker />
    </>
  ); }
