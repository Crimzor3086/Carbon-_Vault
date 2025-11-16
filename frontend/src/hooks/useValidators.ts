import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, VALIDATOR_REWARDS_ABI } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';
import { addTransaction, updateTransactionStatus, getBlockExplorerUrl } from '@/services/transactionHistory';
import { useValidatorRewardsContractBalance } from './useContractBalance';
import { calculateReputationScore } from '@/services/validatorService';
import { getStoredValidators, registerValidator } from '@/services/validatorStorage';

export function useValidatorRewards() {
  const { address } = useAccount();
  const { toast } = useToast();

  // Get pending rewards
  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.ValidatorRewards as `0x${string}`,
    abi: VALIDATOR_REWARDS_ABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get verified proofs count
  const { data: verifiedCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESSES.ValidatorRewards as `0x${string}`,
    abi: VALIDATOR_REWARDS_ABI,
    functionName: 'getVerifiedProofsCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get reward per proof
  const { data: rewardPerProof } = useReadContract({
    address: CONTRACT_ADDRESSES.ValidatorRewards as `0x${string}`,
    abi: VALIDATOR_REWARDS_ABI,
    functionName: 'rewardPerProof',
  });

  const formattedRewards = pendingRewards ? formatUnits(pendingRewards as bigint, 18) : '0';
  const formattedRewardPerProof = rewardPerProof ? formatUnits(rewardPerProof as bigint, 18) : '1';
  const proofCount = Number(verifiedCount || 0);

  // Update validator storage when data changes
  useEffect(() => {
    if (address && verifiedCount !== undefined && pendingRewards !== undefined) {
      import('@/services/validatorStorage').then(({ updateValidator }) => {
        const totalRewards = (proofCount * parseFloat(formattedRewardPerProof)).toFixed(2);
        updateValidator(address, proofCount, totalRewards, formattedRewards);
      });
    }
  }, [address, verifiedCount, pendingRewards, proofCount, formattedRewards, formattedRewardPerProof]);

  const refetch = useCallback(() => {
    refetchRewards();
    refetchCount();
  }, [refetchRewards, refetchCount]);

  return {
    pendingRewards: formattedRewards,
    pendingRewardsRaw: pendingRewards as bigint | undefined,
    verifiedProofsCount: proofCount,
    rewardPerProof: formattedRewardPerProof,
    rewardPerProofRaw: rewardPerProof as bigint | undefined,
    refetch,
  };
}

export function useClaimRewards() {
  const { address } = useAccount();
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const { balanceRaw: contractBalance } = useValidatorRewardsContractBalance();

  const claimRewards = useCallback(async () => {
    if (!writeContractAsync || !address) {
      toast({
        title: 'Error',
        description: 'Unable to write to contract',
        variant: 'destructive',
      });
      return;
    }

    // Check if contract has sufficient balance (warning only, don't block)
    if (contractBalance && contractBalance < BigInt(10 ** 18)) { // Less than 1 CVT
      toast({
        title: 'Low Contract Balance',
        description: 'The validator rewards contract may have insufficient CVT. The transaction might fail.',
        variant: 'destructive',
      });
    }

    setIsPending(true);
    setTxHash(undefined);

    try {
      toast({
        title: 'Claiming Rewards',
        description: 'Please confirm the transaction in your wallet.',
      });

      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ValidatorRewards as `0x${string}`,
        abi: VALIDATOR_REWARDS_ABI,
        functionName: 'claimReward',
      });

      setTxHash(tx);

      // Add to transaction history
      addTransaction({
        hash: tx,
        type: 'claim_validator',
        status: 'pending',
        timestamp: Date.now(),
        address: address,
      });

      toast({
        title: 'Transaction Submitted',
        description: 'Waiting for confirmation...',
      });

      setIsPending(false);
      return tx;
    } catch (error: any) {
      console.error('Error claiming rewards:', error);

      let errorMessage = 'Failed to claim rewards';
      if (error?.message?.includes('user rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error?.message?.includes('No rewards to claim')) {
        errorMessage = 'You have no rewards to claim';
      } else if (error?.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees';
      }

      toast({
        title: 'Transaction Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsPending(false);
      setTxHash(undefined);
      throw error;
    }
  }, [writeContractAsync, address, toast, contractBalance]);

  // Show success toast when confirmed and update transaction history
  useEffect(() => {
    if (isConfirmed && txHash) {
      updateTransactionStatus(txHash, 'confirmed');
      
      const explorerUrl = getBlockExplorerUrl(txHash);
      
      toast({
        title: 'Rewards Claimed!',
        description: `Your validator rewards have been transferred. View on Explorer: ${explorerUrl}`,
        action: {
          label: 'View Transaction',
          onClick: () => window.open(explorerUrl, '_blank'),
        },
      });
    }
  }, [isConfirmed, txHash, toast]);

  return {
    claimRewards,
    isPending: isPending || isConfirming,
    isConfirming,
    isConfirmed,
    txHash,
  };
}

export function useSubmitProof() {
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const submitProof = useCallback(
    async (validatorAddress: string) => {
      if (!writeContractAsync) {
        toast({
          title: 'Error',
          description: 'Unable to write to contract',
          variant: 'destructive',
        });
        return;
      }

      setIsPending(true);
      try {
        toast({
          title: 'Submitting Proof',
          description: 'Please confirm the transaction...',
        });

        const tx = await writeContractAsync({
          address: CONTRACT_ADDRESSES.ValidatorRewards as `0x${string}`,
          abi: VALIDATOR_REWARDS_ABI,
          functionName: 'submitProof',
          args: [validatorAddress as `0x${string}`],
        });

        setTxHash(tx);

        toast({
          title: 'Proof Submitted!',
          description: 'Verification proof has been recorded on-chain.',
        });

        return tx;
      } catch (error: any) {
        console.error('Error submitting proof:', error);

        let errorMessage = 'Failed to submit proof';
        if (error?.message?.includes('user rejected')) {
          errorMessage = 'Transaction was rejected';
        } else if (error?.message?.includes('Not authorized')) {
          errorMessage = 'You are not authorized to submit proofs';
        }

        toast({
          title: 'Transaction Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [writeContractAsync, toast]
  );

  return {
    submitProof,
    isPending: isPending || isConfirming,
    isConfirmed,
    txHash,
  };
}

// Hook for all validators leaderboard data - works with V1 contract
// Note: V1 ValidatorRewards doesn't have getActiveValidators, so we use storage + contract data
export function useValidatorsLeaderboard() {
  const [validators, setValidators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validatorAddresses, setValidatorAddresses] = useState<string[]>([]);
  const { address: currentAddress } = useAccount();

  // Get validator addresses from storage
  useEffect(() => {
    try {
      const storedValidators = getStoredValidators();
      
      if (currentAddress) {
        registerValidator(currentAddress);
      }
      
      const addresses = Array.from(
        new Set([
          ...storedValidators.map(v => v.address),
          ...(currentAddress ? [currentAddress] : [])
        ])
      );
      
      setValidatorAddresses(addresses);
    } catch (error) {
      console.error('Error loading validator addresses:', error);
      setValidatorAddresses([]);
    }
  }, [currentAddress]);

  // Create contract calls for each validator (rewards + verified count)
  const validatorCalls = validatorAddresses.length > 0
    ? validatorAddresses.flatMap((addr: string) => [
        {
          address: CONTRACT_ADDRESSES.ValidatorRewards as `0x${string}`,
          abi: VALIDATOR_REWARDS_ABI,
          functionName: 'getPendingRewards' as const,
          args: [addr as `0x${string}`],
        },
        {
          address: CONTRACT_ADDRESSES.ValidatorRewards as `0x${string}`,
          abi: VALIDATOR_REWARDS_ABI,
          functionName: 'getVerifiedProofsCount' as const,
          args: [addr as `0x${string}`],
        },
      ])
    : [];

  // Fetch all validator data using batch read
  const { data: validatorsData } = useReadContracts({
    contracts: validatorCalls,
    query: {
      enabled: validatorCalls.length > 0,
    },
  });

  // Process fetched validators
  useEffect(() => {
    if (!validatorsData || validatorsData.length === 0 || validatorAddresses.length === 0) {
      if (validatorAddresses.length === 0) {
        setValidators([]);
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      const fetchedValidators: any[] = [];
      const now = Date.now();
      
      // Process results in pairs (rewards, verifiedCount)
      for (let i = 0; i < validatorAddresses.length; i++) {
        const rewardsIndex = i * 2;
        const countIndex = i * 2 + 1;
        const validatorAddress = validatorAddresses[i];
        
        if (rewardsIndex < validatorsData.length && countIndex < validatorsData.length) {
          const rewardsResult = validatorsData[rewardsIndex];
          const countResult = validatorsData[countIndex];
          
          if (rewardsResult.status === 'success' && countResult.status === 'success') {
            try {
              const pendingRewards = rewardsResult.result as bigint;
              const verifiedCount = countResult.result as bigint;
              
              const rewardsNum = Number(formatUnits(pendingRewards, 18));
              const verifiedCountNum = Number(verifiedCount);
              
              // Get storage data for additional info
              const storedValidators = getStoredValidators();
              const stored = storedValidators.find(v => v.address.toLowerCase() === validatorAddress.toLowerCase());
              
              const daysSinceJoined = stored 
                ? Math.floor((now - stored.firstSeen) / (24 * 60 * 60 * 1000))
                : 0;
              
              // Calculate success rate
              const successRate = verifiedCountNum > 0
                ? Math.min(95, 85 + (verifiedCountNum / 100)).toFixed(1)
                : '0';
              
              // Calculate reputation
              const reputation = calculateReputationScore(verifiedCountNum, parseFloat(successRate), daysSinceJoined);
              
              fetchedValidators.push({
                address: validatorAddress,
                verifiedProofsCount: verifiedCountNum,
                totalRewards: rewardsNum.toFixed(2),
                pendingRewards: rewardsNum.toFixed(2),
                avgRewardPerProof: verifiedCountNum > 0 
                  ? (rewardsNum / verifiedCountNum).toFixed(2)
                  : '0',
                reputation,
                isActive: stored ? (now - stored.lastUpdated) < (7 * 24 * 60 * 60 * 1000) : true,
                rank: 0,
                daysSinceJoined,
                successRate,
                joinedDate: stored?.firstSeen || now,
                lastActivityDate: stored?.lastUpdated || now,
              });
            } catch (error) {
              console.error(`Error processing validator ${validatorAddress}:`, error);
            }
          }
        }
      }
      
      // Sort by verified proofs count and assign ranks
      fetchedValidators.sort((a, b) => b.verifiedProofsCount - a.verifiedProofsCount);
      fetchedValidators.forEach((v, i) => v.rank = i + 1);
      
      setValidators(fetchedValidators);
    } catch (error) {
      console.error('Error processing validators:', error);
    } finally {
      setIsLoading(false);
    }
  }, [validatorsData, validatorAddresses]);

  const refetch = useCallback(() => {
    // Trigger re-fetch by updating addresses
    try {
      const storedValidators = getStoredValidators();
      
      if (currentAddress) {
        registerValidator(currentAddress);
      }
      
      const addresses = Array.from(
        new Set([
          ...storedValidators.map(v => v.address),
          ...(currentAddress ? [currentAddress] : [])
        ])
      );
      
      setValidatorAddresses(addresses);
    } catch (error) {
      console.error('Error loading validator addresses:', error);
    }
  }, [currentAddress]);

  return {
    validators,
    isLoading,
    refetch,
  };
}

// Hook for validator statistics
export function useValidatorStats() {
  const { address } = useAccount();
  const { pendingRewards, verifiedProofsCount, rewardPerProof } = useValidatorRewards();

  // Calculate additional stats
  const totalEarnings = (verifiedProofsCount * parseFloat(rewardPerProof)).toFixed(2);
  const avgRewardPerProof = verifiedProofsCount > 0
    ? (parseFloat(totalEarnings) / verifiedProofsCount).toFixed(2)
    : '0';

  // Calculate success rate from verified proofs
  // In a real system, this would track failed vs successful verifications
  // For now, we assume high success rate if validator has verified proofs
  const successRate = verifiedProofsCount > 0
    ? Math.min(95, 85 + (verifiedProofsCount / 100)).toFixed(1) // Higher success rate for more experienced validators
    : '0';

  return {
    pendingRewards,
    verifiedProofsCount,
    rewardPerProof,
    totalEarnings,
    avgRewardPerProof,
    successRate,
    hasRewards: parseFloat(pendingRewards) > 0,
  };
}

// Hook for auto-refresh
export function useAutoRefreshValidators(interval: number = 30000) {
  const { refetch } = useValidatorRewards();

  useEffect(() => {
    const timer = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(timer);
  }, [refetch, interval]);
}

