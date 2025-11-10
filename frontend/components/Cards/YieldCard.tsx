'use client'

import { TrendingUp, Clock, DollarSign } from 'lucide-react'
import { useAccount } from 'wagmi'

interface YieldCardProps {
  currentYield: number
  apy: number
  pendingRewards: number
}

export function YieldCard({ currentYield, apy, pendingRewards }: YieldCardProps) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Connect your wallet to view yield
        </p>
      </div>
    )
  }

  const apyColor = apy > 0 ? 'text-primary-green' : 'text-gray-500'
  const yieldColor = currentYield > 0 ? 'text-primary-green' : 'text-gray-500'
  const pendingColor = pendingRewards > 0 ? 'text-primary-yellow' : 'text-gray-500'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <TrendingUp size={20} />
          <span>Yield & Rewards</span>
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className={yieldColor} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Current Yield</span>
          </div>
          <span className={`text-lg font-bold ${yieldColor}`}>
            {currentYield.toLocaleString()} CVT
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className={apyColor} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              APY
              <span className="ml-1 text-xs" title="Annual Percentage Yield">
                ℹ️
              </span>
            </span>
          </div>
          <span className={`text-lg font-bold ${apyColor}`}>
            {apy.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock size={16} className={pendingColor} />
            <span className="text-sm text-gray-600 dark:text-gray-400">Pending Rewards</span>
          </div>
          <span className={`text-lg font-bold ${pendingColor}`}>
            {pendingRewards.toLocaleString()} CVT
          </span>
        </div>
      </div>
    </div>
  )
}

