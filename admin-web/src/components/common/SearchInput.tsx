import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = 'Buscar...', delay = 300 }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onSearch]);

  return (
    <div className="relative rounded-xl shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gold-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        className="bg-navy-950/90 border border-gold-500/30 rounded-xl block w-full pl-9 pr-9 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-400 py-2.5 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={() => setValue('')}
            className="text-slate-400 hover:text-gold-300 focus:outline-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
