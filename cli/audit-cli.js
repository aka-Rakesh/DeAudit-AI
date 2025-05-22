#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');

// Mock implementation of the audit functionality
// In a real implementation, this would call the same audit logic as the web app
async function analyzeMoveContract(code, fileName) {
  // This is a simplified version of the function in lib/audit.ts
  // In a real app, both would use the same underlying logic
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const contractName = fileName.replace('.move', '') || 'UnnamedContract';
  
  // Generate mock issues based on simple pattern matching
  const issues = [];
  
  // Look for potential reentrancy patterns
  if (code.includes('public fun') && code.includes('acquires')) {
    issues.push({
      id: '1',
      title: 'Potential Reentrancy Vulnerability',
      description: 'Functions that acquire resources and have external calls may be vulnerable to reentrancy attacks.',
      severity: 'High',
      location: { start: { line: 25, column: 4 }, end: { line: 42, column: 5 } },
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
      });
    }
  }
  
  // Calculate security score
  const score = calculateSecurityScore(issues);
  
  return {
    contractName,
    issues,
    summary: generateSummary(issues, score),
    score,
    timestamp: new Date().toISOString(),
  };
}

function calculateSecurityScore(issues) {
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

function generateSummary(issues, score) {
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

const program = new Command();

program
  .name('deaudit-cli')
  .description('CLI tool for auditing Move smart contracts')
  .version('0.1.0');

program
  .argument('<filepath>', 'Path to the Move contract file')
  .option('-o, --output <filepath>', 'Output report to a file')
  .action(async (filepath, options) => {
    try {
      // Check if file exists
      if (!fs.existsSync(filepath)) {
        console.error(chalk.red(`Error: File not found: ${filepath}`));
        process.exit(1);
      }
      
      // Check if file is a Move file
      if (!filepath.endsWith('.move')) {
        console.error(chalk.red(`Error: File must be a .move file`));
        process.exit(1);
      }
      
      const fileName = path.basename(filepath);
      const fileContent = fs.readFileSync(filepath, 'utf8');
      
      const spinner = ora('Analyzing smart contract...').start();
      
      try {
        const report = await analyzeMoveContract(fileContent, fileName);
        spinner.succeed(chalk.green('Analysis complete!'));
        
        console.log('\n' + chalk.bold('📊 AUDIT REPORT') + '\n');
        console.log(chalk.bold('Contract: ') + report.contractName);
        console.log(chalk.bold('Security Score: ') + getScoreColor(report.score) + report.score + '/100' + chalk.reset);
        console.log(chalk.bold('Issues Found: ') + report.issues.length);
        console.log('\n' + chalk.bold('📝 SUMMARY') + '\n');
        console.log(report.summary);
        
        if (report.issues.length > 0) {
          console.log('\n' + chalk.bold('🔍 VULNERABILITIES') + '\n');
          
          const severityOrder = ['Critical', 'High', 'Medium', 'Low', 'Info'];
          
          for (const severity of severityOrder) {
            const issuesOfSeverity = report.issues.filter(i => i.severity === severity);
            
            if (issuesOfSeverity.length > 0) {
              console.log(getSeverityColor(severity) + chalk.bold(`\n${severity} Severity Issues (${issuesOfSeverity.length})`) + chalk.reset);
              
              issuesOfSeverity.forEach((issue, index) => {
                console.log(`\n${index + 1}. ${chalk.bold(issue.title)}`);
                console.log(`   ${issue.description}`);
                console.log(`   ${chalk.dim(`Location: Line ${issue.location.start.line}-${issue.location.end.line}`)}`);
              });
            }
          }
        }
        
        // Save report to file if output option is provided
        if (options.output) {
          fs.writeFileSync(options.output, JSON.stringify(report, null, 2));
          console.log(chalk.green(`\nReport saved to ${options.output}`));
        }
        
      } catch (error) {
        spinner.fail(chalk.red('Analysis failed'));
        console.error(error);
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

function getScoreColor(score) {
  if (score >= 90) return chalk.green;
  if (score >= 70) return chalk.yellow;
  if (score >= 50) return chalk.hex('#FFA500'); // Orange
  return chalk.red;
}

function getSeverityColor(severity) {
  switch (severity) {
    case 'Critical': return chalk.red;
    case 'High': return chalk.hex('#FFA500'); // Orange
    case 'Medium': return chalk.yellow;
    case 'Low': return chalk.blue;
    case 'Info': return chalk.gray;
    default: return chalk.white;
  }
}

program.parse();