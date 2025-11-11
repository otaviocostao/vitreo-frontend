import React from 'react';
import Button from './Button';
import { AlertTriangle, X } from 'lucide-react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string | null;
}

const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 p-4 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">
            {message} <strong className="text-gray-900">"{itemName}"</strong>? 
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 p-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Aviso</p>
            <p className="mt-1 text-sm text-red-700">
              Esta ação é permanente e não poderá ser desfeita depois.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;