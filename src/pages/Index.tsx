
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import LandingPage from '@/components/LandingPage';
import ConnectWallet from '@/components/ConnectWallet';
import CreateEscrowForm from '@/components/CreateEscrowForm';

type Page = 'landing' | 'connect-wallet' | 'create-escrow';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [walletConnected, setWalletConnected] = useState(false);
  const [network, setNetwork] = useState<'devnet' | 'mainnet'>('devnet');

  useEffect(() => {
    // Listen for custom navigation events
    const handleNavigateToCreateEscrow = () => {
      setCurrentPage('create-escrow');
    };

    window.addEventListener('navigate-to-create-escrow', handleNavigateToCreateEscrow);
    
    return () => {
      window.removeEventListener('navigate-to-create-escrow', handleNavigateToCreateEscrow);
    };
  }, []);

  const handleStartEscrow = () => {
    setCurrentPage('connect-wallet');
  };

  const handleLearnMore = () => {
    // In a real app, this would scroll to features or open a modal
    console.log('Learn more clicked');
  };

  const handleWalletConnect = (walletType: string) => {
    console.log('Connected wallet:', walletType);
    setWalletConnected(true);
    // The ConnectWallet component will handle navigation to create-escrow
  };

  const handleNetworkToggle = () => {
    setNetwork(prev => prev === 'devnet' ? 'mainnet' : 'devnet');
  };

  const handleCreateEscrow = (escrowData: any) => {
    console.log('Creating escrow with data:', escrowData);
    // In a real app, this would call the XRPL smart contract
    alert('Escrow created successfully! (Demo)');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onStartEscrow={handleStartEscrow}
            onLearnMore={handleLearnMore}
          />
        );
      case 'connect-wallet':
        return (
          <ConnectWallet 
            onWalletConnect={handleWalletConnect}
            network={network}
          />
        );
      case 'create-escrow':
        return (
          <CreateEscrowForm 
            onCreateEscrow={handleCreateEscrow}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      showWalletConnection={currentPage !== 'landing'}
      walletConnected={walletConnected}
      network={network}
      onNetworkToggle={handleNetworkToggle}
      onWalletConnect={() => setCurrentPage('connect-wallet')}
    >
      {renderPage()}
    </Layout>
  );
};

export default Index;
