import { useEffect, useState } from "react";
import { Plus, Search, Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TaskForm from "../components/TaskForm";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = storedUser.name
    ? storedUser.name.split(" ")[0]
    : "User";

  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    try {
      setError("");
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load tasks. Please try logging in again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High" && task.status !== "Completed"
  ).length;

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task.");
    }
  };

  const handleStatusChange = async (task) => {
    const newStatus =
      task.status === "Completed" ? "Pending" : "Completed";

    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your tasks and stay productive.</p>
          </div>

          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search"
              onClick={() =>
                document.getElementById("task-search")?.focus()
              }
            >
              <Search size={20} />
            </button>

            <button className="icon-button" aria-label="Notifications">
              <Bell size={20} />
            </button>

            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <h2>Welcome back, {firstName}! 👋</h2>
            <p>Here's an overview of your productivity.</p>
          </div>

          <button
            className="add-task-button"
            onClick={() => setShowTaskForm(true)}
          >
            <Plus size={19} />
            Add New Task
          </button>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <p>Total Tasks</p>
            <h3>{totalTasks}</h3>
            <span>All your tasks</span>
          </article>

          <article className="stat-card">
            <p>Pending Tasks</p>
            <h3>{pendingTasks}</h3>
            <span>Waiting to be completed</span>
          </article>

          <article className="stat-card">
            <p>Completed Tasks</p>
            <h3>{completedTasks}</h3>
            <span>Tasks finished</span>
          </article>

          <article className="stat-card">
            <p>High Priority</p>
            <h3>{highPriorityTasks}</h3>
            <span>Uncompleted high-priority tasks</span>
          </article>
        </section>
        
        <section className="progress-section">
          <div className="progress-heading">
            <div>
              <h2>Task Progress</h2>
              <p>Keep going! Every completed task counts.</p>
            </div>

            <span className="progress-percentage">
              {completionPercentage}%
            </span>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Task completion progress"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <p className="progress-caption">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </section>

        <section className="tasks-section">
          <div className="tasks-heading">
            <div>
              <h2>My Tasks</h2>
              <p>View and manage your tasks.</p>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="task-toolbar">
            <input
              id="task-search"
              type="search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter tasks by status"
            >
              <option value="All">All Tasks</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <p className="task-message">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-tasks">
              <div className="empty-icon">
                <Plus size={27} />
              </div>
              <h3>No tasks found</h3>
              <p>Create a task to get started.</p>
              <button
                className="add-task-button"
                onClick={() => setShowTaskForm(true)}
              >
                <Plus size={18} />
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks
                .filter((task) => {
                  const query = searchTerm.toLowerCase();
                  return (
                    task.title.toLowerCase().includes(query) ||
                    (task.description || "").toLowerCase().includes(query)
                  );
                })
                .map((task) => (
                  <article
                    className={`task-row ${
                      task.status !== "Completed" &&
                      task.dueDate &&
                      new Date(task.dueDate) <
                      new Date(new Date().setHours(0, 0, 0, 0))
                      ? "task-overdue"
                      : ""
                  }`}
                  key={task._id}
                  >
                    <input
                      type="checkbox"
                      checked={task.status === "Completed"}
                      onChange={() => handleStatusChange(task)}
                      aria-label={`Mark ${task.title} as ${
                        task.status === "Completed" ? "pending" : "completed"
                      }`}
                    />

                    <div className="task-row-content">
                      <h3
                        className={
                          task.status === "Completed" ? "task-done" : ""
                        }
                      >
                        {task.title}
                      </h3>

                      {task.description && <p>{task.description}</p>}

                      <div className="task-meta">
                        <span className={`priority-${task.priority.toLowerCase()}`}>
                          {task.priority} Priority
                        </span>
                        <span>{task.status}</span>
                        {task.dueDate && (
                          <span>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}

                        {task.status !== "Completed" &&
                          task.dueDate &&
                          new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) && (
                            <span className="overdue-label">Overdue</span>
                        )}
                      </div>
                    </div>

                    <div className="task-row-actions">
                      <button
                        className="edit-task-button"
                        onClick={() => setTaskToEdit(task)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-task-button"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>
      </main>

      {(showTaskForm || taskToEdit) && (
        <TaskForm
          taskToEdit={taskToEdit}
          onClose={() => {
            setShowTaskForm(false);
            setTaskToEdit(null);
          }}
          onTaskCreated={fetchTasks}
        />
      )}
    </div>
  );
}

export default Dashboard;
