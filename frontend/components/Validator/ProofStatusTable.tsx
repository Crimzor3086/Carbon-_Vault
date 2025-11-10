'use client'

import { CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

interface Proof {
  id: number
  projectId: string
  status: 'pending' | 'verified' | 'rejected'
  submittedAt: Date
  verifiedAt: Date | null
  reward: number
}

interface ProofStatusTableProps {
  proofs: Proof[]
}

export function ProofStatusTable({ proofs }: ProofStatusTableProps) {
  const getStatusIcon = (status: Proof['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} className="text-primary-green" />
      case 'pending':
        return <Clock size={16} className="text-primary-yellow" />
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />
    }
  }

  const getStatusColor = (status: Proof['status']) => {
    switch (status) {
      case 'verified':
        return 'text-primary-green'
      case 'pending':
        return 'text-primary-yellow'
      case 'rejected':
        return 'text-red-500'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Project ID
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Submitted
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Verified
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Reward
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {proofs.map((proof) => (
            <tr
              key={proof.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="py-3 px-4">
                <span className="font-medium text-gray-900 dark:text-white">
                  {proof.projectId}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(proof.status)}
                  <span className={clsx('text-sm font-medium capitalize', getStatusColor(proof.status))}>
                    {proof.status}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                {proof.submittedAt.toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                {proof.verifiedAt ? proof.verifiedAt.toLocaleDateString() : '-'}
              </td>
              <td className="py-3 px-4">
                <span className="font-semibold text-primary-yellow">
                  {proof.reward > 0 ? `${proof.reward} CVT` : '-'}
                </span>
              </td>
              <td className="py-3 px-4">
                <button className="p-1 text-primary-blue hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <ExternalLink size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

