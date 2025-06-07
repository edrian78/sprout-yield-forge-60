
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, CheckCircle, Loader2, QrCode } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  escrowId: string;
  escrowTitle: string;
  amount: number;
  asset: string;
}

const PaymentModal = ({ isOpen, onClose, escrowId, escrowTitle, amount, asset }: PaymentModalProps) => {
  const [paymentData, setPaymentData] = useState<{ uuid: string; url: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const generateQRCode = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const initiatePayment = async () => {
    setIsLoading(true);
    try {
      console.log('Initiating payment for escrow:', escrowId);
      const requestEscrowPayment = httpsCallable(functions, 'requestEscrowPayment');
      const response = await requestEscrowPayment({ escrowId });
      console.log('Payment response:', response.data);
      
      // Handle the response structure properly
      const responseData = response.data as any;
      console.log('Response data structure:', responseData);
      
      if (responseData && responseData.result) {
        setPaymentData(responseData.result);
        setIsLoading(false);
        console.log('Payment data set:', responseData.result);
        
        // Start checking payment status
        checkPaymentStatus();
      } else {
        throw new Error('Invalid response structure from requestEscrowPayment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to initiate escrow payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    setIsChecking(true);
    
    const checkStatus = async () => {
      try {
        console.log('Checking payment status for escrow:', escrowId);
        const confirmEscrowPayment = httpsCallable(functions, 'confirmEscrowPayment');
        const response = await confirmEscrowPayment({ escrowId });
        console.log('Confirm payment response:', response.data);
        
        const responseData = response.data as any;
        
        if (responseData && responseData.result && responseData.result.success) {
          setIsCompleted(true);
          setIsChecking(false);
          toast({
            title: "Payment Successful",
            description: "Escrow payment has been confirmed successfully.",
          });
          
          // Close modal after a short delay
          setTimeout(() => {
            handleClose();
          }, 2000);
        } else {
          // Continue checking after 3 seconds
          setTimeout(() => checkStatus(), 3000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Continue checking despite errors
        setTimeout(() => checkStatus(), 3000);
      }
    };
    
    checkStatus();
  };

  const handleClose = () => {
    setPaymentData(null);
    setIsLoading(false);
    setIsChecking(false);
    setIsCompleted(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen && !paymentData && !isLoading) {
      initiatePayment();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>Pay Escrow</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Escrow Details */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Title:</span>
                <span className="font-medium">{escrowTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-bold text-lg">{amount} {asset}</span>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-muted-foreground">Generating payment request...</p>
            </div>
          )}

          {/* QR Code and Payment Instructions */}
          {paymentData && !isCompleted && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block border">
                  <img
                    src={generateQRCode(paymentData.url)}
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto"
                    onError={(e) => {
                      console.error('QR code failed to load:', e);
                    }}
                    onLoad={() => {
                      console.log('QR code loaded successfully for URL:', paymentData.url);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground">
                  Scan the QR code with your XUMM wallet to complete the payment
                </p>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(paymentData.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in XUMM
                </Button>

                {isChecking && (
                  <div className="flex items-center justify-center space-x-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Waiting for payment confirmation...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success State */}
          {isCompleted && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">
                Your escrow payment has been confirmed. The modal will close automatically.
              </p>
            </div>
          )}

          {/* Cancel Button */}
          {!isCompleted && (
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
