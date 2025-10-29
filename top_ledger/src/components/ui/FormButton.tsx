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
      className="bg-[var(--blue_color)] hover:bg-[var(--orange_color)] text-[var(--light_color)] font-bold w-full py-3 rounded-lg transition-colors duration-200"
    >
    {loading ? loadingText : children}
  </button>
  );
}
