"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { deleteProjectAsync } from "../Redux/Slices/ProjectManagement";

interface Project {
  id: number;
  title: string;
  description: string;
  status: "active" | "completed";
  createdAt: string;
  tasks?: { id: number; status: string }[];
}

interface ProjectEditDetails {
  id: number | null;
  title: string | null;
  description: string | null;
  status: string | null;
}

interface ProjectCardProps {
  project: Project;
  setIsOpenEditModal: (isOpen: boolean) => void;
  setprojectEditDetails: React.Dispatch<
    React.SetStateAction<ProjectEditDetails>
  >;
}
export default function ProjectCard({
  project,
  setIsOpenEditModal,
  setprojectEditDetails,
}: ProjectCardProps) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProjectAsync({ id }));
    } catch (error) {
      console.log("Error - ", error);
    }
    setShowMenu(false);
  };

  const handleEdit = async (id, title, description, status) => {
    try {
      setIsOpenEditModal(true);

      setprojectEditDetails({
        id,
        title,
        description,
        status,
      });
    } catch (error) {
      console.log("Error - ", error);
    }
    setShowMenu(false);
  };

  const dummyDate = {
    createdAt: "2024-07-01T12:00:00Z", // ✅ ISO string
  };
  return (
    <>
      <div className=" p-6 hover:shadow-lg transition-shadow duration-200  bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link to={`/projects/${project.id}`} className="group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors cursor-pointer">
                {project.title}
              </h3>
            </Link>

            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32">
                  <button
                    onClick={() =>
                      handleEdit(
                        project.id,
                        project.title,
                        project.description,
                        project.status
                      )
                    }
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {project.status === "active" ? "Active" : "Completed"}
            </span>

            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(dummyDate.createdAt), "MMM d, yyyy")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
