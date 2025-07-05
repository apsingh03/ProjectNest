"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { deleteProjectAsync } from "../Redux/Slices/ProjectManagementSlice";
import NewTask from "./NewTask";
import TaskList from "./TaskList";
import ActionsMenu from "./ActionMenu";

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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenTaskEditModal, setIsOpenTaskEditModal] = useState(false);
  const [taskEditDetails, settaskEditDetails] = useState({
    id: null,
    title: null,
    description: null,
    status: null,
    // dueDate: null,
  });

  const [whichTaskMenu, setwhichTaskMenu] = useState({ id: null });

  const handleDeleteProject = async (id) => {
    try {
      if (window.confirm("Do you want to Delete Project ")) {
        await dispatch(deleteProjectAsync({ id }));
      }
    } catch (error) {
      console.log("Error - ", error);
    }
    setShowMenu(false);
  };

  const handleEditProject = async (id, title, description, status) => {
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

  // console.log("project", project);
  return (
    <>
      <div className=" p-6 hover:shadow-lg transition-shadow duration-200  bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link to={`/projects/${project.id}`} className="group">
              <h3
                className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors cursor-pointer"
                title="Project Title"
              >
                {project.id} {project.title}
              </h3>
            </Link>

            <p
              className="text-gray-600 text-sm mt-1 line-clamp-2"
              title="Project Description"
            >
              {project.description}
            </p>
          </div>
          <div className="relative">
            <button
              title="Project Menu"
              onClick={() => setwhichTaskMenu({ id: project.id })}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer "
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            {whichTaskMenu.id === project.id && (
              <ActionsMenu
                showMenu={whichTaskMenu.id === project.id}
                setShowMenu={setwhichTaskMenu}
                project={project}
                handleEdit={handleEditProject}
                handleDelete={handleDeleteProject}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span
              title="Project Status"
              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {project.status === "active" ? "Active" : "Completed"}
            </span>

            <div
              className="flex items-center text-xs text-gray-500"
              title="Project Date"
            >
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(dummyDate.createdAt), "MMM d, yyyy")}
            </div>
            <div className="m-3" onClick={() => setIsOpenModal(true)}>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-[15px] cursor-pointer text-white font-semibold py-2 px-2 rounded"
                title="Add Task"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        <div>
          {project.projectTask && project.projectTask?.length > 0 ? (
            <TaskList
              tasks={project && project.projectTask}
              isOpenTaskEditModal={isOpenTaskEditModal}
              setIsOpenTaskEditModal={setIsOpenTaskEditModal}
              settaskEditDetails={settaskEditDetails}
            />
          ) : (
            <div className="text-center ">
              <h6 className="text-lg font-medium text-gray-900 mb-2">
                No Tasks found
              </h6>
            </div>
          )}
        </div>
      </div>

      <NewTask
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        isOpenTaskEditModal={isOpenTaskEditModal}
        setIsOpenTaskEditModal={setIsOpenTaskEditModal}
        projectId={project?.id}
        settaskEditDetails={settaskEditDetails}
        taskEditDetails={taskEditDetails}
      />
    </>
  );
}
