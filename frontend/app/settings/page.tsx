'use client'

import { MainLayout } from '@/components/Layout/MainLayout'
import { Settings as SettingsIcon, Bell, Shield, Globe } from 'lucide-react'

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Bell size={20} className="text-primary-blue" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-gray-700 dark:text-gray-300">Email notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-gray-700 dark:text-gray-300">Transaction alerts</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700 dark:text-gray-300">Reward notifications</span>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Shield size={20} className="text-primary-green" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security
              </h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                Two-Factor Authentication
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Globe size={20} className="text-primary-yellow" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Network
              </h3>
            </div>
            <div className="space-y-3">
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option>Mantle Network</option>
                <option>Mantle Sepolia Testnet</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

