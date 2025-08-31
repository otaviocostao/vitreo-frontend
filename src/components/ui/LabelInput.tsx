interface LabelInputProps {
    label: string;
    placeholder?: string;
}

const LabelInput = (props: LabelInputProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
        <label className="font-semibold text-gray-600 text-sm">{props.label}</label>

        <input
            type="text"
            placeholder={props.placeholder}
            className="
                flex-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md
                text-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                "
            />
    </div>
  )
}

export default LabelInput