import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygon } from 'wagmi/chains'

export const config = getDefaultConfig({
    appName: 'PredictAI - Prediction Market Agent',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '41deb8642fc0be5d72a39c26978e0b3e',
    chains: [polygon],
    ssr: true, // Enable server-side rendering
})

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}
