"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Vote, Users } from "lucide-react";
import ProjectCard from "./ProjectCard";

import SearchFilter from "./SearchFilter";
import { Plus } from "lucide-react";
import { getProjectsWithTasks } from "../utils/MockData";
import Modal from "./Modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import NewProject from "./NewProject";
import { useDispatch, useSelector } from "react-redux";
import { getProjectAsync } from "../Redux/Slices/ProjectManagement";
export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [isOpenModal, setIsOpenModal] = useState(false);

  const projectRedux = useSelector((state) => state?.project?.data?.query);
  const dispatch = useDispatch();

  // console.log("projectRedux - ", projectRedux);

  const allProjects = getProjectsWithTasks();

  const projects = useMemo(() => {
    return (
      projectRedux &&
      projectRedux.filter((project) => {
        const matchesSearch =
          !filters.search ||
          project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(filters.search.toLowerCase());

        const matchesStatus =
          !filters.status || project.status === filters.status;

        return matchesSearch && matchesStatus;
      })
    );
  }, [projectRedux, filters]);

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  async function fetchData() {
    await dispatch(getProjectAsync());
    // if ( res?.payload )
  }

  useEffect(() => {
    fetchData();
  }, []);

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

        <div className="mb-6">
          <SearchFilter
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            currentSearch={filters.search}
            currentStatus={filters.status}
          />
        </div>

        {projectRedux && projectRedux.length === 0 ? (
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
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectRedux &&
              projectRedux.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        )}

        <NewProject isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      </main>
    </div>
  );
}
