import { NextRequest, NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';
import { AuditReport } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!file.name.endsWith('.move')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only .move files are accepted' },
        { status: 400 }
      );
    }
    
    // Read the file content
    const fileContent = await file.text();
    
    // Run Python script for AI analysis
    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'], // unbuffered output
      scriptPath: './llm',
    };
    
    const result = await new Promise<AuditReport>((resolve, reject) => {
      let jsonOutput = '';
      
      PythonShell.runString(fileContent, options, (err, output) => {
        if (err) reject(err);
        
        if (output && output.length > 0) {
          try {
            // Combine all output lines and parse as JSON
            jsonOutput = output.join('');
            const result = JSON.parse(jsonOutput);
            
            // Calculate security score based on issues
            const score = calculateSecurityScore(result.issues);
            
            resolve({
              contractName: file.name.replace('.move', ''),
              issues: result.issues,
              summary: result.summary,
              score,
              timestamp: new Date().toISOString()
            });
          } catch (e) {
            reject(new Error(`Failed to parse Python output: ${jsonOutput}`));
          }
        } else {
          reject(new Error('No output from Python script'));
        }
      });
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing AI audit request:', error);
    return NextResponse.json(
      { error: 'Failed to process the audit request' },
      { status: 500 }
    );
  }
}

function calculateSecurityScore(issues: any[]): number {
  let score = 100;
  
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
    }
  }
  
  return Math.max(0, score);
}