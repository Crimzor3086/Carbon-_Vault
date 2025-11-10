'use client'

import { MainLayout } from '@/components/Layout/MainLayout'
import { FileText, Download } from 'lucide-react'

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate and download compliance reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <FileText size={24} className="text-primary-green" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                ESG Report
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Generate comprehensive ESG compliance reports for your carbon offset portfolio.
            </p>
            <button className="w-full px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-600 transition-colors">
              Generate Report
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <FileText size={24} className="text-primary-blue" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                ZK Proof Report
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Download ZK proof verification documents for your validated carbon offsets.
            </p>
            <button className="w-full px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

