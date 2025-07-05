import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import {
  addTaskToProject,
  deleteTaskFromProject,
  updateTaskFromProject,
} from "./ProjectManagementSlice";

const HOSTNAME = import.meta.env.VITE_BACKENDHOSTNAME;
const clientLoggedToken = localStorage.getItem("clientLoggedToken");

type CreateTaskPayload = {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: number;
};

export const createTaskAsync = createAsyncThunk<any, CreateTaskPayload>(
  "admin/createTask",
  async (payload, thunkAPI) => {
    try {
      console.log(`${HOSTNAME}/project_task/task`);
      const response = await axios.post(
        `${HOSTNAME}/project_task/task`,
        payload,

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      if (response?.data && response?.data.msg === "success") {
        thunkAPI.dispatch(addTaskToProject(response?.data?.query));
      }

      return response.data;
    } catch (error: any) {
      console.log("createTaskAsync Error - ", error);
    }
  }
);

export const getTaskAsync = createAsyncThunk(
  "admin/getTask",
  async (_payload: { currentPage: number; pageSize: number }, _thunkAPI) => {
    try {
      // console.log(
      //   `${HOSTNAME}/project_management/project?page=${currentPage}&pageSize=${pageSize}`
      // );
      // const { currentPage, pageSize } = payload;
      const response = await axios.get(
        `${HOSTNAME}/project_task/task`,

        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log("getTaskAsync Error - ", error.response);
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  "admin/updateTask",
  async (
    payload: {
      id: number;
      title: string;
      description: string;
      status: string;
      dueDate: string;
    },
    thunkAPI
  ) => {
    try {
      const { id, title, description, status } = payload;

      const response = await axios.put(
        `${HOSTNAME}/project_task/task/${id}`,
        { title, description, status },
        {
          headers: { Authorization: `${clientLoggedToken}` },
        }
      );

      if (response?.data && response?.data.msg === "success") {
        //  Use thunkAPI.dispatch
        thunkAPI.dispatch(updateTaskFromProject(response.data));
      }

      return response.data;
    } catch (error: any) {
      console.error("updateTaskAsync Error - ", error?.response);
      // Optionally: throw to reject
      throw error;
    }
  }
);

export const deleteTaskAsync = createAsyncThunk<
  any, // your return type
  { id: number; projectId: number }
>("admin/deleteTask", async (payload, thunkAPI) => {
  try {
    const { id, projectId } = payload;
    const response = await axios.delete(
      `${HOSTNAME}/project_task/task/${id}/${projectId}/`,

      {
        headers: { Authorization: `${clientLoggedToken}` },
      }
    );

    if (response?.data && response?.data.msg === "success") {
      thunkAPI.dispatch(deleteTaskFromProject(response?.data));
    }

    return response.data;
  } catch (error: any) {
    console.log("deleteTaskAsync Error - ", error.response);
  }
});

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Use _ or _action to silence Typescript warning:
      .addCase(createTaskAsync.pending, (state, _action) => {
        state.isLoading = true;
      })

      .addCase(createTaskAsync.fulfilled, (state, _action) => {
        state.isLoading = false;
      })

      .addCase(createTaskAsync.rejected, (state, _action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getTaskAsync.pending, (state, _action) => {
        state.isLoading = true;
      })

      .addCase(getTaskAsync.fulfilled, (state, _action) => {
        state.isLoading = false;
        // state.data = action.payload;
      })

      .addCase(getTaskAsync.rejected, (state, _action) => {
        state.isLoading = false;
        state.isError = true;
      })
      // update
      .addCase(updateTaskAsync.pending, (state, _action) => {
        state.isLoading = true;
      })

      .addCase(updateTaskAsync.fulfilled, (state, _action) => {
        state.isLoading = false;
      })

      .addCase(updateTaskAsync.rejected, (state, _action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(deleteTaskAsync.pending, (state, _action) => {
        state.isLoading = true;
      })

      .addCase(deleteTaskAsync.fulfilled, (state, _action) => {
        state.isLoading = false;
      })

      .addCase(deleteTaskAsync.rejected, (state, _action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default taskSlice.reducer;
