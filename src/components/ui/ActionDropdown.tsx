import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, Pencil, Trash2, Ban, Check } from 'lucide-react';

interface ActionDropdownProps {
  onEdit: () => void;
  onDelete?: () => void;
  isActive?: boolean;
  onDeactivate?: () => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ onEdit, onDelete, isActive = true, onDeactivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.right - 128,
      });
    } else {
      setCoords(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedInsideButton = dropdownRef.current && dropdownRef.current.contains(target);
      const clickedInsideMenu = menuRef.current && menuRef.current.contains(target);

      if (!clickedInsideButton && !clickedInsideMenu) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete?.();
  };

  const handleDeactivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDeactivate?.();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center justify-center w-8 h-8 rounded-md text-gray-700 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none cursor-pointer"
        aria-label="Ações"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && coords && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: '128px',
          }}
          className="rounded-md shadow-lg bg-white ring-1 ring-black/5 divide-y divide-gray-100 z-50 focus:outline-none"
        >
          <div className="py-1">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150 cursor-pointer text-left font-medium"
            >
              <Pencil className="w-3.5 h-3.5 text-gray-600" />
              <span>Editar</span>
            </button>
            {onDeactivate && (
              <button
                onClick={handleDeactivate}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150 cursor-pointer text-left font-medium"
              >
                {isActive !== false ? (
                  <>
                    <Ban className="w-3.5 h-3.5 text-gray-600" />
                    <span>Desativar</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-gray-600" />
                    <span>Ativar</span>
                  </>
                )}
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150 cursor-pointer text-left font-medium"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-600" />
                <span>Deletar</span>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ActionDropdown;
