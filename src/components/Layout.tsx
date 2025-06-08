import React from 'react';
import { Wallet, Globe, Timer, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
  showWalletConnection?: boolean;
  walletConnected?: boolean;
  walletData?: { address: string; balances: { xrp: string; rlusd: string } } | null;
  network?: 'devnet' | 'mainnet';
  onNetworkToggle?: () => void;
  onWalletConnect?: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showWalletConnection = false,
  walletConnected = false,
  walletData = null,
  network = 'devnet',
  onNetworkToggle,
  onWalletConnect,
  currentPage,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <header className="glass-card border-0 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => onNavigate?.('landing')}
            >
              <img 
                src="/lovable-uploads/95e0a80a-97d5-4e25-ba54-286ec34dca17.png" 
                alt="Sprout Logo" 
                className="h-12 w-auto"
              />
            </div>

            {/* Navigation */}
            {showWalletConnection && (
              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => onNavigate?.('create-escrow')}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'create-escrow' 
                      ? 'text-green-600' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Create Escrow
                </button>
                <button
                  onClick={() => onNavigate?.('active-escrows')}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'active-escrows' 
                      ? 'text-green-600' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  My Escrows
                </button>
              </nav>
            )}

            {/* Wallet Section */}
            {showWalletConnection && (
              <div className="flex items-center space-x-4">
                {/* Network Toggle */}
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <button
                    onClick={onNetworkToggle}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {network === 'devnet' ? 'Devnet' : 'Mainnet'}
                  </button>
                </div>

                {/* Wallet Status */}
                {walletConnected && walletData ? (
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800 border-0">
                      <Wallet className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <div className="hidden sm:block text-sm text-muted-foreground">
                      Balance: {walletData.balances.xrp} XRP
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={onWalletConnect}
                    variant="outline" 
                    size="sm"
                    className="glass-button"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-card border-0 border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/95e0a80a-97d5-4e25-ba54-286ec34dca17.png" 
                alt="Sprout Logo" 
                className="h-6 w-auto"
              />
              <span className="text-sm text-muted-foreground">
                Yield-generating escrow on XRPL
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Built on XRP Ledger</span>
              <span>•</span>
              <span>Powered by XRPL AMM</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
