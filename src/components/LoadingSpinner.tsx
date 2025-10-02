import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: string;
  text?: string;
  overlay?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'h-16 w-16',
  text = 'Carregando...',
  overlay = false,
  className = '',
}) => {

  const baseContainerClasses = 'flex flex-col items-center justify-center gap-4';

  const overlayClasses = overlay
    ? 'absolute inset-0 bg-white/70 backdrop-blur-sm z-30'
    : '';

  const containerFinalClasses = `${baseContainerClasses} ${overlayClasses} ${className}`;

  const spinnerClasses = `animate-spin text-blue-600 ${size}`;
  
  return (
    <div className={containerFinalClasses}>
      <Loader2 className={spinnerClasses} />
      {text && <p className="text-sm font-medium text-gray-700 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;