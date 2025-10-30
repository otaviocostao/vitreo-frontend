import StyledInput from './StyledInput';

interface MedidaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const MedidaInput: React.FC<MedidaInputProps> = ({ label, ...rest }) => {
  return (
    <div className="flex flex-1 gap-2 justify-end items-end">
        <label htmlFor={rest.id || rest.name} className="font-medium text-gray-700 text-sm">
            {label}:
        </label>
        <div className="w-20">
            <StyledInput {...rest} type="number" step="0.01" className=" flex w-full" />
        </div>
    </div>
);
}

export default MedidaInput