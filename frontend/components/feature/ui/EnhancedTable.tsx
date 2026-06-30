"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Filter, X, Search } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'range';
  options?: string[];
  onFilter: (data: any[], value: any) => any[];
}

interface EnhancedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filters?: FilterConfig[];
  searchPlaceholder?: string;
  itemsPerPage?: number;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  searchFields?: (keyof T)[];
}

export function EnhancedTable<T>({
  data,
  columns,
  filters = [],
  searchPlaceholder = "Search...",
  itemsPerPage = 10,
  emptyMessage = "No data found",
  loading = false,
  className = "",
  searchFields,
}: EnhancedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (searchFields) {
        filtered = filtered.filter(item =>
          searchFields.some(field => {
            const val = item[field];
            return val && String(val).toLowerCase().includes(search);
          })
        );
      } else {
        filtered = filtered.filter(item =>
          columns.some(col => {
            const value = item[col.key as keyof T] as any;
            return value && String(value).toLowerCase().includes(search);
          })
        );
      }
    }

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'all') {
        const filter = filters.find(f => f.key === key);
        if (filter?.onFilter) {
          filtered = filter.onFilter(filtered, value);
        }
      }
    });

    return filtered;
  }, [data, searchTerm, activeFilters, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const updateFilter = (key: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className={`bg-white border border-border rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border bg-slate-50/50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-all ${
                Object.keys(activeFilters).length > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-border text-text-secondary hover:bg-slate-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {Object.keys(activeFilters).length}
                </span>
              )}
            </button>
            {Object.keys(activeFilters).length > 0 && (
              <button
                onClick={clearAllFilters}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Clear all filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {isFilterOpen && filters.length > 0 && (
          <div className="mt-4 p-4 bg-white border border-border rounded-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filters.map(filter => (
                <div key={filter.key} className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {filter.label}
                  </label>
                  {filter.type === 'select' && (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => updateFilter(filter.key, e.target.value)}
                      className="w-full p-2 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="">All</option>
                      {filter.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {filter.type === 'text' && (
                    <input
                      type="text"
                      placeholder={`Filter by ${filter.label}`}
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => updateFilter(filter.key, e.target.value)}
                      className="w-full p-2 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
                    />
                  )}
                  {filter.type === 'date' && (
                    <input
                      type="date"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => updateFilter(filter.key, e.target.value)}
                      className="w-full p-2 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(activeFilters).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                <span>{filters.find(f => f.key === key)?.label}:</span>
                <span className="font-medium">{value}</span>
                <button onClick={() => clearFilter(key)} className="hover:text-blue-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.render ? column.render(item) : String(item[column.key as keyof T] as any || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-text-secondary">
                    <Search className="h-8 w-8 text-slate-300" />
                    <span>{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredData.length > itemsPerPage && (
        <div className="px-6 py-4 border-t border-border bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-border rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-4 py-2 text-sm font-medium text-text-primary">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-border rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
