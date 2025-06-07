
import React, { useState } from 'react';
import { Wallet, CheckCircle, ExternalLink, QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

interface ConnectWalletProps {
  onWalletConnect: (walletType: string, walletData?: { address: string; balances: { xrp: string; rlusd: string } }) => void;
  network: 'devnet' | 'mainnet';
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onWalletConnect, network }) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [balances, setBalances] = useState<{ xrp: string; rlusd: string } | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [xummUuid, setXummUuid] = useState<string>('');
  const [pollingActive, setPollingActive] = useState(false);

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

  const handleXummLogin = async () => {
    try {
      setConnecting('xumm');
      
      const xummLogin = httpsCallable(functions, 'xummLogin');
      const result = await xummLogin();
      const data = result.data as { url: string; uuid: string };
      
      console.log('XUMM login response:', data);
      
      // Generate QR code using QR Server API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(data.url)}`;
      setQrCodeUrl(qrApiUrl);
      setXummUuid(data.uuid);
      setShowQRDialog(true);
      setPollingActive(true);
      
      // Start polling for login status
      pollLoginStatus(data.uuid);
    } catch (error) {
      console.error('Error initiating XUMM login:', error);
      setConnecting(null);
    }
  };

  const pollLoginStatus = async (uuid: string) => {
    const xummGetLoginStatus = httpsCallable(functions, 'xummGetLoginStatus');
    
    const checkStatus = async () => {
      if (!pollingActive) return;
      
      try {
        console.log('Checking XUMM login status for UUID:', uuid);
        const result = await xummGetLoginStatus({ uuid });
        const data = result.data as { signed: boolean; address?: string; balances?: { xrp: string; rlusd: string } };
        
        console.log('XUMM status check:', data);
        
        if (data.signed && data.address) {
          console.log('XUMM login successful!');
          setPollingActive(false);
          setShowQRDialog(false);
          setConnecting(null);
          
          // Store wallet data
          setBalances(data.balances || { xrp: '0.00', rlusd: '0.00' });
          setWalletAddress(data.address);
          
          // Pass wallet data to parent
          onWalletConnect('xumm', {
            address: data.address,
            balances: data.balances || { xrp: '0.00', rlusd: '0.00' }
          });
        } else if (pollingActive) {
          // Continue polling after 2 seconds
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('Error checking XUMM login status:', error);
        if (pollingActive) {
          // Continue polling
          setTimeout(checkStatus, 2000);
        }
      }
    };
    
    checkStatus();
  };

  const handleConnect = async (walletId: string) => {
    if (walletId === 'xumm') {
      await handleXummLogin();
      return;
    }
    
    setConnecting(walletId);
    
    // For other wallets, show that they're not fully implemented yet
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnecting(null);
    alert(`${walletId} wallet integration is not yet implemented. Please use XUMM for now.`);
  };

  const handleCloseQRDialog = () => {
    setPollingActive(false);
    setShowQRDialog(false);
    setConnecting(null);
    setQrCodeUrl('');
    setXummUuid('');
  };

  if (balances && walletAddress) {
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
                  <span>{walletAddress.length > 10 ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : walletAddress}</span>
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
    <>
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

      {/* XUMM QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Scan with XUMM</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="XUMM QR Code" 
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    console.error('QR code image failed to load:', qrCodeUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Loading QR code...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Open XUMM and scan this QR code</p>
              <p className="text-xs text-muted-foreground">
                Waiting for you to approve the sign-in request in XUMM...
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleCloseQRDialog}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectWallet;
