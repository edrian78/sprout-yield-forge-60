
import React, { useState } from 'react';
import { Wallet, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConnectWalletProps {
  onWalletConnect: (walletType: string) => void;
  network: 'devnet' | 'mainnet';
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onWalletConnect, network }) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [balances, setBalances] = useState<{ xrp: string; rlusd: string } | null>(null);

  const walletOptions = [
    {
      id: 'xumm',
      name: 'XUMM',
      description: 'The most popular XRPL wallet',
      icon: '🦎',
      supported: true,
      recommended: true
    },
    {
      id: 'tangem',
      name: 'Tangem',
      description: 'Hardware wallet security',
      icon: '💳',
      supported: true,
      recommended: false
    },
    {
      id: 'devnet',
      name: 'Devnet Wallet',
      description: 'For testing purposes only',
      icon: '🔧',
      supported: network === 'devnet',
      recommended: false
    }
  ];

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId);
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock balances after connection
    setBalances({
      xrp: '1,250.50',
      rlusd: '5,000.00'
    });
    
    setConnecting(null);
    onWalletConnect(walletId);
  };

  if (balances) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          {/* Success State */}
          <Card className="glass-card border-0 floating-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Wallet Connected!</CardTitle>
              <p className="text-muted-foreground">Your XRPL wallet is now connected</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Network Badge */}
              <div className="flex justify-center">
                <Badge variant={network === 'mainnet' ? 'default' : 'secondary'} className="px-3 py-1">
                  {network === 'mainnet' ? '🌐 Mainnet' : '🔧 Devnet'}
                </Badge>
              </div>

              {/* Balances */}
              <div className="space-y-3">
                <h4 className="font-semibold text-center">Your Balances</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <Card className="glass-card border-0 p-4 text-center">
                    <CardContent className="space-y-1 p-0">
                      <div className="text-sm text-muted-foreground">XRP</div>
                      <div className="font-bold text-lg">{balances.xrp}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card border-0 p-4 text-center">
                    <CardContent className="space-y-1 p-0">
                      <div className="text-sm text-muted-foreground">RLUSD</div>
                      <div className="font-bold text-lg">{balances.rlusd}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="glass-card p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Wallet Address</div>
                <div className="font-mono text-sm flex items-center justify-between">
                  <span>rN7n...k8dQ</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Button 
                className="w-full nature-gradient text-white font-semibold py-3 rounded-xl"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-create-escrow'))}
              >
                Continue to Create Escrow
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Choose your XRPL wallet to get started with Sprout
          </p>
        </div>

        {/* Network Indicator */}
        <div className="flex justify-center mb-6">
          <Badge variant={network === 'mainnet' ? 'default' : 'secondary'} className="px-3 py-1">
            {network === 'mainnet' ? '🌐 Mainnet Network' : '🔧 Devnet Network'}
          </Badge>
        </div>

        {/* Wallet Options */}
        <div className="space-y-4">
          {walletOptions.map((wallet) => (
            <Card 
              key={wallet.id}
              className={`glass-card border-0 floating-card cursor-pointer transition-all duration-300 ${
                !wallet.supported ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{wallet.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{wallet.name}</h3>
                        {wallet.recommended && (
                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{wallet.description}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleConnect(wallet.id)}
                    disabled={!wallet.supported || connecting === wallet.id}
                    className={`glass-button ${wallet.recommended ? 'nature-gradient text-white' : ''}`}
                  >
                    {connecting === wallet.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      'Connect'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            New to XRPL? <a href="#" className="text-green-600 hover:underline">Learn how to set up a wallet</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
