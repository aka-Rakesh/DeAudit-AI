import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Progress from "@radix-ui/react-progress";

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-12">
      <section className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Radix Collapsible</h2>
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger className="px-4 py-2 bg-blue-500 text-white rounded mb-2">
            {open ? "Hide" : "Show"} Content
          </Collapsible.Trigger>
          <Collapsible.Content className="p-4 border rounded bg-gray-50 mt-2">
            This is collapsible content.
          </Collapsible.Content>
        </Collapsible.Root>
      </section>
      <section className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Radix Progress</h2>
        <Progress.Root value={progress} className="relative h-4 w-full overflow-hidden rounded bg-gray-200">
          <Progress.Indicator
            className="h-full bg-blue-500 transition-all"
            style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
          />
        </Progress.Root>
        <div className="mt-2 text-center">{progress}%</div>
      </section>
    </main>
  );
}
