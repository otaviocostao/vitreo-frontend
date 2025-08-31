import React from 'react'

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
        {...props}
        type="text"
        className="
            w-full px-2 py-1 bg-white border border-gray-300 rounded-md
            text-sm text-gray-700 placeholder-gray-400
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        "
    />
  )
}

export default StyledInput
