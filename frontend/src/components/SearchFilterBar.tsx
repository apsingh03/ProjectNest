import React from "react";
import { Search } from "lucide-react";
import StatusFilter from "./StatusFilter";

interface SearchFilterBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchInput,
  setSearchInput,
  status,
  setStatus,
}) => {
  return (
    <div className="mb-6 flex flex-row justify-between items-center gap-4">
      <div className="relative flex-1">
        {/* ✅ flex-1 so it expands */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search Projects by title"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full border pl-10 py-3 bg-white shadow-lg border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="p-4">
        {/* Assuming StatusFilter is already typed */}
        <StatusFilter value={status} onChange={setStatus} />
      </div>
    </div>
  );
};

export default SearchFilterBar;
