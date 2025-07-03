// lib/store.ts

import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./Slices/UserAuth";
import projectSlice from "./Slices/ProjectManagement";

// 1️⃣ Create the store
export const store = configureStore({
  reducer: {
    client_auth: userAuthSlice,
    project: projectSlice,
  },
});

// 2️⃣ Define RootState type (auto inferred)
export type RootState = ReturnType<typeof store.getState>;

// 3️⃣ Define AppDispatch type
export type AppDispatch = typeof store.dispatch;
