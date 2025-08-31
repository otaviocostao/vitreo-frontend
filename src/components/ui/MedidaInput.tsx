import StyledInput from './StyledInput';

const MedidaInput = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center justify-between gap-2">
        <label className="font-normal text-gray-700 text-sm">{label}:</label>
        <div className="w-18">
            <StyledInput />
        </div>
    </div>
);
}

export default MedidaInput