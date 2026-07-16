import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ease-in-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      
      <div 
        className={`relative w-full max-w-lg md:max-w-xl h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform border-l border-gray-100 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
