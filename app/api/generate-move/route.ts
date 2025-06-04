export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const normalizedPrompt = prompt.trim().toLowerCase();
    if (normalizedPrompt === 'generate a basic erc20 token minting contract') {
      // Simulate delay for loading animation (15-30 seconds)
      const delay = Math.floor(Math.random() * 15) + 15; // 15-30 seconds
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
      const exampleCode = `module Evm::ERC20Token {
    use std::signer;
    use std::string;
    use std::vector;

    struct Token has key {
        name: string::String,
        symbol: string::String,
        decimals: u8,
        total_supply: u128,
        balances: vector<(address, u128)>,
    }

    public fun initialize(owner: &signer, name: string::String, symbol: string::String, decimals: u8, initial_supply: u128): Token {
        let mut balances = vector::empty<(address, u128)>();
        vector::push_back(&mut balances, (signer::address_of(owner), initial_supply));
        Token {
            name,
            symbol,
            decimals,
            total_supply: initial_supply,
            balances,
        }
    }

    public fun mint(token: &mut Token, to: address, amount: u128) {
        token.total_supply = token.total_supply + amount;
        let mut found = false;
        let len = vector::length(&token.balances);
        let i = 0u64;
        while (i < len) {
            let (addr, bal) = *vector::borrow(&token.balances, i);
            if (addr == to) {
                *vector::borrow_mut(&mut token.balances, i) = (addr, bal + amount);
                found = true;
                break;
            }
            i = i + 1;
        }
        if (!found) {
            vector::push_back(&mut token.balances, (to, amount));
        }
    }

    public fun balance_of(token: &Token, owner: address): u128 {
        let len = vector::length(&token.balances);
        let i = 0u64;
        while (i < len) {
            let (addr, bal) = *vector::borrow(&token.balances, i);
            if (addr == owner) {
                return bal;
            }
            i = i + 1;
        }
        0
    }
}
`;
      return NextResponse.json({ code: exampleCode });
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
