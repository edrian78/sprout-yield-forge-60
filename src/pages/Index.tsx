
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import LandingPage from '@/components/LandingPage';
import ConnectWallet from '@/components/ConnectWallet';
import CreateEscrowForm from '@/components/CreateEscrowForm';
import ActiveEscrowDashboard from '@/components/ActiveEscrowDashboard';
import PayoutSummary from '@/components/PayoutSummary';
import { useToast } from '@/hooks/use-toast';

type Page = 'landing' | 'connect-wallet' | 'create-escrow' | 'active-escrows' | 'payout-summary';

const Index = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState<{ address: string; balances: { xrp: string; rlusd: string } } | null>(null);
  const [network, setNetwork] = useState<'devnet' | 'mainnet'>('devnet');

  useEffect(() => {
    // Listen for custom navigation events
    const handleNavigateToCreateEscrow = () => {
      setCurrentPage('create-escrow');
    };

    const handleNavigateToActiveEscrows = () => {
      setCurrentPage('active-escrows');
    };

    const handleNavigateToPayoutSummary = () => {
      setCurrentPage('payout-summary');
    };

    window.addEventListener('navigate-to-create-escrow', handleNavigateToCreateEscrow);
    window.addEventListener('navigate-to-active-escrows', handleNavigateToActiveEscrows);
    window.addEventListener('navigate-to-payout-summary', handleNavigateToPayoutSummary);
    
    return () => {
      window.removeEventListener('navigate-to-create-escrow', handleNavigateToCreateEscrow);
      window.removeEventListener('navigate-to-active-escrows', handleNavigateToActiveEscrows);
      window.removeEventListener('navigate-to-payout-summary', handleNavigateToPayoutSummary);
    };
  }, []);

  const handleStartEscrow = () => {
    setCurrentPage('connect-wallet');
  };

  const handleLearnMore = () => {
    // In a real app, this would scroll to features or open a modal
    console.log('Learn more clicked');
  };

  const handleWalletConnect = (walletType: string, data?: { address: string; balances: { xrp: string; rlusd: string } }) => {
    console.log('Connected wallet:', walletType, data);
    setWalletConnected(true);
    if (data) {
      setWalletData(data);
    }
    // The ConnectWallet component will handle navigation to create-escrow
  };

  const handleNetworkToggle = () => {
    setNetwork(prev => prev === 'devnet' ? 'mainnet' : 'devnet');
  };

  const handleCreateEscrow = (escrowData: any) => {
    console.log('Creating escrow with data:', escrowData);
    
    toast({
      title: "Escrow Created Successfully!",
      description: "Your escrow has been created and is now active.",
    });
    
    // Navigate to active escrows to see the new escrow
    setCurrentPage('active-escrows');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
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
            walletData={walletData}
          />
        );
      case 'active-escrows':
        return <ActiveEscrowDashboard walletData={walletData} />;
      case 'payout-summary':
        return <PayoutSummary />;
      default:
        return null;
    }
  };

  return (
    <Layout
      showWalletConnection={currentPage !== 'landing'}
      walletConnected={walletConnected}
      walletData={walletData}
      network={network}
      onNetworkToggle={handleNetworkToggle}
      onWalletConnect={() => setCurrentPage('connect-wallet')}
      currentPage={currentPage}
      onNavigate={handleNavigate}
    >
      {renderPage()}
    </Layout>
  );
};

export default Index;
