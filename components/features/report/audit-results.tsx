"use client";

import { useState } from "react";
import { AuditReport, VulnerabilityIssue } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { VulnerabilityItem } from "@/components/features/report/vulnerability-item";
import { FileWarning, AlertTriangle, BarChart, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditResultsProps {
  report: AuditReport;
  onReset: () => void;
}

export function AuditResults({ report, onReset }: AuditResultsProps) {
  const [activeTab, setActiveTab] = useState("issues");
  
  const issuesBySeverity = {
    Critical: report.issues.filter(i => i.severity === 'Critical'),
    High: report.issues.filter(i => i.severity === 'High'),
    Medium: report.issues.filter(i => i.severity === 'Medium'),
    Low: report.issues.filter(i => i.severity === 'Low'),
    Info: report.issues.filter(i => i.severity === 'Info')
  };
  
  const severityColors = {
    Critical: "text-destructive bg-destructive/10 border-destructive/20",
    High: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    Medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    Low: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    Info: "text-gray-500 bg-gray-500/10 border-gray-500/20"
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 50) return "text-orange-500";
    return "text-destructive";
  };
  
  return (
    <section className="py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Audit Results</h2>
          <p className="text-muted-foreground">
            Contract: <span className="font-medium">{report.contractName}</span>
          </p>
        </div>
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          New Audit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-primary" />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{report.issues.length}</div>
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(issuesBySeverity).map(([severity, issues]) => (
                issues.length > 0 && (
                  <Badge key={severity} variant="outline" className={`${severityColors[severity as keyof typeof severityColors]}`}>
                    {severity}: {issues.length}
                  </Badge>
                )
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${getScoreColor(report.score)}`}>
              {report.score}/100
            </div>
            <Progress
              value={report.score}
              className="h-2 mt-4"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{report.summary}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="issues">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="code">Contract Code</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4 mt-6">
          {Object.entries(issuesBySeverity).map(([severity, issues]) => (
            issues.length > 0 && (
              <div key={severity} className="space-y-3">
                <h3 className="text-xl font-medium flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${
                    severity === 'Critical' ? 'bg-destructive' :
                    severity === 'High' ? 'bg-orange-500' :
                    severity === 'Medium' ? 'bg-yellow-500' :
                    severity === 'Low' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></span>
                  {severity} Severity ({issues.length})
                </h3>
                
                <div className="space-y-3">
                  {issues.map((issue) => (
                    <VulnerabilityItem key={issue.id} issue={issue} />
                  ))}
                </div>
              </div>
            )
          ))}
          
          {report.issues.length === 0 && (
            <div className="text-center p-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <FileWarning className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mt-4 text-xl font-medium">No Issues Found</h3>
              <p className="text-muted-foreground mt-2">
                Your contract appears to be free of common vulnerabilities.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="code" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <pre className="font-mono text-xs sm:text-sm overflow-auto p-4 bg-muted rounded-lg max-h-[500px]">
                <code className="language-move">
                  {`module DeAuditExample::basic_coin {
    use std::signer;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance::{Self, Balance};

    struct COIN has drop {}

    struct CoinStorage has key {
        id: UID,
        balance: Balance<COIN>,
    }

    public fun transfer(sender: &signer, recipient: address, amount: u64) acquires CoinStorage {
        // External call before state changes
        let sender_addr = signer::address_of(sender);
        let sender_balance = balance_of(sender_addr);
        
        // State changes after external call
        transfer_internal(sender_addr, recipient, amount);
    }

    fun balance_of(owner: address): u64 acquires CoinStorage {
        if (exists<CoinStorage>(owner)) {
            balance::value(&borrow_global<CoinStorage>(owner).balance)
        } else {
            0
        }
    }

    fun transfer_internal(from: address, to: address, amount: u64) acquires CoinStorage {
        let from_storage = borrow_global_mut<CoinStorage>(from);
        let to_storage = borrow_global_mut<CoinStorage>(to);
        
        let transfer_balance = balance::split(&mut from_storage.balance, amount);
        balance::join(&mut to_storage.balance, transfer_balance);
    }

    // Other functions...
    // ...
}`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {report.issues.map((issue) => (
                <div key={issue.id} className="space-y-2">
                  <h3 className="text-lg font-medium">{issue.title}</h3>
                  <p className="text-muted-foreground">{issue.description}</p>
                  
                  {issue.suggestedFix && (
                    <>
                      <h4 className="text-sm font-medium mt-3">Suggested Fix:</h4>
                      <pre className="font-mono text-xs sm:text-sm overflow-auto p-3 bg-muted rounded-lg">
                        <code>{issue.suggestedFix}</code>
                      </pre>
                    </>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium">General Best Practices</h3>
                <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Always validate inputs and enforce access control</li>
                  <li>Use explicit bounds checking for arithmetic operations</li>
                  <li>Follow the check-effects-interactions pattern to prevent reentrancy</li>
                  <li>Properly handle resources (create, use, destroy or store)</li>
                  <li>Keep functions small and focused on a single responsibility</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}