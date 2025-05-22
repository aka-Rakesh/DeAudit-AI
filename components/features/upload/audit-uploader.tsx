"use client";

import { useState } from "react";
import { Upload, FileUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuditReport } from "@/lib/types";
import { AuditResults } from "@/components/features/report/audit-results";
import { LoadingAnimation } from "@/components/features/upload/loading-animation";
import { useToast } from "@/hooks/use-toast";

export function AuditUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.move')) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .move file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.move')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .move file",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a .move file to audit",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAuditReport(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ai-audit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to audit contract');
      }

      const data = await response.json();
      setAuditReport(data);
      
      toast({
        title: "AI Audit completed",
        description: `Found ${data.issues.length} issues in your contract`,
      });
    } catch (error) {
      console.error('Error during audit:', error);
      toast({
        title: "Audit failed",
        description: "There was an error processing your contract",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAudit = () => {
    setFile(null);
    setAuditReport(null);
  };

  if (auditReport) {
    return <AuditResults report={auditReport} onReset={resetAudit} />;
  }

  return (
    <section id="audit" className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">AI-Powered Smart Contract Audit</h2>
        <p className="text-muted-foreground mt-2">
          Upload your Move smart contract for an instant AI security analysis
        </p>
      </div>

      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                Drag and drop your contract file
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                or click to browse (.move files only)
              </p>
              
              <div className="space-y-4 w-full max-w-xs">
                <div className="relative">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".move"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="w-full"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                </div>
                
                {file && (
                  <div className="bg-muted p-3 rounded-lg text-sm flex items-center">
                    <div className="truncate flex-1">{file.name}</div>
                    <Button variant="secondary" onClick={handleSubmit} className="ml-2">
                      Run AI Audit
                    </Button>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Your code is analyzed securely and never leaves your machine
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}