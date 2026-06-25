import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, authApi, taskApi } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import '../styles/TasksPage.css';

type StatusFilter = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE';

type TaskStatusUpdate = {
  status: Task['status'];
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTasks();
      setTasks(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError('');
    setIsCreating(true);

    try {
      const response = await taskApi.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, response.data]);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: Task['status']) => {
    setError('');
    setUpdatingTaskId(taskId);

    try {
      const updateData: TaskStatusUpdate = { status: newStatus };
      const response = await taskApi.updateTask(taskId, updateData);
      setTasks(prevTasks => prevTasks.map(t => (t.id === taskId ? response.data : t)));
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const promptDeleteTask = (taskId: number) => {
    setPendingDeleteTaskId(taskId);
  };

  const cancelDelete = () => {
    setPendingDeleteTaskId(null);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteTaskId === null) {
      return;
    }

    setError('');
    setIsDeleting(true);

    try {
      await taskApi.deleteTask(pendingDeleteTaskId);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== pendingDeleteTaskId));
      setPendingDeleteTaskId(null);
      setError('');
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout request failed', err);
    } finally {
      navigate('/login');
    }
  };

  const pendingDeleteTask = tasks.find(task => task.id === pendingDeleteTaskId) ?? null;

  const filteredTasks = statusFilter === 'ALL'
    ? tasks
    : tasks.filter(task => task.status === statusFilter);

  return (
    <div className="tasks-page">
      <header className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p>Manage your daily tasks efficiently</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="tasks-controls">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="filter-select"
          >
            <option value="ALL">All Tasks</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + New Task
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="no-tasks">
          <p>
            {statusFilter === 'ALL'
              ? 'No tasks yet. Create one to get started!'
              : `No ${statusFilter.replace('_', ' ').toLowerCase()} tasks.`}
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleUpdateStatus}
              onDelete={promptDeleteTask}
              isUpdating={updatingTaskId === task.id}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
          isSubmitting={isCreating}
        />
      )}

      {pendingDeleteTask && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-description"
          onClick={cancelDelete}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 id="confirm-title">Confirm delete</h2>
            <p id="confirm-description">
              Are you sure you want to delete "{pendingDeleteTask.title}"?
            </p>
            <div className="form-actions">
              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
