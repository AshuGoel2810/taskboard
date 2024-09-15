import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, removeTask, createTask, updateTask } from '../store/taskSlice';
import { Link } from 'react-router-dom';

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const TaskBoard = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    const [newTask, setNewTask] = useState({ todo: '', userId: 1, completed: false });
    const [isEditing, setIsEditing] = useState(null);
    const [editTodo, setEditTodo] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const [showActions, setShowActions] = useState(false);

    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(removeTask(id));
    };

    const handleStatusChange = (task) => {
        const updatedTask = { ...task, completed: !task.completed };
        dispatch(updateTask({ id: task.id, updatedTask }));
    };

    const handleAdd = () => {
        if (newTask.todo.trim()) {
            dispatch(createTask(newTask));
            setNewTask({ todo: '', userId: 1, completed: false });
        }
    };

    const handleEdit = (task) => {
        setIsEditing(task.id);
        setEditTodo(task.todo);
    };

    const handleSaveEdit = (task) => {
        const updatedTask = { ...task, todo: editTodo };
        dispatch(updateTask({ id: task.id, updatedTask })).then(() => {
            setIsEditing(null);
        });
    };

    const filteredTasks = tasks.filter((task) =>
        task.todo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className='row justify-content-center align-content-center'>
                <div className='col-md-9'>

                    <h3 className='d-flex justify-content-center align-content-center pb-5 fw-bold'>Task Management</h3>

                    {loading && <p className="text-info d-flex justify-content-center align-items-center">Loading...</p>}
                    {error && <p className="text-danger">Error: {error}</p>}

                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add New Task</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newTask.todo}
                                        onChange={(e) => setNewTask({ ...newTask, todo: e.target.value })}
                                        placeholder="Enter new task"
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAdd}>
                                        <i className="fa fa-plus"></i> Add Task
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mb-5">
                        <div className="card-header">
                            <div className='d-flex justify-content-between'>
                                <h5 className="card-title mb-0">Task List</h5>

                                {/* Search Bar */}
                                <div className="row gap-2">
                                    <button type="button" className="btn btn-primary col-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Add Task
                                    </button>
                                    <div className="col-7">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search tasks"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <Table className="table table-striped table-responsive-md">
                                <Thead>
                                    <Tr>
                                        <Th>No</Th>
                                        <Th>Title</Th>
                                        <Th>Status</Th>
                                        <Th>Change Status</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {currentTasks.map((task, index) => (
                                        <Tr key={task.id}>
                                            <Td>{indexOfFirstTask + index + 1}</Td>
                                            <Td>
                                                {isEditing === task.id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editTodo}
                                                        onChange={(e) => setEditTodo(e.target.value)}
                                                    />
                                                ) : (
                                                    task.todo
                                                )}
                                            </Td>
                                            <Td>{task.completed ? <p className="text-success">Done</p> : <p className="text-warning">In Progress</p>}</Td>
                                            <Td>
                                                <button
                                                    className={`btn ${task.completed ? 'btn-outline-secondary' : 'btn-outline-secondary'} `}
                                                    onClick={() => handleStatusChange(task)}
                                                >
                                                    {task.completed ? 'Move to In Progress' : 'Move to Done'}
                                                </button>
                                            </Td>

                                            <Td>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn"
                                                        type="button"
                                                        id={`dropdownMenuButton${task.id}`}
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        onClick={() => setShowActions(!showActions)}
                                                    >
                                                        <i className="fa fa-ellipsis-v"></i> {/* Three dots icon */}
                                                    </button>

                                                    {/* Action menu */}
                                                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${task.id}`}>
                                                        {isEditing === task.id ? (
                                                            <div className="d-flex ">
                                                                <li>
                                                                    <button className="btn dropdown-item" onClick={() => handleSaveEdit(task)}>
                                                                        <i className="fa fa-save"></i>
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button className="btn dropdown-item" onClick={() => setIsEditing(null)}>
                                                                        <i className="fa fa-times"></i>
                                                                    </button>
                                                                </li>
                                                                <Link className="btn" to={`/task/${task.id}`}>
                                                                    <i className="fa fa-info-circle"></i>
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex ">
                                                                <li>
                                                                    <button className="btn dropdown-item" onClick={() => handleEdit(task)}>
                                                                        <i className="fa fa-pencil"></i>
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button className="btn dropdown-item" onClick={() => handleDelete(task.id)}>
                                                                        <i className="fa fa-trash"></i>
                                                                    </button>
                                                                </li>
                                                                <Link className="btn" to={`/task/${task.id}`}>
                                                                    <i className="fa fa-info-circle"></i>
                                                                </Link>
                                                            </div>
                                                        )}

                                                    </ul>
                                                </div>
                                            </Td>

                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>

                            <nav>
                                <ul className="pagination justify-content-end mt-4">
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button onClick={() => paginate(index + 1)} className="page-link">
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TaskBoard;
