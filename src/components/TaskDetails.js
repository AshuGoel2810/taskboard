import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TaskDetails = () => {
    const { id } = useParams();
    const task = useSelector((state) => state.tasks.tasks.find((task) => task.id === parseInt(id)));

    if (!task) return <p className="text-center mt-4">Task not found</p>;

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-sm-12">
                <h3 className='d-flex justify-content-center align-content-center pb-5 fw-bold'>Task Management</h3>
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title">{task.title}</h1>
                            <p className="card-text">
                                <strong>Status:</strong> 
                                {task.completed ? (
                                    <span className="badge bg-success ms-2">Done</span>
                                ) : (
                                    <span className="badge bg-warning ms-2">In Progress</span>
                                )}
                            </p>
                            <p className="card-text"><strong>Description:</strong> {task.todo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
