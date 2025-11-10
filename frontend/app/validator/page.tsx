'use client'

import { MainLayout } from '@/components/Layout/MainLayout'
import { ProofSubmissionForm } from '@/components/Validator/ProofSubmissionForm'
import { ProofStatusTable } from '@/components/Validator/ProofStatusTable'
import { RewardTrackerCard } from '@/components/Validator/RewardTrackerCard'
import { RecentActivityTable } from '@/components/Validator/RecentActivityTable'

// Mock data
const mockProofs = [
  {
    id: 1,
    projectId: 'PROJ-001',
    status: 'verified',
    submittedAt: new Date('2024-01-15'),
    verifiedAt: new Date('2024-01-15'),
    reward: 10,
  },
  {
    id: 2,
    projectId: 'PROJ-002',
    status: 'pending',
    submittedAt: new Date('2024-01-16'),
    verifiedAt: null,
    reward: 0,
  },
]

const mockActivity = [
  {
    id: 1,
    type: 'proof_submitted',
    projectId: 'PROJ-002',
    timestamp: new Date('2024-01-16'),
    reward: 0,
  },
  {
    id: 2,
    type: 'reward_distributed',
    projectId: 'PROJ-001',
    timestamp: new Date('2024-01-15'),
    reward: 10,
  },
]

export default function ValidatorPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Validator Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Submit verification proofs and track rewards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProofSubmissionForm />
          </div>
          <RewardTrackerCard totalRewards={50} pendingRewards={10} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Proof Status
          </h2>
          <ProofStatusTable proofs={mockProofs} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <RecentActivityTable activity={mockActivity} />
        </div>
      </div>
    </MainLayout>
  )
}

