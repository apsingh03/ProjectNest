"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ProjectCard, { type ProjectEditDetailsPropTypes } from "./ProjectCard";
import Skeleton from "react-loading-skeleton";

import NewProject from "./NewProject";

import {
  getProjectAsync,
  searchProjects,
} from "../Redux/Slices/ProjectManagementSlice";
// import StatusFilter from "./StatusFilter";
import Pagination from "./Pagination";
import { useAppDispatch, useAppSelector } from "../Hooks/hooks";
import SearchFilterBar from "./SearchFilterBar";

export default function Dashboard() {
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [status, setStatus] = useState("");

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [projectEditDetails, setprojectEditDetails] =
    useState<ProjectEditDetailsPropTypes>({
      id: null,
      title: null,
      description: null,
      status: null,
    });

  const projectRedux = useAppSelector((state) => state?.project?.data?.query);

  const totalPagesRedux = useAppSelector(
    (state) => state?.project?.data?.totalPages
  );

  const isLoadingProjectRedux = !projectRedux || !projectRedux;

  const dispatch = useAppDispatch();
  const [searchInput, setsearchInput] = useState("");

  // pagination
  const paginationArray = Array.from(Array(totalPagesRedux).keys()).splice(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setpageSize] = useState(4);

  // Debounce Search
  useEffect(() => {
    if (searchInput.trim() === "") return;
    const timer = setTimeout(() => {
      // console.log("searchInput -  ", searchInput);
      dispatch(searchProjects(searchInput));
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  async function fetchData() {
    await dispatch(getProjectAsync({ currentPage, pageSize }));
  }

  useEffect(() => {
    fetchData();
  }, [pageSize, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">
              Manage your projects and track progress
            </p>
          </div>
          <button
            // onClick={() => setIsCreateModalOpen(true)}
            onClick={() => setIsOpenModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
        {/* TO SHOW SEACH INPUT AND FILTER  */}
        <SearchFilterBar
          searchInput={searchInput}
          setSearchInput={setsearchInput}
          status={status}
          setStatus={setStatus}
        />

        {/* SHOW SKELTON UI  */}
        {isLoadingProjectRedux ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {["", "", "", ""].map((_, idx) => (
                <Skeleton key={idx} width={"100%"} height={"250px"} />
              ))}
            </div>
          </>
        ) : projectRedux && projectRedux.length === 0 ? (
          <>
            {/* SHOW SKELTON UI  */}
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first project
              </p>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {projectRedux.map((project) => (
              <>
                {/* If length is > 0 then show Project Cards  */}
                <ProjectCard
                  key={project.id}
                  project={project}
                  setprojectEditDetails={setprojectEditDetails}
                  setIsOpenEditModal={setIsOpenEditModal}
                />
              </>
            ))}
          </div>
        )}
        {/* Projects Pagination */}
        <div className="mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPagesRedux}
            paginationArray={paginationArray}
            setCurrentPage={setCurrentPage}
            setpageSize={setpageSize}
            pageSize={pageSize}
          />
        </div>
        {/* MODAL -  To Create and Edit a Project Modal Will Open */}
        <NewProject
          isOpenEditModal={isOpenEditModal}
          setIsOpenEditModal={setIsOpenEditModal}
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          projectEditDetails={projectEditDetails}
        />
      </main>
    </div>
  );
}
