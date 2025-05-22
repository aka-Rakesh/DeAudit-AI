import { AuditReport, Severity, VulnerabilityIssue } from "./types";

/**
 * Mock function to analyze Move smart contract code
 * This will be replaced with actual AI analysis in the future
 */
export async function analyzeMoveContract(code: string, fileName: string): Promise<AuditReport> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract contract name from filename or use default
  const contractName = fileName.replace('.move', '') || 'UnnamedContract';
  
  // Generate mock issues based on simple pattern matching
  const issues: VulnerabilityIssue[] = [];
  
  // Look for potential reentrancy patterns
  if (code.includes('public fun') && code.includes('acquires')) {
    issues.push({
      id: '1',
      title: 'Potential Reentrancy Vulnerability',
      description: 'Functions that acquire resources and have external calls may be vulnerable to reentrancy attacks.',
      severity: 'High',
      location: { start: { line: 25, column: 4 }, end: { line: 42, column: 5 } },
      codeSnippet: `public fun transfer(sender: &signer, recipient: address, amount: u64) acquires CoinStore {
    // External call before state changes
    let sender_addr = Signer::address_of(sender);
    let sender_balance = balance_of(sender_addr);
    
    // State changes after external call
    transfer_internal(sender_addr, recipient, amount);
}`,
      suggestedFix: `public fun transfer(sender: &signer, recipient: address, amount: u64) acquires CoinStore {
    // Get state first
    let sender_addr = Signer::address_of(sender);
    let sender_balance = balance_of(sender_addr);
    
    // Validate state
    assert!(sender_balance >= amount, EINSUFFICIENT_BALANCE);
    
    // Update state before external calls
    transfer_internal(sender_addr, recipient, amount);
    
    // External calls after state is updated
    // ...
}`
    });
  }
  
  // Check for unchecked arithmetic operations
  if (code.includes('+') || code.includes('-') || code.includes('*') || code.includes('/')) {
    if (!code.includes('assert!') || !code.includes('>=')) {
      issues.push({
        id: '2',
        title: 'Unchecked Arithmetic Operations',
        description: 'Arithmetic operations without proper bounds checking can lead to overflow/underflow vulnerabilities.',
        severity: 'Medium',
        location: { start: { line: 52, column: 8 }, end: { line: 52, column: 25 } },
        codeSnippet: `let new_balance = balance + amount;`,
        suggestedFix: `// Add bounds checking
assert!(amount <= MAX_U64 - balance, EOVERFLOW);
let new_balance = balance + amount;`
      });
    }
  }
  
  // Check for privileged operations without access control
  if (code.includes('public fun') && (code.includes('initialize') || code.includes('admin'))) {
    if (!code.includes('assert!(Signer::address_of(account) == @admin') && !code.includes('assert!(tx_context::sender(ctx) == @admin')) {
      issues.push({
        id: '3',
        title: 'Missing Access Control',
        description: 'Administrative functions should implement proper access control to restrict privileged operations.',
        severity: 'Critical',
        location: { start: { line: 78, column: 4 }, end: { line: 85, column: 5 } },
        codeSnippet: `public fun set_fee(new_fee: u64) {
    fee = new_fee;
}`,
        suggestedFix: `public fun set_fee(admin: &signer, new_fee: u64) {
    // Verify the caller is the admin
    assert!(Signer::address_of(admin) == @admin_address, ENOT_AUTHORIZED);
    fee = new_fee;
}`
      });
    }
  }
  
  // Add some common pattern issues that might appear in Move code
  issues.push({
    id: '4',
    title: 'Resource Not Properly Destroyed',
    description: 'Resources must be explicitly destroyed or stored before the end of a function.',
    severity: 'Medium',
    location: { start: { line: 105, column: 4 }, end: { line: 115, column: 5 } },
    codeSnippet: `fun process_resource(resource: Resource) {
    // Process the resource
    let value = resource.value;
    // Resource is neither stored nor destroyed at the end of the function
}`,
    suggestedFix: `fun process_resource(resource: Resource) {
    // Process the resource
    let value = resource.value;
    // Properly destroy the resource when done
    Resource::destroy(resource);
}`
  });
  
  // Generate mock summary based on issues found
  const score = calculateSecurityScore(issues);
  const summary = generateSummary(issues, score);
  
  return {
    contractName,
    issues,
    summary,
    score,
    timestamp: new Date().toISOString(),
  };
}

function calculateSecurityScore(issues: VulnerabilityIssue[]): number {
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