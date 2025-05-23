import { useWalletStore } from '@/lib/store/wallet';
import { useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { useToast } from '@/hooks/use-toast';

export function WalletConnect() {
  const { address, setAddress } = useWalletStore();
  const account = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  const { toast } = useToast();

  useEffect(() => {
    if (account?.address) {
      setAddress(account.address);
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
      // Here you would send { address: account.address, signature } to your backend for verification
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

  return (
    <div className="flex flex-col items-center gap-2">
      <ConnectButton />
      {address && (
        <>
          <div className="text-xs text-muted-foreground">{address}</div>
          <button className="px-3 py-1 bg-primary text-white rounded" onClick={handleAuth}>
            Authenticate
          </button>
        </>
      )}
    </div>
  );
}
