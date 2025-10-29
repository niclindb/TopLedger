import React from 'react'

interface FormInputProps {
  type: 'email' | 'password' | 'text'
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
}

export function FormInput({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  disabled = false 
}: FormInputProps) {
  return (
   <input
  type={type}
  placeholder={placeholder}
  value={value}
  onChange={onChange}
  required
  disabled={disabled}
className={`
  w-full px-3 py-2 rounded-md
  bg-[var(--tan_color)] text-[var(--background)]
  border-2 border-[var(--orange_color)]
  placeholder:text-[var(--background)]
  focus:outline-none focus:border-[var(--blue_color)] focus:ring-2 focus:ring-[var(--blue_color)]
  transition-colors duration-300
  disabled:opacity-50 disabled:cursor-not-allowed
`}

/>

  )
}
