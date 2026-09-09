import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./EditAdmin.css";

function EditAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  const admin = location.state?.admin;

  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("EDIT ADMIN DATA:", formData);
  };

  return (
    <div className="edit-admin-page">

      <SuperAdminSidebar />

      <main className="edit-admin-content">

        <div className="edit-admin-header">
          <h1>Edit Admin</h1>
          <p>Update administrator details</p>
        </div>

        <div className="edit-admin-card">

          <form
            className="edit-admin-form"
            onSubmit={handleSubmit}
          >

            <div className="edit-admin-input-group">
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

            <div className="edit-admin-input-group">
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

            <div className="edit-admin-actions">

              <button
                type="button"
                className="cancel-edit-button"
                onClick={() =>
                  navigate("/superadmin/admins")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-admin-button"
              >
                Save Changes
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default EditAdmin;