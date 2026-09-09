import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./AddAdmin.css";

function AddAdmin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem(
        "superAdminToken"
      );

      const response = await axios.post(
        "http://localhost:5000/api/superadmin/admins",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "CREATE ADMIN RESPONSE:",
        response.data
      );

      setMessage(
        "Admin account created successfully!"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(
        "CREATE ADMIN ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to create admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-admin-page">

      <SuperAdminSidebar />

      <main className="add-admin-content">

        <div className="add-admin-header">
          <h1>Add New Admin</h1>

          <p>
            Create a new administrator account
          </p>
        </div>

        <div className="add-admin-card">

          <form
            className="add-admin-form"
            onSubmit={handleSubmit}
          >

            <div className="add-admin-input-group">
              <label>Admin Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter admin name"
                required
              />
            </div>

            <div className="add-admin-input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter admin email"
                required
              />
            </div>

            <div className="add-admin-input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="create-admin-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Admin"}
            </button>

          </form>

          {message && (
            <p className="admin-form-message">
              {message}
            </p>
          )}

        </div>

      </main>

    </div>
  );
}

export default AddAdmin;