export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { analyzeMoveContract } from '@/lib/audit';

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
    
    // Analyze the smart contract
    const auditReport = await analyzeMoveContract(fileContent, file.name);
    
    return NextResponse.json(auditReport);
  } catch (error) {
    console.error('Error processing audit request:', error);
    return NextResponse.json(
      { error: 'Failed to process the audit request' },
      { status: 500 }
    );
  }
}