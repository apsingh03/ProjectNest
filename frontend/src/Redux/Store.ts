import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./Slices/UserAuthSlice";
import projectSlice from "./Slices/ProjectManagementSlice";
import taskSlice from "./Slices/TaskSlice";

export const store = configureStore({
  reducer: {
    client_auth: userAuthSlice,
    project: projectSlice,
    task: taskSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
