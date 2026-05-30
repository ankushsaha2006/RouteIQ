// src/components/ui/DataTable.tsx
import React, { useState } from 'react';
import { Input } from './input';
import { Search } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  onRowClick,
  className = ''
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = searchable
    ? data.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;
  
  return (
    <div className={className}>
      {searchable && (
        <div className="mb-4">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : String(row[column.key])
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
