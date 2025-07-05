import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import {
  addTaskToProject,
  deleteTaskFromProject,
  updateTaskFromProject,
} from "./ProjectManagementSlice";

const HOSTNAME = import.meta.env.VITE_BACKENDHOSTNAME;
const clientLoggedToken = localStorage.getItem("clientLoggedToken");

export const createTaskAsync = createAsyncThunk(
  "admin/createTask",
  async ({ ...rest }, { dispatch }) => {
    try {
      console.log(`${HOSTNAME}/project_task/task`);
      const response = await axios.post(
        `${HOSTNAME}/project_task/task`,
        {
          ...rest,
        },

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      if (response?.data && response?.data.msg === "success") {
        dispatch(addTaskToProject(response?.data?.query));
      }

      return response.data;
    } catch (error) {
      console.log("createTaskAsync Error - ", error);
    }
  }
);

export const getTaskAsync = createAsyncThunk(
  "admin/getTask",
  async ({ currentPage, pageSize }) => {
    try {
      // console.log(
      //   `${HOSTNAME}/project_management/project?page=${currentPage}&pageSize=${pageSize}`
      // );
      const response = await axios.get(
        `${HOSTNAME}/project_task/task`,

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.log("getTaskAsync Error - ", error.response);
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  "admin/updateTask",
  async ({ id, title, description, status }, { dispatch }) => {
    try {
      const response = await axios.put(
        `${HOSTNAME}/project_task/task/${id}`,
        {
          title,
          description,
          status,
        },

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      if (response?.data && response?.data.msg === "success") {
        dispatch(updateTaskFromProject(response?.data));
      }

      return response.data;
    } catch (error) {
      console.log("updateTaskAsync Error - ", error.response);
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  "admin/deleteTask",
  async ({ id, projectId }, { dispatch }) => {
    try {
      const response = await axios.delete(
        `${HOSTNAME}/project_task/task/${id}/${projectId}/`,

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      if (response?.data && response?.data.msg === "success") {
        dispatch(deleteTaskFromProject(response?.data));
      }

      return response.data;
    } catch (error) {
      console.log("deleteTaskAsync Error - ", error.response);
    }
  }
);

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
};

export const taskSlice = createSlice({
  name: "task",
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

      .addCase(createTaskAsync.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(createTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getTaskAsync.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(getTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })

      .addCase(getTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      // update
      .addCase(updateTaskAsync.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(deleteTaskAsync.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { searchProjects, filterByStatusProjects } = taskSlice.actions;
export default taskSlice.reducer;
