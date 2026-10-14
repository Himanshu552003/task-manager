import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "../services/taskService";
import { getErrorMessage } from "../services/api";

export const fetchTasks = createAsyncThunk("tasks/fetchAll", async (params, thunkAPI) => {
  try {
    return await taskService.getTasks(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchStats = createAsyncThunk("tasks/stats", async (_, thunkAPI) => {
  try {
    return await taskService.getStats();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const createTask = createAsyncThunk("tasks/create", async (data, thunkAPI) => {
  try {
    return await taskService.createTask(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, data }, thunkAPI) => {
  try {
    return await taskService.updateTask(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id, thunkAPI) => {
  try {
    await taskService.deleteTask(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    page: 1,
    totalPages: 1,
    total: 0,
    stats: null,
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        state.total = state.total - 1;
      });
  },
});

export default taskSlice.reducer;
