import React from 'react'

interface TextBoxInputProps{
    label: string;
    placeholder: string
}

const TextBoxInput = (props: TextBoxInputProps) => {
  return (
    <div className="flex flex-col gap-2 box-border p-4">
        <label className="font-semibold text-gray-600 text-sm" >{props.label}</label>
        <textarea placeholder='Observações sobre o pedido...' className='px-3 py-2 bg-white border border-gray-300 rounded-md
            text-sm text-gray-700 placeholder-gray-400
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'></textarea>
    </div>
  )
}

export default TextBoxInput