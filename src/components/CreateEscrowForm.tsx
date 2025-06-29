import React, { useState } from 'react';
import { ArrowRight, Calendar, Clock, Webhook, Coins, TrendingUp, Settings, Info, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface CreateEscrowFormProps {
  onCreateEscrow: (data: any) => void;
  walletData?: { address: string; balances: { xrp: string; rlusd: string } };
}

const CreateEscrowForm: React.FC<CreateEscrowFormProps> = ({
  onCreateEscrow,
  walletData
}) => {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'XRP',
    recipient: '',
    releaseCondition: 'manual',
    releaseDate: '',
    releaseTime: '',
    yieldStrategy: 'xrpl-amm',
    duration: 30,
    yieldSplit: [40, 40, 20],
    // buyer, seller, protocol
    showAdvanced: false
  });
  const [estimatedYield, setEstimatedYield] = useState({
    daily: '0.34',
    total: '10.20',
    apy: '12.5'
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Auto-select appropriate yield strategy based on currency
      if (field === 'currency') {
        if (value === 'XRP') {
          newData.yieldStrategy = 'xrpl-amm';
        } else if (value === 'RLUSD') {
          newData.yieldStrategy = 'bitget-savings';
        }
      }
      return newData;
    });

    // Recalculate yield when amount, duration, currency, or strategy changes
    if (field === 'amount' || field === 'duration' || field === 'yieldStrategy' || field === 'currency') {
      const amount = field === 'amount' ? parseFloat(value) || 0 : parseFloat(formData.amount) || 0;
      const duration = field === 'duration' ? value : formData.duration;
      const strategy = field === 'yieldStrategy' ? value : field === 'currency' ? value === 'XRP' ? 'xrpl-amm' : 'bitget-savings' : formData.yieldStrategy;
      if (amount > 0) {
        const apy = strategy === 'bitget-savings' ? 0.15 : 0.125;
        const dailyYield = amount * apy / 365;
        const totalYield = dailyYield * duration;
        setEstimatedYield({
          daily: dailyYield.toFixed(2),
          total: totalYield.toFixed(2),
          apy: strategy === 'bitget-savings' ? '15.0' : '12.5'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletData?.address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to create an escrow.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const createEscrow = httpsCallable(functions, 'createEscrow');
      const escrowData = {
        title: formData.title,
        asset: formData.currency,
        amount: parseFloat(formData.amount),
        lockPeriod: formData.duration,
        receiverWallet: formData.recipient,
        senderWallet: walletData.address
      };

      console.log('Creating escrow with data:', escrowData);
      
      const result = await createEscrow(escrowData);
      console.log('Escrow created successfully:', result.data);
      
      // Show success dialog instead of toast
      setShowSuccessDialog(true);
      
      // Call the original onCreateEscrow callback
      onCreateEscrow(formData);
    } catch (error) {
      console.error('Error creating escrow:', error);
      toast({
        title: "Failed to Create Escrow",
        description: "An error occurred while creating your escrow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Get available yield strategies based on currency
  const getAvailableYieldStrategies = () => {
    if (formData.currency === 'XRP') {
      return [{
        id: 'xrpl-amm',
        title: 'XRPL AMM',
        description: 'RLUSD/XRP Liquidity Pool',
        apy: '12.5% APY',
        badgeClass: 'nature-gradient text-white'
      }];
    } else if (formData.currency === 'RLUSD') {
      return [{
        id: 'bitget-savings',
        title: 'Bitget RLUSD Savings',
        description: 'Off-chain yield option',
        apy: '15.0% APY',
        badgeClass: 'bg-blue-100 text-blue-800 border-0'
      }];
    }
    return [];
  };

  // Check if form is valid and wallet is connected
  const isFormValid = formData.title && formData.amount && formData.recipient && walletData?.address;

  return (
    <>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Yield-Generating Escrow</h1>
            <p className="text-muted-foreground">
              Lock funds securely while earning passive income
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Title Section */}
                <Card className="glass-card border-0 floating-card">
                  <CardHeader>
                    <CardTitle>Escrow Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="title">Escrow Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter a descriptive title for this escrow" 
                      value={formData.title} 
                      onChange={e => handleInputChange('title', e.target.value)} 
                      className="glass-card border-0" 
                      required
                    />
                  </CardContent>
                </Card>

                {/* Amount Section */}
                <Card className="glass-card border-0 floating-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Coins className="h-5 w-5 sprout-icon" />
                      <span>Escrow Amount</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" placeholder="1000" value={formData.amount} onChange={e => handleInputChange('amount', e.target.value)} className="glass-card border-0 text-lg font-semibold" required />
                      </div>
                      <div className="w-32">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={formData.currency} onValueChange={value => handleInputChange('currency', value)}>
                          <SelectTrigger className="glass-card border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="XRP">XRP</SelectItem>
                            <SelectItem value="RLUSD">RLUSD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="glass-card p-3 rounded-lg bg-green-50/50">
                      <div className="flex items-center space-x-2 text-sm text-green-700">
                        <Info className="h-4 w-4" />
                        <span>Estimated gas fee: ~0.00001 XRP</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recipient Section */}
                <Card className="glass-card border-0 floating-card">
                  <CardHeader>
                    <CardTitle>Recipient Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="recipient">Recipient Wallet Address</Label>
                    <Input id="recipient" placeholder="rN7n...k8dQ or full XRPL address" value={formData.recipient} onChange={e => handleInputChange('recipient', e.target.value)} className="glass-card border-0" required />
                  </CardContent>
                </Card>

                {/* Release Conditions */}
                <Card className="glass-card border-0 floating-card">
                  <CardHeader>
                    <CardTitle>Release Condition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className={`cursor-pointer transition-all duration-300 ${formData.releaseCondition === 'manual' ? 'ring-2 ring-green-500 bg-green-50/50' : 'glass-card border-0 hover:scale-105'}`} onClick={() => handleInputChange('releaseCondition', 'manual')}>
                        <CardContent className="p-4 text-center">
                          <Settings className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <h4 className="font-semibold">Manual Release</h4>
                          <p className="text-xs text-muted-foreground">You control when to release</p>
                        </CardContent>
                      </Card>

                      <Card className={`cursor-pointer transition-all duration-300 ${formData.releaseCondition === 'time' ? 'ring-2 ring-green-500 bg-green-50/50' : 'glass-card border-0 hover:scale-105'}`} onClick={() => handleInputChange('releaseCondition', 'time')}>
                        <CardContent className="p-4 text-center">
                          <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-semibold">Time-Based</h4>
                          <p className="text-xs text-muted-foreground">Auto-release on date</p>
                        </CardContent>
                      </Card>

                      <Card className="cursor-not-allowed opacity-50 glass-card border-0">
                        <CardContent className="p-4 text-center">
                          <Webhook className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                          <h4 className="font-semibold">API Webhook</h4>
                          <p className="text-xs text-muted-foreground">Coming soon</p>
                          <Badge variant="secondary" className="mt-1 text-xs">MVP</Badge>
                        </CardContent>
                      </Card>
                    </div>

                    {formData.releaseCondition === 'time' && <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="releaseDate">Release Date</Label>
                          <Input id="releaseDate" type="date" value={formData.releaseDate} onChange={e => handleInputChange('releaseDate', e.target.value)} className="glass-card border-0" />
                        </div>
                        <div>
                          <Label htmlFor="releaseTime">Release Time</Label>
                          <Input id="releaseTime" type="time" value={formData.releaseTime} onChange={e => handleInputChange('releaseTime', e.target.value)} className="glass-card border-0" />
                        </div>
                      </div>}
                  </CardContent>
                </Card>

                {/* Yield Strategy */}
                <Card className="glass-card border-0 floating-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 sprout-icon" />
                      <span>Yield Strategy</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {getAvailableYieldStrategies().map(strategy => <Card key={strategy.id} className={`cursor-pointer transition-all duration-300 ${formData.yieldStrategy === strategy.id ? 'ring-2 ring-green-500 bg-green-50/50' : 'glass-card border-0 hover:scale-105'}`} onClick={() => handleInputChange('yieldStrategy', strategy.id)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{strategy.title}</h4>
                                <p className="text-sm text-muted-foreground">{strategy.description}</p>
                              </div>
                              <Badge className={strategy.badgeClass}>{strategy.apy}</Badge>
                            </div>
                          </CardContent>
                        </Card>)}
                    </div>

                    <div className="space-y-2">
                      <Label>Duration: {formData.duration} days</Label>
                      <Slider value={[formData.duration]} onValueChange={value => handleInputChange('duration', value[0])} max={365} min={1} step={1} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 day</span>
                        <span>365 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Panel */}
              <div className="lg:col-span-1">
                <Card className="glass-card border-0 floating-card sticky top-4">
                  <CardHeader>
                    <CardTitle>Yield Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Principal</span>
                        <span className="font-semibold">{formData.amount || '0'} {formData.currency}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Daily Yield</span>
                        <span className="font-semibold text-green-600">+{estimatedYield.daily} {formData.currency}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="font-semibold">{formData.duration} days</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total Yield</span>
                        <span className="font-bold text-green-600">+{estimatedYield.total} {formData.currency}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Final Amount</span>
                        <span className="font-bold text-lg">
                          {(parseFloat(formData.amount || '0') + parseFloat(estimatedYield.total)).toFixed(2)} {formData.currency}
                        </span>
                      </div>
                    </div>

                    <div className="glass-card p-3 rounded-lg bg-green-50/50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{estimatedYield.apy}%</div>
                        <div className="text-sm text-muted-foreground">Estimated APY</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Gas Fee</span>
                        <span>~0.00001 XRP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network</span>
                        <span>XRPL Mainnet</span>
                      </div>
                    </div>

                    {!walletData?.address && (
                      <div className="glass-card p-3 rounded-lg bg-orange-50/50 border border-orange-200">
                        <div className="text-center text-sm text-orange-700">
                          <Info className="h-4 w-4 mx-auto mb-1" />
                          Connect your wallet to create escrow
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={!isFormValid || isCreating} 
                      className="w-full nature-gradient text-white font-semibold py-3 rounded-xl hover:scale-105 transition-all duration-300"
                    >
                      {isCreating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Escrow...</span>
                        </div>
                      ) : (
                        <>
                          Create Escrow
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md glass-card border-0">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-700 mb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Sprout className="h-16 w-16 text-green-600 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                </div>
                Escrow Created!
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-lg text-muted-foreground mb-6">
              Let's wait for it to sprout 🌱
            </p>
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              className="nature-gradient text-white px-8 py-2 rounded-lg hover:scale-105 transition-all duration-300"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateEscrowForm;
