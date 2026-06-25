import React from 'react';
import { Task } from '../api/taskApi';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: number, newStatus: Task['status']) => void;
  onDelete: (taskId: number) => void;
  isUpdating?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete, isUpdating = false }) => {
  const priorityClass = `priority-${task.priority.toLowerCase()}`;
  const statusClass = `status-${task.status.toLowerCase()}`;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as Task['status']);
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-badges">
          <span className={`badge priority ${priorityClass}`}>{task.priority}</span>
          <span className={`badge status ${statusClass}`}>{task.status.replace('_', ' ')}</span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <div className="form-group">
          <label htmlFor={`status-${task.id}`}>Status:</label>
          <select
            id={`status-${task.id}`}
            value={task.status}
            onChange={handleStatusChange}
            className="status-select"
            disabled={isUpdating}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          {isUpdating && <span className="status-loading">Updating...</span>}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="btn-delete"
          disabled={isUpdating}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
