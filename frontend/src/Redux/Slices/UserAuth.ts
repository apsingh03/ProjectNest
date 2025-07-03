// lib/slices/userAuthSlice.ts

import { jwtDecode } from "jwt-decode";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface UserDetails {
  id: string;
  fullName: string;
  email: string;
}

interface AuthState {
  userDetails: UserDetails | null;
  isLoading: boolean;
  isError: boolean;

  data?: any; // If you have generic data, you can type it better later
}

const HOSTNAME = import.meta.env.VITE_BACKENDHOSTNAME;

export const createClientAsync = createAsyncThunk(
  "client/createClient",
  async ({
    email,
    fullName,
    password,
  }: {
    email: string;
    fullName: string;
    password: string;
  }) => {
    const response = await axios.post(
      `${HOSTNAME}/auth/signup`,
      {
        email,
        fullName,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  }
);

export const loginClientAsync = createAsyncThunk(
  "client/loginClient",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(
      `${HOSTNAME}/auth/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  }
);

export const getLoggedInfoAsync = createAsyncThunk(
  "client/getUserInfo",
  async () => {
    const response = await axios.get(`${HOSTNAME}/auth/loggedInfo/`, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const getLoggedOutAsync = createAsyncThunk(
  "client/userLogout",
  async () => {
    const response = await axios.post(`${HOSTNAME}/auth/logout/`, {
      withCredentials: true,
    });
    return response.data;
  }
);

const initialState: AuthState = {
  userDetails: null,
  isLoading: false,
  isError: false,
};

export const userAuthSlice = createSlice({
  name: "clientAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createClientAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createClientAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(createClientAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(loginClientAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        loginClientAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(loginClientAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(getLoggedInfoAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getLoggedInfoAsync.fulfilled,
        (state, action: PayloadAction<UserDetails>) => {
          state.isLoading = false;
          console.log("getLoggedInfoAsync - ", action.payload);
          const { msg, userObject } = action.payload;
          if (msg === "User Logged In") state.userDetails = userObject;
        }
      )
      .addCase(getLoggedInfoAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getLoggedOutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getLoggedOutAsync.fulfilled,
        (state, action: PayloadAction<UserDetails>) => {
          state.isLoading = false;
          state.userDetails = null;
          // console.log(action.payload);
        }
      )
      .addCase(getLoggedOutAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userAuthSlice.reducer;
