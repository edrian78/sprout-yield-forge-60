
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Play, Timer, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

interface LandingPageProps {
  onStartEscrow: () => void;
  onLearnMore: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartEscrow, onLearnMore }) => {
  const [api, setApi] = React.useState<CarouselApi>();

  const useCases = [
    { title: "Freelancer", description: "Secure payments for projects" },
    { title: "Payroll", description: "Automated salary payments" },
    { title: "Transaction", description: "Safe peer-to-peer transfers" },
    { title: "Invoice", description: "Guaranteed invoice payments" }
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [api]);

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

          {/* Right Visual - Cards and Use Cases */}
          <div className="relative flex flex-col items-center justify-center space-y-8">
            {/* Token Cards - Horizontal Layout */}
            <div className="flex space-x-6">
              {/* XRP Card */}
              <div className="glass-card w-48 h-32 rounded-3xl p-6 floating-card animate-float">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="/lovable-uploads/d2e9a7d2-58fb-4443-b332-88205925aea3.png" 
                        alt="XRP Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">XRP</div>
                      <div className="text-lg font-bold text-blue-600">12.5% APY</div>
                    </div>
                  </div>
                  <div className="text-xl">💧</div>
                </div>
              </div>

              {/* RLUSD Card */}
              <div className="glass-card w-48 h-32 rounded-3xl p-6 floating-card animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="/lovable-uploads/cd221866-6ffa-4102-a36e-d7d5afc4be7b.png" 
                        alt="RLUSD Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">RLUSD</div>
                      <div className="text-lg font-bold text-green-600">15% APY</div>
                    </div>
                  </div>
                  <div className="text-xl">💰</div>
                </div>
              </div>
            </div>

            {/* Use Cases Carousel */}
            <div className="w-full max-w-sm">
              <Carousel 
                setApi={setApi}
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {useCases.map((useCase, index) => (
                    <CarouselItem key={index}>
                      <div className="glass-card p-6 rounded-2xl text-center">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {useCase.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {useCase.description}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
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
      </section>
    </div>
  );
};

export default LandingPage;
