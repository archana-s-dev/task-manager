import { useState } from "react";
import api from "../services/api";

function TaskForm({ onClose, onTaskCreated, taskToEdit }) {
  const isEditing = Boolean(taskToEdit);

  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(
    taskToEdit?.description || ""
  );
  const [priority, setPriority] = useState(
    taskToEdit?.priority || "Medium"
  );
  const [dueDate, setDueDate] = useState(
    taskToEdit?.dueDate
      ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10)
      : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
    };

    try {
      if (isEditing) {
        await api.put(`/tasks/${taskToEdit._id}`, taskData);
      } else {
        await api.post("/tasks", taskData);
      }

      await onTaskCreated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${isEditing ? "update" : "create"} task. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-modal-backdrop">
      <form className="task-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Task" : "Create New Task"}</h2>
        <p className="task-form-subtitle">
          {isEditing
            ? "Update your task details."
            : "Add a task to your personal task list."}
        </p>

        {error && <div className="form-error">{error}</div>}

        <label htmlFor="task-title">Task Title *</label>
        <input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Complete project report"
          required
          maxLength={150}
        />

        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add some details..."
          rows={3}
        />

        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label htmlFor="task-due-date">Due Date</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="task-form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-task-button"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
