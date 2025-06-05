import { NextRequest, NextResponse } from 'next/server';
import { AuditReport } from '@/lib/types';
import { spawn } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { calculateSecurityScore } from '@/lib/audit';

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

    // Write file content to a temporary file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `audit_${Date.now()}.move`);
    fs.writeFileSync(tempFilePath, fileContent, 'utf8');

    // Call analyze.py with the temp file path as an argument
    const pythonCmd = 'python';
    const analyzePath = path.join(process.cwd(), 'llm', 'analyze.py');
    const args = [analyzePath, tempFilePath];
    const pythonProcess = spawn(pythonCmd, args, {
      cwd: path.join(process.cwd(), 'llm'),
      // shell: true, // Removed to fix Windows path with spaces issue
    });

    let output = '';
    let error = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    const exitCode: number = await new Promise((resolve) => {
      pythonProcess.on('close', resolve);
    });

    fs.unlinkSync(tempFilePath);

    if (exitCode !== 0) {
      // Log and return detailed error
      return NextResponse.json({
        error: 'Failed to analyze contract',
        exitCode,
        pythonCmd: `${pythonCmd} ${args.join(' ')}`,
        stderr: error,
        stdout: output,
      },
      { status: 500 });
    }

    let auditReport: any; // Use 'any' to allow contractCode
    try {
      auditReport = JSON.parse(output);
      // Always include contractCode in the response
      auditReport.contractCode = fileContent;
      // Ensure every issue has a codeSnippet (fallback to empty string) and a unique id
      auditReport.issues = (auditReport.issues || []).map((issue: any, idx: number) => ({
        ...issue,
        codeSnippet: issue.codeSnippet || "",
        id: issue.id || `${issue.title || 'issue'}-${idx}`,
      }));
    } catch (e) {
      // Log and return JSON parse error with details
      return NextResponse.json({
        error: 'Invalid JSON from analyzer',
        details: output,
        stderr: error,
        pythonCmd: `${pythonCmd} ${args.join(' ')}`,
        exception: e instanceof Error ? e.stack : util.inspect(e),
      },
      { status: 500 });
    }
    return NextResponse.json(auditReport);
  } catch (error: any) {
    // Log and return any caught exception with stack trace
    return NextResponse.json({
      error: 'Failed to process the audit request',
      exception: error?.stack || error?.toString() || error,
    },
    { status: 500 });
  }
}