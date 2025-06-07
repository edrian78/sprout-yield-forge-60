
import { useState, useEffect } from 'react';
import { collection, query, where, or, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface EscrowData {
  id: string;
  asset: string;
  amount: number;
  lockPeriod: number;
  receiverWallet: string;
  senderWallet: string;
  title: string;
  status: string;
  createdAt: any;
  unlockAt: any;
  yieldRate: number;
  deposits: any[];
  withdrawals: any[];
  auditTrail: any[];
}

export const useEscrows = (walletAddress: string | null) => {
  const [escrows, setEscrows] = useState<EscrowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setEscrows([]);
      return;
    }

    setLoading(true);
    setError(null);

    const escrowsRef = collection(db, 'escrow');
    const q = query(
      escrowsRef,
      or(
        where('receiverWallet', '==', walletAddress),
        where('senderWallet', '==', walletAddress)
      )
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const escrowData: EscrowData[] = [];
        querySnapshot.forEach((doc) => {
          escrowData.push({
            id: doc.id,
            ...doc.data()
          } as EscrowData);
        });
        setEscrows(escrowData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching escrows:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [walletAddress]);

  return { escrows, loading, error };
};
