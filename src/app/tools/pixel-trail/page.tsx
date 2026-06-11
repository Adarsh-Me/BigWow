import GooeyDemo from "@/components/ui/gooey-demo";

export default function Page() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <h1 className="sr-only">Pixel Trail</h1>
      <div className="w-full max-w-5xl h-[70vh]">
        <GooeyDemo />
      </div>
    </div>
  );
}
