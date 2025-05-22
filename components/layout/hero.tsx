import { Button } from "@/components/ui/button";
import { Shield, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-background to-background/80 py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#2a2a69_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            AI-Powered Audits for <span className="text-primary">Move</span> Smart Contracts
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            DeAudit AI helps you identify vulnerabilities in your Move smart contracts on the Sui blockchain, providing detailed reports and suggested fixes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="gap-1">
              Start Auditing <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}