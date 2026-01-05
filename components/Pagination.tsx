
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    // Always show first, last, current, and neighbors
    // Simplified logic for cleaner mobile look:
    // If total pages < 7, show all.
    // Else show 1, ..., current-1, current, current+1, ..., total
    
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4 fade-in-up">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full border border-brand-accent/30 text-brand-text-primary hover:bg-brand-accent hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-text-primary transition-all"
        aria-label="Previous Page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                currentPage === page
                  ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20'
                  : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-card'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="text-brand-text-secondary px-1">...</span>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border border-brand-accent/30 text-brand-text-primary hover:bg-brand-accent hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-text-primary transition-all"
        aria-label="Next Page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>
  );
};

export default Pagination;
