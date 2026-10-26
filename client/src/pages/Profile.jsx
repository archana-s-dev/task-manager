import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, LockKeyhole, Trash2 } from "lucide-react";
import api from "../services/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const [name, setName] = useState(user.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.user);
        setName(response.data.user.name);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load profile.");
      }
    };

    loadProfile();
  }, []);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.put("/auth/profile", { name });
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setMessage(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <button className="profile-back" onClick={() => navigate("/dashboard")}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <header className="profile-header">
        <div className="profile-avatar">
          {(user.name || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <h1>My Profile</h1>
          <p>Manage your account details and security.</p>
        </div>
      </header>

      {message && <div className="profile-success">{message}</div>}
      {error && <div className="form-error">{error}</div>}

      <section className="profile-card">
        <div className="profile-card-heading">
          <UserRound size={21} />
          <div>
            <h2>Personal Information</h2>
            <p>Update your name and account details.</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate}>
          <label htmlFor="profile-name">Full Name</label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />

          <label htmlFor="profile-email">Email Address</label>
          <input
            id="profile-email"
            type="email"
            value={user.email || ""}
            readOnly
          />

          <button className="profile-primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section className="profile-card">
        <div className="profile-card-heading">
          <LockKeyhole size={21} />
          <div>
            <h2>Change Password</h2>
            <p>Choose a new password of at least 8 characters.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange}>
          <label htmlFor="current-password">Current Password</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
          />

          <button className="profile-primary-button" disabled={loading}>
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>
      </section>

      <section className="profile-card danger-card">
        <div className="profile-card-heading">
          <Trash2 size={21} />
          <div>
            <h2>Delete Account</h2>
            <p>
              Permanently delete your account and all tasks associated with it.
              This action cannot be undone.
            </p>
          </div>
        </div>

        <button
          className="delete-account-button"
          onClick={() => navigate("/delete-account")}
        >
          Delete My Account
        </button>
      </section>
    </div>
  );
}

export default Profile;
