"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0);
  const steps = [
    "Parsing smart contract...",
    "Analyzing code structure...",
    "Identifying security patterns...",
    "Checking for vulnerabilities...",
    "Generating recommendations...",
    "Finalizing report..."
  ];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  return (
    <Card className="border-dashed">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin"
                style={{ animationDuration: '1.5s' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-medium mb-1">Analyzing Contract</h3>
          <p className="text-muted-foreground mb-6">{steps[currentStep]}</p>
          
          <div className="w-full max-w-md mb-2">
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        </div>
      </CardContent>
    </Card>
  );
}