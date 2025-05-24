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
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: './llm',
      args: [prompt],
    };

    const result = await new Promise<string>((resolve, reject) => {
      PythonShell.run('generate.py', options, (err, output) => {
        if (err) reject(err);
        if (output && output.length > 0) {
          resolve(output.join('\n'));
        } else {
          reject(new Error('No output from Python script'));
        }
      });
    });

    return NextResponse.json({ code: result });
  } catch (error) {
    console.error('Error generating Move contract:', error);
    return NextResponse.json({ error: 'Failed to generate contract' }, { status: 500 });
  }
}
