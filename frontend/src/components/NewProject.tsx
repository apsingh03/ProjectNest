import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import type { FormikHelpers } from "formik";
import {
  createProjectAsync,
  updateProjectAsync,
} from "../Redux/Slices/ProjectManagementSlice";
import { useAppDispatch } from "../Hooks/hooks";

interface ProjectEditDetails {
  id: number | null;
  title: string | null;
  description: string | null;
  status: string | null;
}

interface NewProjectProps {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  isOpenEditModal: boolean;
  setIsOpenEditModal: (isOpen: boolean) => void;
  projectEditDetails: ProjectEditDetails;
}

const NewProject = ({
  isOpenModal,
  setIsOpenModal,
  isOpenEditModal,
  setIsOpenEditModal,
  projectEditDetails,
}: NewProjectProps) => {
  const dispatch = useAppDispatch();

  const ProjectSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().required("Status is required"),
  });

  type CreateProjectPayload = {
    title: string;
    description: string;
    status: string;
  };

  const handleSubmit = async (
    values: CreateProjectPayload,
    { setSubmitting }: FormikHelpers<CreateProjectPayload>
  ) => {
    // console.log("SUbmit ", values);

    try {
      setSubmitting(true);
      const res = await dispatch(
        createProjectAsync({
          title: values?.title,
          description: values?.description,
          status: values?.status,
        })
      );
      if (res?.payload) {
        const { msg } = res.payload;
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
      }

      setIsOpenModal(false);
      setSubmitting(false);
    } catch (error: any) {
      console.error("Error handleSubmitProject - ", error);
    }
  };

  const handleEdit = async (
    values: ProjectFormValues,
    { setSubmitting }: FormikHelpers<ProjectFormValues>
  ) => {
    // console.log("SUbmit ", values);

    try {
      if (projectEditDetails?.id == null) {
        throw new Error("Project ID is missing.");
      }

      setSubmitting(true);
      const res = await dispatch(
        updateProjectAsync({
          id: projectEditDetails.id!, // The `!` says “trust me, not null”
          title: values?.title,
          description: values?.description,
          status: values?.status,
        })
      );

      if (res?.payload) {
        const { msg } = res.payload;
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
      }
      setIsOpenEditModal(false);
      setIsOpenModal(false);
      setSubmitting(false);
    } catch (error: any) {
      console.error("Error handleEditProject ", error);
    }
  };

  function initialValues(): CreateProjectPayload {
    if (isOpenEditModal) {
      return {
        title: projectEditDetails.title ?? "",
        description: projectEditDetails.description ?? "",
        status: projectEditDetails.status ?? "",
      };
    } else {
      return {
        title: "",
        description: "",
        status: "active",
      };
    }
  }
  type ProjectFormValues = {
    id?: number; // optional!
    title: string;
    description: string;
    status: string;
  };

  return (
    <Modal
      isOpenModal={isOpenModal || isOpenEditModal}
      setIsOpenModal={setIsOpenModal}
      setIsOpenEditModal={setIsOpenEditModal}
      title={isOpenEditModal ? "Edit Project" : "Create New Project"}
    >
      <Formik<ProjectFormValues>
        initialValues={initialValues()}
        validationSchema={ProjectSchema}
        onSubmit={isOpenEditModal ? handleEdit : handleSubmit}
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
                {isSubmitting
                  ? "Saving..."
                  : isOpenEditModal
                  ? "Edit Project"
                  : "Create Project"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default NewProject;
