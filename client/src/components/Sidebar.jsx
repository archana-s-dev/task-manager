import { LayoutDashboard, CheckSquare, Clock, CheckCircle, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <CheckSquare size={29} />
        <span>TaskManager</span>
      </div>

      <p className="sidebar-label">MENU</p>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <button
          className="sidebar-link"
          onClick={() => navigate("/dashboard?status=Pending")}
        >
          <Clock size={19} />
          <span>Pending Tasks</span>
        </button>

        <button
          className="sidebar-link"
          onClick={() => navigate("/dashboard?status=Completed")}
        >
          <CheckCircle size={19} />
          <span>Completed Tasks</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-link logout-link" onClick={handleLogout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
