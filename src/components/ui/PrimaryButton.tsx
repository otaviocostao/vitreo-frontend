import React, { type ReactNode } from 'react'

interface BlueButtonProps{
    title: String;
    icon?: ReactNode;
}

const PrimaryButton = (props: BlueButtonProps) => {
  return (
        <button className='
            flex py-2 px-4 items-center justify-center gap-1
            w-30 text-white bg-blue-600 box-border rounded-md text-sm cursor-pointer hover:bg-blue-500 transition-colors
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        '>{props.icon} {props.title}</button>
  )
}

export default PrimaryButton