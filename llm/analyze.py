import sys
import json
import requests
import os
import re

def analyze_contract(code: str) -> dict:
    prompt = f"""Analyze the following Move smart contract for security vulnerabilities and adherence to best practices, referencing the official Move documentation and community guidelines:

{code}

Provide a comprehensive security analysis in JSON format with the following structure:

{{
  "summary": "Brief overview of findings",
  "issues": [
    {{
      "title": "Issue name",
      "severity": "Critical|High|Medium|Low",
      "description": "Detailed explanation referencing Move best practices",
      "codeSnippet": "Relevant code lines from the contract that demonstrate the issue.",
      "suggestedFix": "A code block showing the fix, not just a description."
    }}
  ]
}}

Focus on the following areas:

- **Access Control**: Ensure that functions have appropriate access modifiers and that only authorized entities can invoke sensitive operations.

- **Resource Management**: Verify correct handling of resources, ensuring proper creation, transfer, and destruction without leaks or duplication.

- **Arithmetic Operations**: Check for potential overflows or underflows in arithmetic computations.

- **Reentrancy Vulnerabilities**: Identify any patterns that could lead to reentrant calls, especially in functions that modify state.

- **Object Ownership and Transfers**: Confirm that object ownership is correctly managed and that transfers adhere to Move's ownership model.

- **Use of Unsafe Functions**: Detect usage of functions or patterns that are discouraged or known to be unsafe in the Move ecosystem.

- **Compliance with Move Conventions**: Assess adherence to naming conventions, module organization, and other community standards.

- **Formal Verification Annotations**: Check for the presence and correctness of specifications intended for formal verification tools like Move Prover.

- **Event Emissions**: Ensure that events are emitted appropriately to signal important state changes.

- **Gas Optimization**: Identify any inefficient patterns that could lead to unnecessary gas consumption.

For each identified issue, include a relevant code snippet and provide a suggested fix as a code block.
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "codellama:7b",
            "prompt": prompt,
            "stream": False
        }
    )
    result = response.json()
    print("RAW OLLAMA RESPONSE:", result, file=sys.stderr)
    # Extract JSON code block from response
    response_text = result.get('response', '{}')
    match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
    if match:
        json_str = match.group(1)
    else:
        # fallback: try to find any JSON-like object
        match = re.search(r'({[\s\S]*})', response_text)
        json_str = match.group(1) if match else '{}'
    try:
        analysis = json.loads(json_str)
    except Exception:
        analysis = {"summary": "Could not parse response", "issues": []}
    return analysis

def main():
    if len(sys.argv) > 1:
        # If a file path is provided, read the file
        file_path = sys.argv[1]
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                code = f.read()
        else:
            code = sys.argv[1]
    else:
        code = ""
    if not code:
        print("No code provided", file=sys.stderr)
        sys.exit(1)
    try:
        analysis = analyze_contract(code)
        print(json.dumps(analysis, indent=2))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()