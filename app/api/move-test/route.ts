import { NextRequest, NextResponse } from 'next/server';
import { exec as execCb } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const exec = promisify(execCb);

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'No code provided.' }, { status: 400 });
    }

    // Save code to a temporary file
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const filePath = path.join(tempDir, `snippet_${Date.now()}.move`);
    fs.writeFileSync(filePath, code);

    // Run Move CLI (replace with actual command as needed)
    const command = `move check ${filePath}`;
    try {
      const { stdout } = await exec(command);
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, output: stdout });
    } catch (error: any) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: false, output: error.stderr || error.stdout || error.message });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
