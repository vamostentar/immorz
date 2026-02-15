import type { Property } from '@/types';
import { useMemo, useState } from 'react';

export type FiltersState = {
  q: string;
  status: 'all' | 'for_sale' | 'for_rent' | 'sold';
};

export function useFilteredProperties(properties: Property[]) {
  const [filters, setFilters] = useState<FiltersState>({ q: '', status: 'all' });
  const filtered = useMemo(() => {
    const term = filters.q.trim().toLowerCase();
    return properties.filter((p) => {
      const matchesTerm = term
        ? [p.title, p.location, p.description].some((f) => (f || '').toLowerCase().includes(term))
        : true;
      const matchesStatus = filters.status === 'all' ? true : p.status === filters.status;
      return matchesTerm && matchesStatus;
    });
  }, [properties, filters]);
  return { filters, setFilters, filtered };
}

export function Filters({ value, onChange }: { value: FiltersState; onChange: (f: FiltersState) => void }) {
  return (
    <div className="glass p-2 rounded-[2rem] shadow-2xl border border-white/40 group transition-all duration-500 hover:shadow-blue-500/10">
      <div className="bg-white rounded-[1.8rem] p-3 md:p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="flex-1">
          <div className="relative group/input">
            <input
              value={value.q}
              onChange={(e) => onChange({ ...value, q: e.target.value })}
              placeholder="Localização, tipo ou descrição..."
              className="w-full bg-gray-50/50 border-none rounded-2xl pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 transition-transform group-focus-within/input:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          <div className="relative min-w-[180px]">
            <select
              value={value.status}
              onChange={(e) => onChange({ ...value, status: e.target.value as FiltersState['status'] })}
              className="w-full bg-gray-50/50 border-none rounded-2xl pl-10 pr-10 py-4 text-gray-700 font-medium appearance-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
            >
              <option value="all">Todos os imóveis</option>
              <option value="for_sale">À venda</option>
              <option value="for_rent">Para alugar</option>
              <option value="sold">Vendido</option>
            </select>
            <svg className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <svg className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <button 
            onClick={() => onChange({ q: '', status: 'all' })}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all duration-300 font-semibold"
            title="Limpar filtros"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="sm:hidden">Limpar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
