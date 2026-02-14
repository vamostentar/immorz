
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface OfferStatusDropdownProps {
  value: 'for_sale' | 'for_rent' | 'sold';
  onChange: (value: 'for_sale' | 'for_rent' | 'sold') => void;
  disabled?: boolean;
  className?: string;
}

const statusOptions = [
  { value: 'for_sale' as const, label: 'Para Venda', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', dotColor: 'bg-emerald-500' },
  { value: 'for_rent' as const, label: 'Para Arrendar', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', dotColor: 'bg-amber-500' },
  { value: 'sold' as const, label: 'Vendido', color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', dotColor: 'bg-rose-500' },
];

export function OfferStatusDropdown({ value, onChange, disabled = false, className = '' }: OfferStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = statusOptions.find(option => option.value === value) || statusOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: 'for_sale' | 'for_rent' | 'sold') => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full min-w-[120px] px-2 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200
          flex items-center justify-between gap-2
          ${selectedOption.bgColor} ${selectedOption.borderColor} ${selectedOption.color}
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-sm hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
          }
        `}
      >
        <span className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${selectedOption.dotColor}`} />
          {selectedOption.label}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-2 py-1.5 text-xs text-left transition-colors duration-150
                flex items-center justify-between gap-2
                ${option.bgColor} ${option.color}
                hover:bg-opacity-80 focus:outline-none focus:bg-opacity-80
                ${value === option.value ? 'font-semibold' : 'font-normal'}
              `}
            >
              <span className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${option.dotColor}`} />
                {option.label}
              </span>
              {value === option.value && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
