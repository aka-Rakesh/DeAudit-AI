"use client";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

const allowedNetworks = ['localnet', 'devnet', 'testnet', 'mainnet'] as const;
type NetworkType = typeof allowedNetworks[number];
const envNetwork = process.env.NEXT_PUBLIC_SUI_NETWORK;
const suiNetwork: NetworkType = allowedNetworks.includes(envNetwork as NetworkType)
  ? (envNetwork as NetworkType)
  : 'testnet';

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={suiNetwork}>
        <WalletProvider>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
