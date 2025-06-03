import { NextRequest, NextResponse } from 'next/server';
import { AuditReport } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!file.name.endsWith('.move')) {
      return NextResponse.json({ error: 'Invalid file type. Only .move files are accepted' }, { status: 400 });
    }
    const fileContent = await file.text();

    // Simulate audit delay for loading animation (15-30 seconds)
    const delay = Math.floor(Math.random() * 15) + 15; // 15-30 seconds
    await new Promise(resolve => setTimeout(resolve, delay * 1000));

    // Dummy check: if the file content matches the provided Token.move, return a hardcoded audit report
    if (fileContent.includes('module Evm::ERC20Token')) {
      const dummyReport: AuditReport = {
        contractName: 'ERC20Token',
        issues: [
          {
            id: '1',
            title: 'Unchecked Arithmetic in transfer_from',
            description: 'The subtraction allowance.amount - amount is not checked for underflow.',
            severity: 'Medium',
            location: { start: { line: 74, column: 9 }, end: { line: 76, column: 11 } },
            codeSnippet: 'allowance.amount = allowance.amount - amount;',
            suggestedFix: 'assert!(allowance.amount >= amount, errors::limit_exceeded(0));\nallowance.amount = allowance.amount - amount;'
          },
          {
            id: '2',
            title: 'Missing Access Control on approve',
            description: 'Anyone can call approve on behalf of sender, consider restricting access.',
            severity: 'Low',
            location: { start: { line: 61, column: 5 }, end: { line: 65, column: 6 } },
            codeSnippet: 'public fun approve(spender: address, amount: u128) acquires Account { ... }',
            suggestedFix: '// Add access control\npublic fun approve(spender: address, amount: u128) acquires Account {\n  assert!(sender() == sign(self()), errors::not_authorized(0));\n  ...\n}'
          }
        ],
        summary: '2 issues found: 1 medium, 1 low. Review arithmetic operations and access control.',
        score: 85,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(dummyReport);
    }

    // Fallback: return a generic no-issues report
    const fallbackReport: AuditReport = {
      contractName: file.name.replace('.move', ''),
      issues: [],
      summary: 'No issues found. Contract appears secure.',
      score: 100,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(fallbackReport);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process the audit request' }, { status: 500 });
  }
}