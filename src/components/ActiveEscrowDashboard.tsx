
import React, { useState } from 'react';
import { Timer, TrendingUp, Clock, ExternalLink, Unlock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EscrowData {
  id: string;
  amount: string;
  currency: string;
  recipient: string;
  status: 'locked' | 'earning' | 'ready';
  yieldEarned: string;
  totalValue: string;
  duration: number;
  daysRemaining: number;
  releaseCondition: string;
  yieldStrategy: string;
  txHash?: string;
}

const ActiveEscrowDashboard = () => {
  // Mock data - in real app this would come from XRPL/API
  const [escrows] = useState<EscrowData[]>([
    {
      id: 'ESC-001',
      amount: '300',
      currency: 'XRP',
      recipient: '0xeba8f3352aa8441824cfb53010e8903654e50112',
      status: 'earning',
      yieldEarned: '12.5',
      totalValue: '312.5',
      duration: 30,
      daysRemaining: 23,
      releaseCondition: 'manual',
      yieldStrategy: 'XRPL AMM',
      txHash: 'A1B2C3D4E5F6...'
    },
    {
      id: 'ESC-002',
      amount: '150',
      currency: 'RLUSD',
      recipient: '0x742d35Cc8C6C6E8f1aB8a...',
      status: 'ready',
      yieldEarned: '8.2',
      totalValue: '158.2',
      duration: 14,
      daysRemaining: 0,
      releaseCondition: 'time-based',
      yieldStrategy: 'Bitget Savings'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'locked': return 'bg-yellow-100 text-yellow-800';
      case 'earning': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (daysRemaining: number, duration: number) => {
    return ((duration - daysRemaining) / duration) * 100;
  };

  const handleRelease = (escrowId: string) => {
    console.log('Releasing escrow:', escrowId);
    // Navigate to payout summary
    window.dispatchEvent(new CustomEvent('navigate-to-payout-summary', { detail: { escrowId } }));
  };

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
                <p className="text-2xl font-bold">450 XRP</p>
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
                <p className="text-sm text-muted-foreground">Yield Earned</p>
                <p className="text-2xl font-bold text-green-600">+20.7 XRP</p>
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
                <p className="text-sm text-muted-foreground">Active Escrows</p>
                <p className="text-2xl font-bold">{escrows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow Cards */}
      <div className="space-y-6">
        {escrows.map((escrow) => (
          <Card key={escrow.id} className="glass-card border-0 floating-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg">{escrow.id}</CardTitle>
                  <Badge className={`${getStatusColor(escrow.status)} border-0`}>
                    {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                  </Badge>
                </div>
                {escrow.txHash && (
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View TX
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Amount & Yield */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Principal Amount</span>
                    <span className="font-semibold">{escrow.amount} {escrow.currency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yield Earned</span>
                    <span className="font-semibold text-green-600">+{escrow.yieldEarned} {escrow.currency}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Total Value</span>
                    <span className="text-lg font-bold">{escrow.totalValue} {escrow.currency}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Strategy</span>
                    <span className="font-medium">{escrow.yieldStrategy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Release Condition</span>
                    <span className="font-medium capitalize">{escrow.releaseCondition.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Recipient</span>
                    <span className="font-mono text-sm">{escrow.recipient.slice(0, 10)}...</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {escrow.status !== 'ready' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {escrow.daysRemaining} days remaining
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(getProgressPercentage(escrow.daysRemaining, escrow.duration))}% complete
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(escrow.daysRemaining, escrow.duration)} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                {escrow.status === 'ready' ? (
                  <Button 
                    onClick={() => handleRelease(escrow.id)}
                    className="w-full nature-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Release Funds
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
        ))}
      </div>

      {/* Empty State */}
      {escrows.length === 0 && (
        <Card className="glass-card border-0 text-center p-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Timer className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">No Active Escrows</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start your first yield-generating escrow to see it tracked here
            </p>
            <Button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-create-escrow'))}
              className="nature-gradient text-white"
            >
              Create Escrow
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ActiveEscrowDashboard;
