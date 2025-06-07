
import React from 'react';
import { CheckCircle, Download, ExternalLink, RotateCcw, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PayoutData {
  escrowId: string;
  principal: string;
  yieldEarned: string;
  totalReceived: string;
  currency: string;
  recipient: string;
  releaseDate: string;
  yieldSplit: {
    buyer: number;
    seller: number;
    protocol: number;
  };
  txHash: string;
  strategy: string;
}

const PayoutSummary = () => {
  // Mock data - in real app this would come from route params or API
  const payoutData: PayoutData = {
    escrowId: 'ESC-001',
    principal: '300',
    yieldEarned: '12.5',
    totalReceived: '312.5',
    currency: 'XRP',
    recipient: '0xeba8f3352aa8441824cfb53010e8903654e50112',
    releaseDate: '2025-06-07T15:30:00Z',
    yieldSplit: {
      buyer: 50,
      seller: 30,
      protocol: 20
    },
    txHash: 'A1B2C3D4E5F6789ABCDEF...',
    strategy: 'XRPL AMM'
  };

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt for:', payoutData.escrowId);
    // Generate and download receipt
  };

  const handleViewExplorer = () => {
    console.log('Opening XRPL explorer for:', payoutData.txHash);
    // Open XRPL explorer
  };

  const handleCreateAnother = () => {
    console.log('Creating another escrow');
    window.dispatchEvent(new CustomEvent('navigate-to-create-escrow'));
  };

  const calculateYieldAmount = (percentage: number) => {
    return ((parseFloat(payoutData.yieldEarned) * percentage) / 100).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Escrow Released Successfully!</h1>
        <p className="text-muted-foreground">
          Your funds have been released and yield has been distributed
        </p>
        <Badge className="mt-2 bg-green-100 text-green-800 border-0">
          {payoutData.escrowId}
        </Badge>
      </div>

      {/* Payout Summary Card */}
      <Card className="glass-card border-0 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Payout Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Numbers */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Principal Amount</p>
              <p className="text-2xl font-bold">{payoutData.principal} {payoutData.currency}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Yield Earned</p>
              <p className="text-2xl font-bold text-green-600">+{payoutData.yieldEarned} {payoutData.currency}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-3xl font-bold text-green-600">{payoutData.totalReceived} {payoutData.currency}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Release Date</span>
                <span className="text-sm font-medium">
                  {new Date(payoutData.releaseDate).toLocaleDateString()} at{' '}
                  {new Date(payoutData.releaseDate).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Yield Strategy</span>
                <span className="text-sm font-medium">{payoutData.strategy}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Recipient</span>
                <span className="text-sm font-mono">{payoutData.recipient.slice(0, 10)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction Hash</span>
                <button 
                  onClick={handleViewExplorer}
                  className="text-sm font-mono text-blue-600 hover:underline"
                >
                  {payoutData.txHash.slice(0, 10)}...
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yield Distribution */}
      <Card className="glass-card border-0 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Yield Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Visual Breakdown */}
            <div className="relative">
              <div className="flex h-8 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500" 
                  style={{ width: `${payoutData.yieldSplit.buyer}%` }}
                ></div>
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${payoutData.yieldSplit.seller}%` }}
                ></div>
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${payoutData.yieldSplit.protocol}%` }}
                ></div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium">Buyer ({payoutData.yieldSplit.buyer}%)</p>
                  <p className="text-sm text-muted-foreground">
                    {calculateYieldAmount(payoutData.yieldSplit.buyer)} {payoutData.currency}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium">Seller ({payoutData.yieldSplit.seller}%)</p>
                  <p className="text-sm text-muted-foreground">
                    {calculateYieldAmount(payoutData.yieldSplit.seller)} {payoutData.currency}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <div>
                  <p className="text-sm font-medium">Protocol ({payoutData.yieldSplit.protocol}%)</p>
                  <p className="text-sm text-muted-foreground">
                    {calculateYieldAmount(payoutData.yieldSplit.protocol)} {payoutData.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button 
          onClick={handleDownloadReceipt}
          variant="outline" 
          className="glass-button"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        
        <Button 
          onClick={handleViewExplorer}
          variant="outline" 
          className="glass-button"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on XRPL Explorer
        </Button>
        
        <Button 
          onClick={handleCreateAnother}
          className="nature-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Create Another Escrow
        </Button>
      </div>
    </div>
  );
};

export default PayoutSummary;
