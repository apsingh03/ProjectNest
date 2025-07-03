import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { createProjectAsync } from "../Redux/Slices/ProjectManagement";

interface NewProjectProps {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  title?: string;
}

const NewProject = ({ isOpenModal, setIsOpenModal }: NewProjectProps) => {
  const dispatch = useDispatch();
  const initialValues = {
    title: "",
    description: "",
    status: "active",
  };

  const ProjectSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().required("Status is required"),
  });

  const handleSubmit = async (values: any, { setSubmitting }) => {
    // console.log("SUbmit ", values);
    setSubmitting(true);
    const res = await dispatch(
      createProjectAsync({
        title: values?.title,
        description: values?.description,
        status: values?.status,
      })
    );

    const { msg } = res?.payload;
    if (msg && msg === "Name Already Exist") {
      alert(msg);
      values.title = "";
    }

    if (msg && msg === "success") {
      alert(msg);
      values.title = "";
      values.description = "";
      values.status = "";
    }

    setIsOpenModal(false);
    setSubmitting(false);
  };

  return (
    <Modal
      isOpenModal={isOpenModal}
      setIsOpenModal={setIsOpenModal}
      title="Create New Project"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ProjectSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <Field
                name="title"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter project title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Field
                name="description"
                as="textarea"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Describe your project"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Field
                name="status"
                as="select"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Saving..." : "Create Project"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default NewProject;
