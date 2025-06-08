
import React, { useState } from 'react';
import { Timer, TrendingUp, Clock, ExternalLink, Unlock, DollarSign, CreditCard, Banknote, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEscrows } from '@/hooks/useEscrows';
import PaymentModal from '@/components/PaymentModal';
import { useToast } from '@/hooks/use-toast';

interface ActiveEscrowDashboardProps {
  walletData?: { address: string; balances: { xrp: string; rlusd: string } } | null;
}

const ActiveEscrowDashboard = ({ walletData }: ActiveEscrowDashboardProps) => {
  const { escrows, loading, error } = useEscrows(walletData?.address || null);
  const { toast } = useToast();
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    escrowId: string;
    title: string;
    amount: number;
    asset: string;
  }>({
    isOpen: false,
    escrowId: '',
    title: '',
    amount: 0,
    asset: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'funded': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'withdrawn': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (createdAt: any, unlockAt: any) => {
    if (!createdAt || !unlockAt) return 0;
    
    const now = new Date().getTime();
    const start = createdAt.toDate?.()?.getTime() || createdAt;
    const end = unlockAt.toDate?.()?.getTime() || unlockAt;
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    return ((now - start) / (end - start)) * 100;
  };

  const getDaysRemaining = (unlockAt: any) => {
    if (!unlockAt) return 0;
    
    const now = new Date().getTime();
    const end = unlockAt.toDate?.()?.getTime() || unlockAt;
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const canUnlock = (unlockAt: any) => {
    console.log('canUnlock called with:', unlockAt);
    
    if (!unlockAt) {
      console.log('No unlockAt provided');
      return false;
    }
    
    const now = new Date().getTime();
    console.log('Current time (ms):', now);
    console.log('Current time (readable):', new Date(now).toISOString());
    
    // Handle Firebase Timestamp
    let endTime;
    if (unlockAt.toDate && typeof unlockAt.toDate === 'function') {
      endTime = unlockAt.toDate().getTime();
      console.log('Firebase Timestamp detected, converted to:', endTime);
    } else if (unlockAt.seconds) {
      // Firebase Timestamp object structure
      endTime = unlockAt.seconds * 1000 + (unlockAt.nanoseconds || 0) / 1000000;
      console.log('Firebase Timestamp with seconds detected, converted to:', endTime);
    } else {
      endTime = unlockAt;
      console.log('Using unlockAt directly:', endTime);
    }
    
    console.log('End time (ms):', endTime);
    console.log('End time (readable):', new Date(endTime).toISOString());
    
    const canUnlockResult = now >= endTime;
    console.log('Can unlock result:', canUnlockResult);
    console.log('Time difference (ms):', now - endTime);
    
    return canUnlockResult;
  };

  const handlePayment = (escrow: any) => {
    setPaymentModal({
      isOpen: true,
      escrowId: escrow.id,
      title: escrow.title,
      amount: escrow.amount,
      asset: escrow.asset
    });
  };

  const handleWithdraw = async (escrowId: string, escrowTitle: string, amount: number, asset: string) => {
    try {
      console.log('Withdrawing escrow:', escrowId);
      
      // Call backend withdrawEscrow function
      const response = await fetch('https://us-central1-wzard-ecb8c.cloudfunctions.net/withdrawEscrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            escrowId: escrowId
          }
        })
      });

      const result = await response.json();
      
      if (response.ok && result.result?.success) {
        toast({
          title: "Withdrawal Successful!",
          description: `Successfully withdrew ${amount} ${asset} from "${escrowTitle}"`,
        });
      } else {
        throw new Error(result.error?.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: error instanceof Error ? error.message : "An error occurred during withdrawal",
        variant: "destructive",
      });
    }
  };

  const handleRelease = (escrowId: string) => {
    console.log('Releasing escrow:', escrowId);
    window.dispatchEvent(new CustomEvent('navigate-to-payout-summary', { detail: { escrowId } }));
  };

  const closePaymentModal = () => {
    setPaymentModal({
      isOpen: false,
      escrowId: '',
      title: '',
      amount: 0,
      asset: ''
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading escrows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-0 text-center p-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">Error Loading Escrows</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  // Filter out pending payment escrows for calculations
  const activeEscrows = escrows.filter(e => e.status !== 'pending_payment');
  
  const totalLocked = activeEscrows
    .filter(e => e.status === 'withdrawn' || e.status === 'funded')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalYield = activeEscrows
    .filter(e => e.status === 'withdrawn' || e.status === 'funded')
    .reduce((sum, e) => sum + (e.amount * e.yieldRate * (e.lockPeriod / 365)), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Active Escrows</h1>
        <p className="text-muted-foreground">Track your yield-generating escrows in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Locked</p>
                <p className="text-2xl font-bold">{totalLocked.toFixed(2)} XRP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projected Yield</p>
                <p className="text-2xl font-bold text-green-600">+{totalYield.toFixed(2)} XRP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Timer className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Escrows</p>
                <p className="text-2xl font-bold">{escrows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow Cards */}
      <div className="space-y-6">
        {escrows.map((escrow) => {
          const daysRemaining = getDaysRemaining(escrow.unlockAt);
          const progress = getProgressPercentage(escrow.createdAt, escrow.unlockAt);
          const projectedYield = escrow.amount * escrow.yieldRate * (escrow.lockPeriod / 365);
          const isUnlockable = canUnlock(escrow.unlockAt);
          console.log(isUnlockable);
          return (
            <Card key={escrow.id} className="glass-card border-0 floating-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg">{escrow.title}</CardTitle>
                    <Badge className={`${getStatusColor(escrow.status)} border-0`}>
                      {escrow.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {escrow.id.slice(0, 8)}...
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-semibold">{escrow.amount} {escrow.asset}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Projected Yield</span>
                      <span className="font-semibold text-green-600">+{projectedYield.toFixed(2)} {escrow.asset}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Yield Rate</span>
                      <span className="font-medium">{(escrow.yieldRate * 100).toFixed(2)}% APY</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lock Period</span>
                      <span className="font-medium">{escrow.lockPeriod} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Receiver</span>
                      <span className="font-mono text-sm">{escrow.receiverWallet.slice(0, 10)}...</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sender</span>
                      <span className="font-mono text-sm">{escrow.senderWallet.slice(0, 10)}...</span>
                    </div>
                  </div>
                </div>

                {escrow.status === 'active' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {isUnlockable ? 'Ready to unlock' : `${daysRemaining} days remaining`}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(progress)}% complete
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="pt-4">
                  {escrow.status === 'pending_payment' ? (
                    <Button 
                      onClick={() => handlePayment(escrow)}
                      className="w-full nature-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Escrow
                    </Button>
                  ) : escrow.status === 'completed' ? (
                    <Button 
                      onClick={() => handleRelease(escrow.id)}
                      className="w-full nature-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Release Funds
                    </Button>
                  ) : escrow.status === 'withdrawn' ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  ) : escrow.status === 'funded' && isUnlockable ? (
                    <Button 
                      onClick={() => handleWithdraw(escrow.id, escrow.title, escrow.amount, escrow.asset)}
                      className="w-full nature-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled
                    >
                      <Timer className="h-4 w-4 mr-2" />
                      Earning Yield...
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {escrows.length === 0 && (
        <Card className="glass-card border-0 text-center p-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Timer className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">No Escrows Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {walletData ? 
                "You don't have any escrows yet. Start your first yield-generating escrow to see it tracked here." :
                "Connect your wallet to view your escrows."
              }
            </p>
            {walletData && (
              <Button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-create-escrow'))}
                className="nature-gradient text-white"
              >
                Create Escrow
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={closePaymentModal}
        escrowId={paymentModal.escrowId}
        escrowTitle={paymentModal.title}
        amount={paymentModal.amount}
        asset={paymentModal.asset}
      />
    </div>
  );
};

export default ActiveEscrowDashboard;
