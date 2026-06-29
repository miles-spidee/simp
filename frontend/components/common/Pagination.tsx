import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-6 pb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-700 bg-[#1E1E1E] text-slate-300 transition-all font-bold text-sm
          ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white cursor-pointer'}`}
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="text-slate-300 font-medium text-sm">
        Page {currentPage} {totalPages > 1 ? `of ${totalPages}` : ''}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-700 bg-[#1E1E1E] text-slate-300 transition-all font-bold text-sm
          ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white cursor-pointer'}`}
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
