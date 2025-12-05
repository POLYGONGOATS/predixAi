import ConditionalNavbar from '@/components/ConditionalNavbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3Provider } from './providers';
import ConditionalMain from '@/components/ConditionalMain';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PredictAI - AI-Powered Prediction Markets',
  description: 'Trade prediction markets with AI-powered insights using the Nullshot Framework',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <div className="min-h-screen bg-dark-gradient">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
            </div>

            <ConditionalNavbar />
            <ConditionalMain>
              {children}
            </ConditionalMain>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
