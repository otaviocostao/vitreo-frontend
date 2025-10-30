import React from 'react'

type StyledInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const StyledInput: React.FC<StyledInputProps> = (props) => {
  return (
    <input
        {...props}
        value={props.value || ''}
        className="
            w-full px-2 py-1 bg-white border border-gray-300 rounded-sm
            text-sm text-gray-700 placeholder-gray-400
            focus:outline-none focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500
        "
    />
  )
}

export default StyledInput
