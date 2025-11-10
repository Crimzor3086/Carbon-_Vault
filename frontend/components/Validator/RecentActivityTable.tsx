'use client'

import { FileText, Gift, ArrowRight } from 'lucide-react'

interface Activity {
  id: number
  type: 'proof_submitted' | 'reward_distributed'
  projectId: string
  timestamp: Date
  reward: number
}

interface RecentActivityTableProps {
  activity: Activity[]
}

export function RecentActivityTable({ activity }: RecentActivityTableProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'proof_submitted':
        return <FileText size={16} className="text-primary-blue" />
      case 'reward_distributed':
        return <Gift size={16} className="text-primary-yellow" />
    }
  }

  const getActivityLabel = (type: Activity['type']) => {
    switch (type) {
      case 'proof_submitted':
        return 'Proof Submitted'
      case 'reward_distributed':
        return 'Reward Distributed'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Activity
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Project ID
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Reward
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {activity.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  {getActivityIcon(item.type)}
                  <span className="text-sm text-gray-900 dark:text-white">
                    {getActivityLabel(item.type)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.projectId}
                </span>
              </td>
              <td className="py-3 px-4">
                {item.reward > 0 ? (
                  <span className="text-sm font-semibold text-primary-yellow">
                    {item.reward} CVT
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                {item.timestamp.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

