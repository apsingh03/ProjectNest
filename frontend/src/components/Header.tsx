import React from "react";
import { LogOut, User, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedOutAsync } from "../Redux/Slices/UserAuth";
const Header = () => {
  const userLoggedData = useSelector(
    (state) => state?.client_auth?.userDetails
  );

  const dispatch = useDispatch();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ProjectHub</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-700">
              <User className="w-4 h-4 mr-2" />{" "}
              {userLoggedData && userLoggedData?.email}
              <span className="font-medium"></span>
            </div>
            {userLoggedData && userLoggedData && (
              <button
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                onClick={() => dispatch(getLoggedOutAsync())}
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="text-sm">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
