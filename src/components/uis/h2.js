import React from 'react'

function H2({text,className,variant="primary"}) {
  const variants = {
    primary: 'font-bold text-lg py-2 text-gray-900',
    secondary: 'text-xl text-gray-700 mb-2',
    danger: 'text-red-600',
  }
  return (
    <h2 className={`${variants[variant]} ${className}`}>
      {text}
    </h2>
  )
}

export default H2
