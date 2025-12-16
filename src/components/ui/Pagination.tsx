'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  showItemsInfo?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  showItemsInfo = true,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
      {/* Items info */}
      {showItemsInfo && totalItems > 0 && (
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Showing <span className='font-medium'>{startItem}</span> to{' '}
          <span className='font-medium'>{endItem}</span> of{' '}
          <span className='font-medium'>{totalItems}</span> results
        </p>
      )}

      {/* Pagination controls */}
      <nav className='flex items-center gap-1'>
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='flex cursor-pointer items-center justify-center h-9 w-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
          <span className='material-symbols-outlined text-lg'>
            chevron_left
          </span>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className='flex cursor-pointer items-center justify-center h-9 w-9 text-gray-500 dark:text-gray-400'>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`flex cursor-pointer items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}>
              {page}
            </button>
          )
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='flex cursor-pointer items-center justify-center h-9 w-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
          <span className='material-symbols-outlined text-lg'>
            chevron_right
          </span>
        </button>
      </nav>
    </div>
  );
}

// Helper hook for pagination logic
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPaginatedItems = (currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  return {
    totalItems,
    totalPages,
    getPaginatedItems,
    itemsPerPage,
  };
}
