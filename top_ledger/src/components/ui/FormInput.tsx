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
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  )
}
