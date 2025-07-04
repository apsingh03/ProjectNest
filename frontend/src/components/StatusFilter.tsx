import React, { useState } from "react";
import { Filter } from "lucide-react";
import { filterByStatusProjects } from "../Redux/Slices/ProjectManagementSlice";
import { useDispatch } from "react-redux";

export default function StatusFilter({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  function handleFilterOnClick(status) {
    // console.log("handleFilterOnClick -  ", status);
    dispatch(filterByStatusProjects(status));
    onChange(status);
    // dispatch()
    setIsOpen(false);
  }

  const status = ["Pending", "Active", "Completed"];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Filter className="w-4 h-4" />
        {value || "Filter Status"}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {status.map((status) => (
              <button
                key={status}
                onClick={() => handleFilterOnClick(status)}
                className={`${
                  value === status ? "bg-gray-100" : ""
                } w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
