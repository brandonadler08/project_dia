import React, { useState } from 'react';

export interface Column<T> {
  header: string;
  accessor: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowSelect?: (selectedRows: T[]) => void;
  isLoading?: boolean;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  onRowSelect,
  isLoading = false,
}: DataTableProps<T>) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const all = data.map((_, i) => i);
      setSelectedIndices(all);
      onRowSelect?.(data);
    } else {
      setSelectedIndices([]);
      onRowSelect?.([]);
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelected = selectedIndices.includes(index)
      ? selectedIndices.filter((i) => i !== index)
      : [...selectedIndices, index];
    setSelectedIndices(newSelected);
    onRowSelect?.(newSelected.map((i) => data[i]));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-gold-400">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gold-400 border-t-transparent mr-2.5" />
        <span className="text-xs font-medium">Cargando registros...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gold-500/20 bg-[#131E3A]">
      <table className="min-w-full divide-y divide-gold-500/10 text-left text-xs">
        <thead className="bg-[#10182E]">
          <tr>
            {onRowSelect && (
              <th scope="col" className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={data.length > 0 && selectedIndices.length === data.length}
                  className="rounded border-gold-500/40 text-gold-500 focus:ring-0 bg-[#0B1120]"
                />
              </th>
            )}
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-4 py-3 text-[11px] font-bold text-gold-400 uppercase tracking-wider whitespace-nowrap font-mono"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-700/50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onRowSelect ? 1 : 0)}
                className="px-4 py-8 text-center text-slate-400 text-xs italic"
              >
                No hay registros disponibles
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => {
              const isSelected = selectedIndices.includes(rIdx);
              return (
                <tr
                  key={rIdx}
                  className={`transition-colors hover:bg-gold-500/[0.04] ${
                    isSelected ? 'bg-gold-500/[0.08]' : ''
                  }`}
                >
                  {onRowSelect && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rIdx)}
                        className="rounded border-gold-500/40 text-gold-500 focus:ring-0 bg-[#0B1120]"
                      />
                    </td>
                  )}
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-3 whitespace-nowrap text-slate-200"
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
