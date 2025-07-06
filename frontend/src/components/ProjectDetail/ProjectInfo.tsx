import React from "react";
import type { Project } from "../../Redux/Slices/ProjectManagementSlice";
interface TaskStatusTypes {
  todoLen: number | null;
  inProgressLen: number | null;
  doneLen: number | null;
}

interface ProjectInfoProps {
  project: Project | null;
  taskStatus: TaskStatusTypes;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project, taskStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {project && project.title}
            </h1>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
              Active
            </span>
          </div>
          <p className="text-gray-600 mb-4">{project && project.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Created on - XYZ
          </div>
        </div>

        {/* Progress and Stats */}
        <div className="lg:w-80">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="grid grid-cols-3 gap-2 lg:gap-3">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-yellow-600 mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div className="text-lg font-semibold text-yellow-900">
                  {taskStatus.todoLen}
                </div>
                <div className="text-xs text-yellow-700">To Do</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600 mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-lg font-semibold text-blue-900">
                  {taskStatus.inProgressLen}
                </div>
                <div className="text-xs text-blue-700">In Progress</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600 mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-lg font-semibold text-green-900">
                  {taskStatus.doneLen}
                </div>
                <div className="text-xs text-green-700">Done</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
