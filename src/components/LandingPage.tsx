
import React from 'react';
import { ArrowRight, Play, Lock, TrendingUp, Unlock, Timer, Jar, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LandingPageProps {
  onStartEscrow: () => void;
  onLearnMore: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartEscrow, onLearnMore }) => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-shadow">
                <span className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                  Turning Trust
                </span>
                <br />
                <span className="text-foreground">Into Profit</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Convert idle payments into passive yield while securing your transactions. 
                Sprout makes every escrow a growth opportunity on the XRP Ledger.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onStartEscrow}
                size="lg" 
                className="nature-gradient text-white font-semibold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Escrow
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                onClick={onLearnMore}
                variant="outline" 
                size="lg"
                className="glass-button font-semibold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$2.5M+</div>
                <div className="text-sm text-muted-foreground">Secured Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12.5%</div>
                <div className="text-sm text-muted-foreground">Avg. APY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,250+</div>
                <div className="text-sm text-muted-foreground">Escrows Created</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Main Jar */}
              <div className="glass-card w-64 h-80 rounded-3xl p-8 floating-card animate-float">
                <div className="relative h-full flex flex-col items-center justify-center space-y-6">
                  {/* Sprout growing from coins */}
                  <div className="relative">
                    <div className="flex space-x-2 mb-4">
                      <Coins className="h-6 w-6 coin-glow" />
                      <Coins className="h-5 w-5 coin-glow" />
                      <Coins className="h-4 w-4 coin-glow" />
                    </div>
                    <div className="relative transform -translate-y-2">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-grow">
                        <Timer className="h-8 w-8 sprout-icon" />
                      </div>
                      {/* Growth lines */}
                      <div className="absolute -top-2 left-1/2 w-px h-8 bg-green-400 transform -translate-x-1/2 animate-shimmer"></div>
                    </div>
                  </div>

                  {/* Yield indicator */}
                  <div className="glass-card px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-green-600">+12.5% APY</span>
                  </div>
                </div>

                {/* Jar base */}
                <div className="absolute bottom-4 left-4 right-4 h-2 bg-green-200/50 rounded-full"></div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 glass-card w-12 h-12 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                <Jar className="h-6 w-6 text-green-600" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card w-12 h-12 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Animation */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How Sprout Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to turn your escrow into a yield-generating opportunity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Step 1 */}
          <Card className="glass-card floating-card border-0 text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Lock</h3>
              <p className="text-muted-foreground">
                Secure your payment in a smart escrow contract while earning yield
              </p>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-green-500" />
          </div>

          {/* Step 2 */}
          <Card className="glass-card floating-card border-0 text-center p-6" style={{ animationDelay: '0.2s' }}>
            <CardContent className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold">Earn</h3>
              <p className="text-muted-foreground">
                Your locked funds generate passive income through XRPL AMM strategies
              </p>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-green-500" />
          </div>

          {/* Step 3 */}
          <Card className="glass-card floating-card border-0 text-center p-6" style={{ animationDelay: '0.4s' }}>
            <CardContent className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Unlock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Release</h3>
              <p className="text-muted-foreground">
                Complete the transaction and receive both principal plus generated yield
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card floating-card border-0 p-6 text-center">
            <CardContent className="space-y-3">
              <Timer className="h-8 w-8 mx-auto sprout-icon" />
              <h4 className="font-semibold">Automated Yield</h4>
              <p className="text-sm text-muted-foreground">Passive income while you wait</p>
            </CardContent>
          </Card>

          <Card className="glass-card floating-card border-0 p-6 text-center" style={{ animationDelay: '0.1s' }}>
            <CardContent className="space-y-3">
              <Jar className="h-8 w-8 mx-auto sprout-icon" />
              <h4 className="font-semibold">Secure Escrow</h4>
              <p className="text-sm text-muted-foreground">Trustless smart contracts</p>
            </CardContent>
          </Card>

          <Card className="glass-card floating-card border-0 p-6 text-center" style={{ animationDelay: '0.2s' }}>
            <CardContent className="space-y-3">
              <Coins className="h-8 w-8 mx-auto coin-glow" />
              <h4 className="font-semibold">Low Fees</h4>
              <p className="text-sm text-muted-foreground">Minimal XRPL transaction costs</p>
            </CardContent>
          </Card>

          <Card className="glass-card floating-card border-0 p-6 text-center" style={{ animationDelay: '0.3s' }}>
            <CardContent className="space-y-3">
              <TrendingUp className="h-8 w-8 mx-auto sprout-icon" />
              <h4 className="font-semibold">Real-time Tracking</h4>
              <p className="text-sm text-muted-foreground">Monitor yield as it grows</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
