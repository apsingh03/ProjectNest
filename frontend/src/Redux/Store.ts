// lib/store.ts

import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./Slices/UserAuthSlice";
import projectSlice from "./Slices/ProjectManagementSlice";
import taskSlice from "./Slices/TaskSlice";

// 1️⃣ Create the store
export const store = configureStore({
  reducer: {
    client_auth: userAuthSlice,
    project: projectSlice,
    task: taskSlice,
  },
});

// 2️⃣ Define RootState type (auto inferred)
export type RootState = ReturnType<typeof store.getState>;

// 3️⃣ Define AppDispatch type
export type AppDispatch = typeof store.dispatch;
