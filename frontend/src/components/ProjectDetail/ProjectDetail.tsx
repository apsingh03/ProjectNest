// import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../Header";
import { useAppDispatch, useAppSelector } from "../../Hooks/hooks";
import { useEffect, useState } from "react";
import { getProjectDetailsAsync } from "../../Redux/Slices/ProjectManagementSlice";
import TaskSection from "./TaskSection";
import ProjectInfo from "./ProjectInfo";
const ProjectDetail = () => {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();

  const projectDetailRedux = useAppSelector(
    (state) => state.project.projectDetails.query
  );

  async function fetchData() {
    try {
      await dispatch(getProjectDetailsAsync({ id: Number(projectId) }));
    } catch (error: any) {
      console.log("Error  - ", error);
    }
  }
  interface TaskStatusTypes {
    todoLen: number | null;
    inProgressLen: number | null;
    doneLen: number | null;
  }
  const [taskStatus, setTaskStatus] = useState<TaskStatusTypes>({
    todoLen: null,
    inProgressLen: null,
    doneLen: null,
  });

  function fillTaskStatus() {
    const tasks = projectDetailRedux?.projectTask || [];
    const todoLength = tasks.filter((task) => task.status === "Todo").length;
    const inProgressLength = tasks.filter(
      (task) => task.status === "In-Progress"
    ).length;
    const doneLength = tasks.filter((task) => task.status === "done").length;
    // console.log({ todoLength, inProgressLength, doneLength });
    setTaskStatus({
      todoLen: todoLength,
      inProgressLen: inProgressLength,
      doneLen: doneLength,
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (projectDetailRedux?.projectTask) {
      fillTaskStatus();
    }
  }, [projectDetailRedux?.projectTask]);

  return (
    <>
      <Header />
      <main className="px-5 py-10">
        <div className="">
          {/* Back to Project Aero */}
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m12 19-7-7 7-7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 12H5"
                />
              </svg>
              Back to Projects
            </Link>
          </div>

          {/* Project Info Card */}
          <ProjectInfo
            project={projectDetailRedux && projectDetailRedux}
            taskStatus={taskStatus}
          />
        </div>
      </main>
      {/*  */}

      <TaskSection tasks={projectDetailRedux?.projectTask ?? []} />
    </>
  );
};

export default ProjectDetail;
