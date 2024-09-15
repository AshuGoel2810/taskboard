const BASE_URL = 'https://dummyjson.com/todos';

export const fetchTasks = async () => {
    const response = await fetch(BASE_URL);
    return response.json();
};

export const addTask = async (task) => {
    console.log(task, "100")
    const response = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            todo: task.todo,
            completed: task.completed,
            userId: task.userId,

        }),

    });
    return response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

export const editTask = async (id, updatedTask) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            todo: updatedTask.todo,
            completed: updatedTask.completed,
        }),
    });
    return response.json();
};
