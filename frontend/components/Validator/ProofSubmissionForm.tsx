'use client'

import { Upload, FileText, Send } from 'lucide-react'
import { useState } from 'react'

export function ProofSubmissionForm() {
  const [projectId, setProjectId] = useState('')
  const [emissionData, setEmissionData] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setProjectId('')
      setEmissionData('')
      setFile(null)
      alert('Proof submitted successfully!')
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <FileText size={20} />
        <span>Submit Proof</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project ID
          </label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter project ID"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Emission Data (JSON)
          </label>
          <textarea
            value={emissionData}
            onChange={(e) => setEmissionData(e.target.value)}
            placeholder='{"co2_tons": 100, "timestamp": "2024-01-15", ...}'
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload File (Optional)
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <Upload size={16} />
              <span>Choose File</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".json,.txt"
              />
            </label>
            {file && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {file.name}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !projectId || !emissionData}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Submit Proof</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

