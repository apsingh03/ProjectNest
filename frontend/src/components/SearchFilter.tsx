"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

interface SearchFilterProps {
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
  currentSearch: string;
  currentStatus: string;
}

export default function SearchFilter({
  onSearch,
  onStatusFilter,
  currentSearch,
  currentStatus,
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 w-full border hover:border-blue-500 pt-3.5 pb-3.5 "
        />
      </div>

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2  text-gray-400 w-4 h-4" />
        <select
          value={currentStatus}
          onChange={(e) => onStatusFilter(e.target.value)}
          className="input pl-10 pr-8 appearance-none bg-white min-w-[140px]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
