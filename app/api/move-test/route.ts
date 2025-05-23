import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

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
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        // Clean up temp file
        fs.unlinkSync(filePath);
        if (error) {
          resolve(NextResponse.json({ success: false, output: stderr || stdout }));
        } else {
          resolve(NextResponse.json({ success: true, output: stdout }));
        }
      });
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
