'use client'

import { Coins, TrendingUp, Clock } from 'lucide-react'

interface RewardTrackerCardProps {
  totalRewards: number
  pendingRewards: number
}

export function RewardTrackerCard({ totalRewards, pendingRewards }: RewardTrackerCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <Coins size={20} />
        <span>Reward Tracker</span>
      </h3>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Rewards</span>
            <TrendingUp size={16} className="text-primary-green" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalRewards.toLocaleString()} CVT
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Pending Rewards</span>
            <Clock size={16} className="text-primary-yellow" />
          </div>
          <p className="text-2xl font-bold text-primary-yellow">
            {pendingRewards.toLocaleString()} CVT
          </p>
        </div>

        <button className="w-full px-4 py-3 bg-primary-yellow text-white rounded-lg hover:bg-yellow-500 transition-colors">
          Claim Rewards
        </button>
      </div>
    </div>
  )
}

