
import React from 'react';
import { Sprout, Wallet, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
  showWalletConnection?: boolean;
  walletConnected?: boolean;
  network?: 'devnet' | 'mainnet';
  onNetworkToggle?: () => void;
  onWalletConnect?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showWalletConnection = false,
  walletConnected = false,
  network = 'devnet',
  onNetworkToggle,
  onWalletConnect
}) => {
  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <header className="relative z-50 glass-card border-0 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Sprout className="h-8 w-8 sprout-icon animate-grow" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold text-shadow bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Sprout
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {showWalletConnection && (
                <>
                  {/* Network Toggle */}
                  <div className="flex items-center space-x-2 glass-card px-3 py-2 rounded-full">
                    <span className={`text-sm ${network === 'devnet' ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                      Devnet
                    </span>
                    <button onClick={onNetworkToggle} className="text-green-600 hover:text-green-700 transition-colors">
                      {network === 'devnet' ? <ToggleLeft className="h-5 w-5" /> : <ToggleRight className="h-5 w-5" />}
                    </button>
                    <span className={`text-sm ${network === 'mainnet' ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                      Mainnet
                    </span>
                  </div>

                  {/* Wallet Connection */}
                  {walletConnected ? (
                    <div className="glass-card px-4 py-2 rounded-full flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button onClick={onWalletConnect} className="glass-button">
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-yellow-200/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-green-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default Layout;
