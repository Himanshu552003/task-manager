import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";
import { getErrorMessage } from "../services/api";
import { getUser, saveUser, removeUser } from "../utils/storage";

export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const user = await authService.login(data);
    saveUser(user, data.rememberMe);
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const registerUser = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const user = await authService.register(data);
    saveUser(user, false);
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUser(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      removeUser();
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
