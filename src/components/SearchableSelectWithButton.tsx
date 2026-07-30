import Select from 'react-select';
import type { SingleValue } from 'react-select';
import Button from './ui/Button';

interface SearchableSelectWithButtonProps {
  label: string;
  options: { value: string; label: string }[];
  value: SingleValue<{ value: string; label: string }>;
  onChange: (selectedOption: SingleValue<{ value: string; label: string }>) => void;
  onButtonClick: () => void; 
  buttonIcon: React.ReactNode;
  placeholder?: string;
  inputValue?: string;
  onInputChange?: (inputValue: string, actionMeta: { action: string }) => void;
  onMenuClose?: () => void;
  isLoading?: boolean;
}

const SearchableSelectWithButton: React.FC<SearchableSelectWithButtonProps> = ({
  label,
  options,
  value,
  onChange,
  onButtonClick,
  buttonIcon,
  placeholder = "Selecione ou digite para buscar...",
  isLoading = false,
  inputValue,
  onInputChange,
  onMenuClose
}) => {
  return (
    <div className='flex-1'>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative flex items-center">
        <div className="flex-grow">
          <Select
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isLoading={isLoading}
            isClearable
            inputValue={inputValue}
            onInputChange={(inputValue, actionMeta) => {
              if (onInputChange) {
                onInputChange(inputValue, actionMeta);
              }
            }}
            onMenuClose={onMenuClose}
            filterOption={() => true}
            noOptionsMessage={() => "Nenhum resultado encontrado"}
            className='border-gray-300 text-sm text-gray-700 placeholder-gray-400 '
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: 'none',
              }),
            }}
          />
        </div>
        <Button
          type='button'
          variant='secondary'
          onClick={onButtonClick}
          className="ml-2"
          aria-label="Adicionar novo"
        >
          {buttonIcon}
        </Button>
      </div>
    </div>
  );
};

export default SearchableSelectWithButton;