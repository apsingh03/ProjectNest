import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const HOSTNAME = import.meta.env.VITE_BACKENDHOSTNAME;

export const createProjectAsync = createAsyncThunk(
  "admin/createProject",
  async ({ ...rest }) => {
    try {
      const response = await axios.post(
        `${HOSTNAME}/project_management/project`,
        {
          ...rest,
        },

        { withCredentials: true }
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

        { withCredentials: true }
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

        { withCredentials: true }
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

        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      console.log("deleteCategoryAsync Error - ", error.response);
    }
  }
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
          const findIndex = state.data.query.findIndex((data) => {
            return data.id === id;
          });
          console.log("payload - ", action.payload.query);
          // Ensure the findIndex is valid
          if (findIndex !== -1) {
            state.data.query[findIndex].name = action.payload.query.name;
          } else {
            console.error("ID not found in the query array");
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
      });
  },
});

export const { searchProjects, filterByStatusProjects } = projectSlice.actions;
export default projectSlice.reducer;
