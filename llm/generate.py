import sys
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

def generate_contract(prompt: str, model, tokenizer) -> str:
    full_prompt = f"""Generate a Move smart contract based on the following description:\n\n{prompt}\n\nProvide only the Move code as output."""
    inputs = tokenizer(full_prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=512,
            temperature=0.7,
            top_p=0.95,
            do_sample=True
        )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    # Extract code block (after prompt)
    code_start = response.find("module ")
    if code_start != -1:
        return response[code_start:]
    return response

def main():
    prompt = sys.argv[1] if len(sys.argv) > 1 else ""
    if not prompt:
        print("No prompt provided", file=sys.stderr)
        sys.exit(1)
    try:
        model, tokenizer = load_model()
        code = generate_contract(prompt, model, tokenizer)
        print(code)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
