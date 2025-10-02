import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ErrorPopupProps {
  title?: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  title = "Ocorreu um Erro",
  message,
  onClose,
  duration = 5000,
}) => {

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div 
      className="fixed top-6 right-6 w-full max-w-sm p-4 bg-red-100 border border-red-300 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-4"
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        
        <div className="ml-3 flex-1">
          <p className="text-sm font-bold text-red-800">{title}</p>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex rounded-md p-1 text-red-500 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 cursor-pointer"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;