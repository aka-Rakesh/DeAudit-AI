export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface CodeLocation {
  line: number;
  column: number;
}

export interface CodeRange {
  start: CodeLocation;
  end: CodeLocation;
}

export interface VulnerabilityIssue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  location: CodeRange;
  codeSnippet: string;
  suggestedFix?: string;
}

export interface AuditReport {
  contractName: string;
  issues: VulnerabilityIssue[];
  summary: string;
  score: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  auditsCompleted: number;
  issuesFound: number;
  score: number;
  rank: number;
}