'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { wagmiConfig } from './config/wagmiConfig';
import { ReactNode } from 'react';

const queryClient = new QueryClient()

export function Providers(props: { 
  children: ReactNode,
}) {
  return (
    <ChakraProvider value={defaultSystem}>
    <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    </WagmiProvider>
    </ChakraProvider>
  );
}