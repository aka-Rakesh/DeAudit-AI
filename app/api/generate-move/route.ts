import { NextRequest, NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    // Call Python script to generate Move contract
    const options = {
      mode: 'text' as const,
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: './llm',
      args: [prompt],
    };

    const result = await PythonShell.run('generate.py', options);
    const code = result && result.length > 0 ? result.join('\n') : '';
    if (!code) {
      return NextResponse.json({ error: 'No output from Python script' }, { status: 500 });
    }
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error generating Move contract:', error);
    return NextResponse.json({ error: 'Failed to generate contract' }, { status: 500 });
  }
}
