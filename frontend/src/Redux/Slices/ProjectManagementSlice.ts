import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";

const HOSTNAME = import.meta.env.VITE_BACKENDHOSTNAME;
const clientLoggedToken = localStorage.getItem("clientLoggedToken");
type CreateProjectPayload = {
  title: string;
  description: string;
  status: string;
};

export const createProjectAsync = createAsyncThunk<
  any, // return type
  CreateProjectPayload // payload type!
>("admin/createProject", async (payload) => {
  try {
    const response = await axios.post(
      `${HOSTNAME}/project_management/project`,
      payload,
      {
        headers: { Authorization: `${clientLoggedToken}` },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("createProjectAsync Error - ", error.response);
    throw error; // ensure rejected works
  }
});
interface GetProjectResponse {
  query: Project[];
  totalPages: number;
}
export const getProjectAsync = createAsyncThunk<
  GetProjectResponse,
  { currentPage: number; pageSize: number }
>("admin/getProject", async (payload, _thunkAPI) => {
  try {
    // console.log(
    //   `${HOSTNAME}/project_management/project?page=${currentPage}&pageSize=${pageSize}`
    // );
    const { currentPage, pageSize } = payload;
    const response = await axios.get(
      `${HOSTNAME}/project_management/project?page=${currentPage}&pageSize=${pageSize}`,

      {
        headers: { Authorization: `${clientLoggedToken}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("getCategoryAsync Error - ", error.response);
  }
});

export const updateProjectAsync = createAsyncThunk(
  "admin/updateProject",

  async (
    payload: { id: number; title: string; description: string; status: string },
    _thunkAPI
  ) => {
    try {
      const { id, title, description, status } = payload;
      const response = await axios.put(
        `${HOSTNAME}/project_management/project/${id}`,
        {
          title,
          description,
          status,
        },

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log("updateCategoryAsync Error - ", error.response);
    }
  }
);

export const deleteProjectAsync = createAsyncThunk(
  "admin/deleteProject",
  async (payload: { id: number }, _thunkAPI) => {
    try {
      const { id } = payload;
      console.log(`${HOSTNAME}/project_management/project/${id}`);
      const response = await axios.delete(
        `${HOSTNAME}/project_management/project/${id}`,

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log("deleteCategoryAsync Error - ", error.response);
    }
  }
);
// 👇 Make this action in projectSlice
export const addTaskToProject = createAction<Task>("project/addTaskToProject");
export const deleteTaskFromProject = createAction<{
  msg: string;
  taskId: string;
  projectId: string;
}>("project/deleteTaskFromProject");
interface UpdateTaskFromProjectPayload {
  query: {
    projectId: number;
    id: number;
    title?: string;
    description?: string;
    status?: string;
    dueDate?: string;
  };
}

export const updateTaskFromProject = createAction<UpdateTaskFromProjectPayload>(
  "project/updateTaskFromProject"
);

export interface Task {
  id: number;
  projectId: number;
  devId: number;
  title: string;
  description: string;
  status: string;
  dueDate: string; // ISO string
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  projectTask?: Task[]; // Each project has tasks
}

type ProjectState = {
  data: {
    query: Project[]; // or Project[]
    totalPages: number;
  };
  isLoading: boolean;
  isError: boolean;
};

const initialState: ProjectState = {
  data: {
    query: [],
    totalPages: 0,
  },
  isLoading: false,
  isError: false,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    searchProjects(state, action) {
      const searchQuery = action?.payload;
      const allProjects = state.data.query || [];
      const filterByTitle = allProjects.filter((project) =>
        project.title.toLowerCase().includes(searchQuery)
      );

      state.data.query = filterByTitle;
    },

    filterByStatusProjects(state, action) {
      const selectedStatus = action?.payload;
      console.log("filterByStatusProjects - ", selectedStatus);
      const allProjects = state.data.query || [];
      const filterByStatus = allProjects.filter((project) =>
        project.status.toLowerCase().includes(selectedStatus)
      );

      state.data.query = filterByStatus;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createProjectAsync.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createProjectAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.msg === "success") {
          state.data.query.unshift(action.payload.query);
        }
        // console.log("payload - ", action.payload);
      })

      .addCase(createProjectAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getProjectAsync.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getProjectAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.query) {
          state.data = {
            query: action.payload.query,
            totalPages: action.payload.totalPages,
          };
        }
      })

      .addCase(getProjectAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // update
      .addCase(updateProjectAsync.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateProjectAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.msg === "success") {
          const { id } = action.meta.arg;

          const projectDetails = action.payload.query;

          const findIndex = state.data.query.findIndex((data) => {
            return data.id === id;
          });

          if (findIndex !== -1) {
            state.data.query[findIndex].title = projectDetails?.title;

            state.data.query[findIndex].description =
              projectDetails?.description;

            state.data.query[findIndex].status = projectDetails?.status;
          } else {
            console.error("ProjectUpdate ID not found in the query array");
          }
        }
      })

      .addCase(updateProjectAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(deleteProjectAsync.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.msg === "success") {
          const { id } = action.meta.arg;
          const findIndex = state.data.query.findIndex((data) => {
            return data.id === id;
          });

          state.data.query.splice(findIndex, 1);
        }
      })

      .addCase(deleteProjectAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // to update task in project
      .addCase(addTaskToProject, (state, action: PayloadAction<Task>) => {
        console.log("addTaskToProject called");
        // createdAt: null;
        // description: "csdcsacsda";
        // devId: 5;
        // dueDate: "2025-07-31T00:00:00.000Z";
        // id: 14;
        // projectId: 20;
        // status: "Done";
        // title: "fdadsfas32424";
        // updatedAt: null;
        const newTask = action.payload;
        console.log("TYPE - ", typeof newTask);

        const projectId = newTask.projectId;
        const findIndex = state.data.query.findIndex((data) => {
          return data.id === projectId;
        });

        if (findIndex !== -1) {
          const project = state.data.query[findIndex];

          if (project?.projectTask) {
            project.projectTask.unshift(newTask);
          }
          // state.data.query[findIndex].projectTask.unshift(newTask);
        } else {
          console.error("ID not found in the query array");
        }
      })
      .addCase(
        deleteTaskFromProject,
        (
          state,
          action: PayloadAction<{
            msg: string;
            taskId: string;
            projectId: string;
          }>
        ) => {
          // const taskDetails = action.payload;
          const { projectId, taskId } = action.payload;
          // console.log("deleteTaskFromProject - ", taskDetails);
          // {msg: 'success', taskId: '13', projectId: '20'}

          console.log(state.data.query);
          const findIndexProject = state.data.query.findIndex((data) => {
            return data.id === Number(projectId);
          });

          if (findIndexProject !== -1) {
            const targetProject = state.data.query[findIndexProject];

            if (targetProject?.projectTask) {
              const findIndexTask = targetProject.projectTask.findIndex(
                (task: any) => task.id === Number(taskId)
              );

              if (findIndexTask !== -1) {
                targetProject.projectTask.splice(findIndexTask, 1);
              } else {
                console.error("Delete findIndexTask not found");
              }
            } else {
              console.error("Delete projectTask not found");
            }
          } else {
            console.error("Delete findIndexProject not found");
          }
        }
      )
      .addCase(updateTaskFromProject, (state, action) => {
        if (action.payload?.query) {
          const updatedTaskDetails = action.payload.query;

          const projectId = updatedTaskDetails?.projectId;
          const taskId = updatedTaskDetails?.id;
          // console.log("updatedTaskDetails  -  ", updatedTaskDetails);
          const findIndexProject = state.data.query.findIndex((data) => {
            return data.id === Number(projectId);
          });
          // console.log("findIndexProject - ", findIndexProject, projectId);
          if (findIndexProject !== -1) {
            const targetProject = state.data.query[findIndexProject];

            if (targetProject?.projectTask && updatedTaskDetails) {
              const findIndexTask = targetProject.projectTask.findIndex(
                (task) => task.id === Number(taskId)
              );

              if (findIndexTask !== -1) {
                const task = targetProject.projectTask[findIndexTask];

                task.title = updatedTaskDetails.title ?? task.title;
                task.description =
                  updatedTaskDetails.description ?? task.description;
                task.status = updatedTaskDetails.status ?? task.status;
                task.dueDate = updatedTaskDetails.dueDate ?? task.dueDate;
              } else {
                console.error("Update findIndexTask not found");
              }
            } else {
              console.error(
                "Update projectTask or updatedTaskDetails not found"
              );
            }
          } else {
            console.error("Update findIndexProject not found");
          }
        } else {
          console.error("Update findIndexProject not found");
        }
      });
  },
});

export const { searchProjects, filterByStatusProjects } = projectSlice.actions;
export default projectSlice.reducer;
