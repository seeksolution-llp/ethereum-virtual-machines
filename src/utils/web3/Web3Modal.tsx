'use client'

import { createWeb3Modal } from '@web3modal/wagmi1/react'
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi1'

import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, sepolia, goerli, polygon, polygonMumbai } from 'viem/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
    [mainnet, sepolia, goerli, polygon, polygonMumbai],
    [walletConnectProvider({ projectId }), publicProvider()]
)

const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
        new EIP6963Connector({ chains }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } }),
        new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
    ],
    publicClient
})

// 3. Create modal
createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    enableAnalytics: true // Optional - defaults to your Cloud configuration
})

export function Web3Modal({ children }: any) {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}