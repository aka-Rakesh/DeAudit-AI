"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function GenerateMove() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setIsLoading(true);
    setError("");
    setCode("");
    try {
      const res = await fetch("/api/generate-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setCode(data.code);
      } else {
        setError(data.error || "Failed to generate contract");
      }
    } catch (e) {
      setError("Failed to generate contract");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="generate-move" className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Generate Move Contract</h2>
        <p className="text-muted-foreground mt-2">
          Describe what you want and let AI generate a Move smart contract for you
        </p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-4">
          <Textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. A basic fungible token contract with mint and transfer functions"
            rows={4}
            className="resize-none"
          />
          <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
            {isLoading ? "Generating..." : "Generate Contract"}
          </Button>
          {error && <div className="text-destructive text-sm">{error}</div>}
          {code && (
            <pre className="bg-muted p-4 rounded-lg mt-4 overflow-auto text-sm">
              <code>{code}</code>
            </pre>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
