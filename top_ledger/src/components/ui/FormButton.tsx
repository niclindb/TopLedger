import React from 'react'

interface FormButtonProps {
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  children: React.ReactNode  // what is inside the component
}

export function FormButton({
  disabled = false, 
  loading = false, 
  loadingText = 'Loading...',
  children,
}: FormButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      type="submit"
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? loadingText : children}
    </button>
  )
}
