import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginationArray: number[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setpageSize: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  paginationArray,
  setCurrentPage,
  setpageSize,
  pageSize,
}: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex flex-row items-baseline justify-between border">
      <div className="flex  shadow-lg p-2 items-center justify-center space-x-2 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Prev
        </button>
        <div className="bg-white">
          {paginationArray.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md border ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>

      <div>
        <select
          onChange={(e) => setpageSize(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pageSize}
        >
          <option>Select No of Pages</option>
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={6}>6</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
        </select>
      </div>
    </div>
  );
}
