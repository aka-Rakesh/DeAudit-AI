import sys
import requests

def generate_contract(prompt: str) -> str:
    full_prompt = f"""Generate a Move smart contract based on the following description:\n\n{prompt}\n\nProvide only the Move code as output."""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "codellama:7b",
            "prompt": full_prompt,
            "stream": False
        }
    )
    result = response.json()
    code = result.get('response', '')
    # Extract code block (after prompt)
    code_start = code.find("module ")
    if code_start != -1:
        return code[code_start:]
    return code

def main():
    prompt = sys.argv[1] if len(sys.argv) > 1 else ""
    if not prompt:
        print("No prompt provided", file=sys.stderr)
        sys.exit(1)
    try:
        code = generate_contract(prompt)
        print(code)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
