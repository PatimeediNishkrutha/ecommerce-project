import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./ManageAdmins.css";

function ManageAdmins() {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  // =====================================================
  // FETCH ALL ADMINS
  // =====================================================

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("superAdminToken");

      const response = await axios.get(
        "http://localhost:5000/api/superadmin/admins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADMINS RESPONSE:", response.data);

      setAdmins(response.data.admins || []);
    } catch (error) {
      console.error("FETCH ADMINS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load admins"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DEACTIVATE ADMIN
  // =====================================================

  const handleDeactivate = async (adminId) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this admin?"
    );

    if (!confirmDeactivate) {
      return;
    }

    try {
      const token = localStorage.getItem("superAdminToken");

      const response = await axios.put(
        `http://localhost:5000/api/superadmin/admins/${adminId}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "DEACTIVATE ADMIN RESPONSE:",
        response.data
      );

      // Refresh admin list
      fetchAdmins();
    } catch (error) {
      console.error(
        "DEACTIVATE ADMIN ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to deactivate admin"
      );
    }
  };

  // =====================================================
  // REACTIVATE ADMIN
  // =====================================================

  const handleReactivate = async (adminId) => {
    const confirmReactivate = window.confirm(
      "Are you sure you want to reactivate this admin?"
    );

    if (!confirmReactivate) {
      return;
    }

    try {
      const token = localStorage.getItem("superAdminToken");

      const response = await axios.put(
        `http://localhost:5000/api/superadmin/admins/${adminId}/reactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "REACTIVATE ADMIN RESPONSE:",
        response.data
      );

      // Refresh admin list
      fetchAdmins();
    } catch (error) {
      console.error(
        "REACTIVATE ADMIN ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to reactivate admin"
      );
    }
  };

  // =====================================================
  // ADD ADMIN
  // =====================================================

  const handleAddAdmin = () => {
    navigate("/superadmin/admins/add");
  };

  // =====================================================
  // EDIT ADMIN
  // =====================================================

  const handleEditAdmin = (admin) => {
    navigate("/superadmin/admins/edit", {
      state: {
        admin,
      },
    });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="super-admin-layout">

      {/* ================= SIDEBAR ================= */}

      <SuperAdminSidebar />

      {/* ================= MAIN CONTENT ================= */}

      <main className="super-admin-main-content">

        {/* ================= HEADER ================= */}

        <div className="manage-admins-header">

          <div>
            <h1>Manage Admins</h1>

            <p>
              Create and manage all administrators
            </p>
          </div>

          {/* ================= ADD ADMIN BUTTON ================= */}

          <button
            className="add-admin-button"
            onClick={handleAddAdmin}
          >
            + Add Admin
          </button>

        </div>

        {/* ================= ADMINS TABLE ================= */}

        <div className="admins-table-container">

          {/* ================= LOADING ================= */}

          {loading ? (
            <p className="admins-message">
              Loading admins...
            </p>

          ) : error ? (

            /* ================= ERROR ================= */

            <p className="admins-error">
              {error}
            </p>

          ) : (

            /* ================= TABLE ================= */

            <table className="admins-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {/* ================= NO ADMINS ================= */}

                {admins.length === 0 ? (

                  <tr>
                    <td colSpan="5">
                      No admins found
                    </td>
                  </tr>

                ) : (

                  /* ================= ADMIN LIST ================= */

                  admins.map((admin) => (

                    <tr key={admin._id}>

                      {/* NAME */}

                      <td>
                        {admin.name}
                      </td>

                      {/* EMAIL */}

                      <td>
                        {admin.email}
                      </td>

                      {/* ROLE */}

                      <td>
                        {admin.role}
                      </td>

                      {/* STATUS */}

                      <td>
                        {admin.isActive === false
                          ? "Deactivated"
                          : "Active"}
                      </td>

                      {/* ACTIONS */}

                      <td>

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleEditAdmin(admin)
                          }
                        >
                          Edit
                        </button>

                        {/* REACTIVATE / DEACTIVATE */}

                        {admin.isActive === false ? (

                          <button
                            className="reactivate-admin-button"
                            onClick={() =>
                              handleReactivate(
                                admin._id
                              )
                            }
                          >
                            Reactivate
                          </button>

                        ) : (

                          <button
                            className="deactivate-admin-button"
                            onClick={() =>
                              handleDeactivate(
                                admin._id
                              )
                            }
                          >
                            Deactivate
                          </button>

                        )}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          )}

        </div>

      </main>

    </div>
  );
}

export default ManageAdmins;