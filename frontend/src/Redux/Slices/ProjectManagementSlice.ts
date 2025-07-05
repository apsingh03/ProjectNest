import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
const HOSTNAME = import.meta.env.VITE_BACKENDHOSTNAME;
const clientLoggedToken = localStorage.getItem("clientLoggedToken");

export const createProjectAsync = createAsyncThunk(
  "admin/createProject",
  async ({ ...rest }) => {
    try {
      const response = await axios.post(
        `${HOSTNAME}/project_management/project`,
        {
          ...rest,
        },

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      return response.data;
    } catch (error) {
      console.log("createCategoryAsync Error - ", error.response);
    }
  }
);

export const getProjectAsync = createAsyncThunk(
  "admin/getProject",
  async ({ currentPage, pageSize }) => {
    try {
      // console.log(
      //   `${HOSTNAME}/project_management/project?page=${currentPage}&pageSize=${pageSize}`
      // );
      const response = await axios.get(
        `${HOSTNAME}/project_management/project?page=${currentPage}&pageSize=${pageSize}`,

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.log("getCategoryAsync Error - ", error.response);
    }
  }
);

export const updateProjectAsync = createAsyncThunk(
  "admin/updateProject",
  async ({ id, title, description, status }) => {
    try {
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
    } catch (error) {
      console.log("updateCategoryAsync Error - ", error.response);
    }
  }
);

export const deleteProjectAsync = createAsyncThunk(
  "admin/deleteProject",
  async ({ id }) => {
    try {
      console.log(`${HOSTNAME}/project_management/project/${id}`);
      const response = await axios.delete(
        `${HOSTNAME}/project_management/project/${id}`,

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      return response.data;
    } catch (error) {
      console.log("deleteCategoryAsync Error - ", error.response);
    }
  }
);
// 👇 Make this action in projectSlice
export const addTaskToProject = createAction("project/addTaskToProject");
export const deleteTaskFromProject = createAction(
  "project/deleteTaskFromProject"
);

export const updateTaskFromProject = createAction(
  "project/updateTaskFromProject"
);

const initialState = {
  data: [],
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

      .addCase(createProjectAsync.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(createProjectAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload.msg === "success") {
          state.data.query.unshift(action.payload.query);
        }
        // console.log("payload - ", action.payload);
      })

      .addCase(createProjectAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getProjectAsync.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(getProjectAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })

      .addCase(getProjectAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      // update
      .addCase(updateProjectAsync.pending, (state, action) => {
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

      .addCase(updateProjectAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(deleteProjectAsync.pending, (state, action) => {
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

      .addCase(deleteProjectAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      // to update task in project
      .addCase(addTaskToProject, (state, action) => {
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
          state.data.query[findIndex].projectTask.unshift(newTask);
        } else {
          console.error("ID not found in the query array");
        }

        // if (  ) {

        // const project = state.data.query.find((p) => p.id === projectId);
        // if (project) {
        //   project.tasks.unshift(newTask);
        // }
        // } // or however you store the relation
      })
      .addCase(deleteTaskFromProject, (state, action) => {
        const taskDetails = action.payload;
        // console.log("deleteTaskFromProject - ", taskDetails);
        // {msg: 'success', taskId: '13', projectId: '20'}
        const projectId = taskDetails.projectId;
        const taskId = taskDetails.taskId;
        console.log(state.data.query);
        const findIndexProject = state.data.query.findIndex((data) => {
          return data.id === Number(projectId);
        });

        if (findIndexProject !== -1) {
          const findIndexTask = state.data.query[
            findIndexProject
          ].projectTask.findIndex((task) => {
            return task.id === Number(taskId);
          });
          if (findIndexTask !== -1) {
            state.data.query[findIndexProject].projectTask.splice(
              findIndexTask,
              1
            );
          } else {
            console.error("Delete findIndexTask not found");
          }
        } else {
          console.error("Delete findIndexProject not found");
        }
      })
      .addCase(updateTaskFromProject, (state, action) => {
        const updatedTaskDetails = action.payload?.query;

        const projectId = updatedTaskDetails?.projectId;
        const taskId = updatedTaskDetails?.id;
        // console.log("updatedTaskDetails  -  ", updatedTaskDetails);
        const findIndexProject = state.data.query.findIndex((data) => {
          return data.id === Number(projectId);
        });
        // console.log("findIndexProject - ", findIndexProject, projectId);

        if (findIndexProject !== -1) {
          const findIndexTask = state.data.query[
            findIndexProject
          ].projectTask.findIndex((task) => {
            return task.id === Number(taskId);
          });
          if (findIndexTask !== -1) {
            state.data.query[findIndexProject].projectTask[
              findIndexTask
            ].title = updatedTaskDetails?.title;

            state.data.query[findIndexProject].projectTask[
              findIndexTask
            ].description = updatedTaskDetails?.description;

            state.data.query[findIndexProject].projectTask[
              findIndexTask
            ].status = updatedTaskDetails?.status;
            state.data.query[findIndexProject].projectTask[
              findIndexTask
            ].dueDate = updatedTaskDetails?.dueDate;
          } else {
            console.error("Update findIndexTask not found");
          }
        } else {
          console.error("Update findIndexProject not found");
        }
      });
  },
});

export const { searchProjects, filterByStatusProjects } = projectSlice.actions;
export default projectSlice.reducer;
