import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasks, addTask, deleteTask, editTask } from '../services/taskApi';

export const getTasks = createAsyncThunk('tasks/getTasks', async () => {
    const tasks = await fetchTasks();
    return tasks.todos;
});

export const createTask = createAsyncThunk('tasks/createTask', async (task) => {
    console.log("task", task)
    const newTask = await addTask(task);
    return newTask;
});

export const removeTask = createAsyncThunk('tasks/removeTask', async (id) => {
    await deleteTask(id);
    return id;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, updatedTask }) => {
    const task = await editTask(id, updatedTask);
    return task;
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                state.tasks[index] = action.payload;
            });
    },
});

export default taskSlice.reducer;
