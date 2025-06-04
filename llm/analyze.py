import sys
import json
import requests

def analyze_contract(code: str) -> dict:
    prompt = f"""Analyze the following Move smart contract for security vulnerabilities:

{code}

Provide a detailed security analysis in JSON format with the following structure:
{{
    "summary": "Brief overview of findings",
    "issues": [
        {{
            "title": "Issue name",
            "severity": "Critical|High|Medium|Low",
            "description": "Detailed explanation",
            "suggestedFix": "Code example showing how to fix"
        }}
    ]
}}

Focus on:
1. Reentrancy vulnerabilities
2. Access control issues
3. Resource handling
4. Arithmetic operations
5. Move-specific patterns

Response:"""
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
    import re
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
    code = sys.argv[1] if len(sys.argv) > 1 else ""
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