import { useWalletStore } from '@/lib/store/wallet';
import { useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Utility to shorten address (0x123...abcd)
function shortenAddress(addr: string) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

export function WalletConnect() {
  const { address, setAddress } = useWalletStore();
  const account = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  const { toast } = useToast();

  useEffect(() => {
    if (account?.address) {
      setAddress(account.address);
      // Upsert profile on wallet connect (ignore errors)
      fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: account.address }),
      }).catch(() => {});
    } else {
      setAddress(null);
    }
  }, [account, setAddress]);

  // Helper to convert string to Uint8Array
  function strToUint8Array(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  // Auth: sign a message to prove wallet ownership
  const handleAuth = async () => {
    if (!account) return;
    try {
      const message = 'Sign to authenticate with DeAudit AI';
      const { signature } = await signPersonalMessage({ message: strToUint8Array(message) });
      toast({
        title: 'Authentication successful',
        description: `Address: ${account.address}\nSignature: ${signature}`,
      });
    } catch (e) {
      toast({
        title: 'Authentication failed',
        description: 'User rejected or error occurred',
        variant: 'destructive',
      });
    }
  };

  // Only show dropdown if connected (use Zustand address)
  if (!address) {
    return (
      <div className="flex items-center h-16">
        <ConnectButton className="w-auto" />
      </div>
    );
  }

  return (
    <div className="flex items-center h-16">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 w-auto" type="button">
            {shortenAddress(address)}
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleAuth}>
            Authenticate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.location.reload()}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
