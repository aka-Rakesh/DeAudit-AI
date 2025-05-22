import sys
import json
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

def load_model():
    model_name = "deepseek-ai/deepseek-coder-1.3b-base"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    return model, tokenizer

def analyze_contract(code: str, model, tokenizer) -> dict:
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

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=1024,
            temperature=0.7,
            top_p=0.95,
            do_sample=True
        )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract JSON from response
    try:
        start_idx = response.find('{')
        end_idx = response.rfind('}') + 1
        json_str = response[start_idx:end_idx]
        return json.loads(json_str)
    except Exception as e:
        return {
            "error": "Failed to parse model output",
            "summary": "Analysis failed",
            "issues": []
        }

def main():
    # Read contract code from stdin
    contract_code = sys.stdin.read()
    
    try:
        # Load the model
        model, tokenizer = load_model()
        
        # Analyze the contract
        result = analyze_contract(contract_code, model, tokenizer)
        
        # Print JSON output
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_response = {
            "error": str(e),
            "summary": "Analysis failed",
            "issues": []
        }
        print(json.dumps(error_response, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()