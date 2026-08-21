import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginRequest, getCurrentUser } from "@/lib/authApi";
import { setTokenCookie, getTokenCookie, clearTokenCookie } from "@/lib/cookies";

export const login = createAsyncThunk("auth/login", async ({ phone, name }, { rejectWithValue }) => {
  try {
    const data = await loginRequest({ phone, name });
    setTokenCookie(data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// runs once on app load to turn a cookie back into a session. also doubles
// as a cheap way to confirm the token still works, since middleware only
// checks that the cookie exists, not that the JWT is still valid.
export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
  const token = getTokenCookie();
  if (!token) return rejectWithValue(null);

  try {
    const user = await getCurrentUser(token);
    return { token, user };
  } catch (err) {
    clearTokenCookie();
    return rejectWithValue(err.message);
  }
});

const initialState = {
  user: null,
  token: null,
  // "loading" here covers both login-in-progress and the initial session
  // restore, so the UI can show one spinner instead of juggling two flags
  status: "loading",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      clearTokenCookie();
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
