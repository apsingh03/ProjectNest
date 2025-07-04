import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { useDispatch } from "react-redux";

import { createTaskAsync, updateTaskAsync } from "../Redux/Slices/TaskSlice";

interface TaskEditDetails {
  id: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  dueDate: string | null;
}

interface NewTaskProps {
  isOpenModal: boolean;
  isOpenTaskEditModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  setIsOpenTaskEditModal: (isOpen: boolean) => void;
  projectId: number;
  taskEditDetails: TaskEditDetails;
}

const NewTask = ({
  isOpenModal,
  setIsOpenModal,
  isOpenTaskEditModal,
  setIsOpenTaskEditModal,
  projectId,
  taskEditDetails,
}: NewTaskProps) => {
  const dispatch = useDispatch();

  const TaskSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().required("Status is required"),
    dueDate: Yup.string().required("Date is required"),
  });

  const handleSubmit = async (values: any, { setSubmitting }) => {
    // console.log("SUbmit ", values);
    setSubmitting(true);
    // console.log(projectId, values);
    const res = await dispatch(
      createTaskAsync({
        title: values?.title,
        description: values?.description,
        status: values?.status,
        projectId: projectId,
        dueDate: values.dueDate,
      })
    );

    // console.log("res - ", res);

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
      values.dueDate = "";
    }
    setIsOpenModal(false);
    setSubmitting(false);
  };

  const handleEdit = async (values: any, { setSubmitting }) => {
    // console.log("SUbmit ", values);
    setSubmitting(true);
    const res = await dispatch(
      updateTaskAsync({
        id: taskEditDetails?.id,
        title: values?.title,
        description: values?.description,
        status: values?.status,
        dueDate: values.dueDate,
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
    setIsOpenEditModal(false);
    setIsOpenModal(false);
    setSubmitting(false);
  };

  function initialValues() {
    if (isOpenTaskEditModal) {
      return {
        title: taskEditDetails.title,
        description: taskEditDetails.description,
        status: taskEditDetails.status,
        dueDate: taskEditDetails.dueDate,
      };
    } else {
      return {
        title: "",
        description: "",
        status: "",
        dueDate: "",
      };
    }
  }

  return (
    <Modal
      isOpenModal={isOpenModal || isOpenTaskEditModal}
      setIsOpenModal={setIsOpenModal}
      setIsOpenEditModal={setIsOpenTaskEditModal}
      title={isOpenTaskEditModal ? "Edit Task" : "Create New Task"}
    >
      <Formik
        initialValues={initialValues()}
        validationSchema={TaskSchema}
        onSubmit={isOpenTaskEditModal ? handleEdit : handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
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
                Task Description
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

            <div className="flex flex-row justify-between items-center ">
              <div className="flex-1">
                <label className=" block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <Field
                  type="date"
                  name="dueDate"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Status
                </label>
                <Field
                  name="status"
                  as="select"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="Todo">Todo</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Done">Done</option>
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting
                  ? "Saving..."
                  : isOpenTaskEditModal
                  ? "Edit Task"
                  : "Create Task"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default NewTask;
