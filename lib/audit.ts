import { AuditReport, Severity, VulnerabilityIssue } from "./types";

/**
 * Mock function to analyze Move smart contract code
 * This will be replaced with actual AI analysis in the future
 */
export async function analyzeMoveContract(code: string, fileName: string): Promise<AuditReport> {
  throw new Error('analyzeMoveContract is now handled by the AI backend. Use /api/ai-audit endpoint.');
}

export function calculateSecurityScore(issues: VulnerabilityIssue[]): number {
  // Starting with a perfect score of 100
  let score = 100;
  
  // Deduct points based on severity
  for (const issue of issues) {
    switch (issue.severity) {
      case 'Critical':
        score -= 25;
        break;
      case 'High':
        score -= 15;
        break;
      case 'Medium':
        score -= 10;
        break;
      case 'Low':
        score -= 5;
        break;
      case 'Info':
        score -= 1;
        break;
    }
  }
  
  // Ensure score doesn't go below 0
  return Math.max(0, score);
}

function generateSummary(issues: VulnerabilityIssue[], score: number): string {
  const criticalCount = issues.filter(i => i.severity === 'Critical').length;
  const highCount = issues.filter(i => i.severity === 'High').length;
  const mediumCount = issues.filter(i => i.severity === 'Medium').length;
  const lowCount = issues.filter(i => i.severity === 'Low').length;
  const infoCount = issues.filter(i => i.severity === 'Info').length;
  
  let riskLevel = 'Low';
  if (criticalCount > 0 || highCount > 1) {
    riskLevel = 'High';
  } else if (highCount === 1 || mediumCount > 1) {
    riskLevel = 'Medium';
  }
  
  return `This contract has a security score of ${score}/100, indicating a ${riskLevel} risk level. 
We identified ${issues.length} issues: ${criticalCount} critical, ${highCount} high, ${mediumCount} medium, ${lowCount} low, and ${infoCount} informational.
Please address all critical and high severity issues before deploying to the mainnet.`;
}

/**
 * Generate mock leaderboard data
 */
export function getMockLeaderboardData() {
  return [
    {
      id: '1',
      username: 'cryptoAuditor',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      auditsCompleted: 152,
      issuesFound: 483,
      score: 98,
      rank: 1
    },
    {
      id: '2',
      username: 'moveExpert',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      auditsCompleted: 129,
      issuesFound: 356,
      score: 95,
      rank: 2
    },
    {
      id: '3',
      username: 'sui_defender',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      auditsCompleted: 114,
      issuesFound: 287,
      score: 91,
      rank: 3
    },
    {
      id: '4',
      username: 'blockchain_guru',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      auditsCompleted: 103,
      issuesFound: 245,
      score: 87,
      rank: 4
    },
    {
      id: '5',
      username: 'codeReviewer',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      auditsCompleted: 78,
      issuesFound: 201,
      score: 82,
      rank: 5
    }
  ];
}