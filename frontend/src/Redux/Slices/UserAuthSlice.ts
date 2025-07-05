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

const HOSTNAME = import.meta.env.VITE_BACKENDHOSTNAME;
const clientLoggedToken = localStorage.getItem("clientLoggedToken");

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
    const response = await axios.post(`${HOSTNAME}/auth/signup`, {
      email,
      fullName,
      password,
    });
    return response.data;
  }
);

export const loginClientAsync = createAsyncThunk(
  "client/loginClient",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`${HOSTNAME}/auth/login`, {
      email,
      password,
    });
    return response.data;
  }
);

export const getLoggedInfoAsync = createAsyncThunk(
  "client/getUserInfo",
  async () => {
    const response = await axios.get(`${HOSTNAME}/auth/loggedInfo/`, {
      headers: { Authorization: `${clientLoggedToken}` },
    });
    return response.data;
  }
);

export const getLoggedOutAsync = createAsyncThunk(
  "client/userLogout",
  async () => {
    const response = await axios.post(`${HOSTNAME}/auth/logout/`, {
      headers: { Authorization: `${clientLoggedToken}` },
    });
    return response.data;
  }
);

interface ClientJwtPayload {
  isUserLogged: boolean;
  id: string;
  fullName: string;
  email: string;
}

interface LoggedData {
  isUserLogged: boolean;
  id: string | null;
  fullName: string | null;
  email: string | null;
}

interface AuthState {
  userDetails: UserDetails | null;
  isLoading: boolean;
  isError: boolean;
  data?: any;
  loggedData: LoggedData;
}

const token = localStorage.getItem("clientLoggedToken");

let decoded: ClientJwtPayload | null = null;
if (token) {
  decoded = jwtDecode<ClientJwtPayload>(token);
}
const initialState: AuthState = {
  userDetails: null,
  isLoading: false,
  isError: false,
  loggedData: {
    isUserLogged: decoded?.isUserLogged ?? false,
    id: decoded?.id ?? null,
    fullName: decoded?.fullName ?? null,
    email: decoded?.email ?? null,
  },
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
        (
          state,
          action: PayloadAction<{ msg: string; userObject: UserDetails }>
        ) => {
          state.isLoading = false;
          // console.log("getLoggedInfoAsync - ", action.payload);
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
      .addCase(getLoggedOutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.userDetails = null;
        // console.log(action.payload);
      })
      .addCase(getLoggedOutAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userAuthSlice.reducer;
