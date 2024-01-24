import React from 'react';
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    return (
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-base h-10">
          <li>
            <button
              type="button"
              className="flex items-center justify-center px-4 h-10 leading-tight text-black bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-black dark:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-100 dark:hover:text-black"
              onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            >
              Previous
            </button>
          </li>
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                type="button"
                className={`flex items-center justify-center px-4 h-10 leading-tight ${
                  number === currentPage
                    ? 'text-white bg-gray-800'
                    : 'text-black bg-white border border-gray-300 hover:bg-gray-100 hover:text-black dark:bg-gray-100 dark:border-gray-700 dark:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-black'
                }`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="flex items-center justify-center px-4 h-10 leading-tight text-black bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-black dark:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-100 dark:hover:text-black"
              onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  export default Pagination;