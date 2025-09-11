interface PriceInputProps{
    label: string,
    placeholder?: string
}

const PriceInput = (props:PriceInputProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
        <label className="font-normal text-gray-700 text-sm">{props.label}</label>

        <input
            type="text"
            placeholder={props.placeholder}
            className="
                block w-28 px-2 py-1.5 bg-white border border-gray-300 rounded-md
                text-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                "
            />
    </div>
  )
}

export default PriceInput
