
import React from 'react';
import { ArrowRight, Play, Timer, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onStartEscrow: () => void;
  onLearnMore: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartEscrow, onLearnMore }) => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-shadow">
                <span className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                  Lock Funds.
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                  Earn Yield.
                </span>
                <br />
                <span className="text-foreground">Get Paid.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Sprout transforms escrow into a yield-generating experience. Secure, simple, and built to grow — on XRPL.
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
          </div>

          {/* Right Visual - Two Token Cards */}
          <div className="relative flex items-center justify-center">
            <div className="flex flex-col space-y-6">
              {/* XRP Card */}
              <div className="glass-card w-64 h-32 rounded-3xl p-6 floating-card animate-float">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">XRP</span>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">XRP</div>
                      <div className="text-lg font-bold text-blue-600">12.5% APY</div>
                    </div>
                  </div>
                  <div className="text-2xl">💧</div>
                </div>
              </div>

              {/* RLUSD Card */}
              <div className="glass-card w-64 h-32 rounded-3xl p-6 floating-card animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-xs">RLUSD</span>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">RLUSD</div>
                      <div className="text-lg font-bold text-green-600">15% APY</div>
                    </div>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 glass-card w-12 h-12 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                <Timer className="h-6 w-6 text-green-600" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card w-12 h-12 rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
