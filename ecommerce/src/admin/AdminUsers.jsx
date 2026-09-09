import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/Admin.css";

function AdminUsers() {

  const users = [
    {
      id: 1,
      name: "Nishkrutha",
      email: "user@gmail.com",
      role: "user",
    },
    {
      id: 2,
      name: "Admin",
      email: "admin@gmail.com",
      role: "admin",
    },
  ];

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <div className="admin-content">

          <h1>Users</h1>

          <p>Manage registered users.</p>

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>{user.id}</td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className={`role ${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;