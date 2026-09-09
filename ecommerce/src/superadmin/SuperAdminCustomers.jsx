import React, { useEffect, useState } from "react";
import axios from "axios";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./SuperAdminCustomers.css";

function SuperAdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("superAdminToken");

        const response = await axios.get(
          "http://localhost:5000/api/superadmin/customers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "ALL CUSTOMERS:",
          JSON.stringify(response.data, null, 2)
        );

        setCustomers(response.data.customers || []);
      } catch (error) {
        console.error(
          "FETCH ALL CUSTOMERS ERROR:",
          error
        );
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="super-admin-layout">

      <SuperAdminSidebar />

      <main className="super-admin-main-content">

        <h1>All Customers</h1>

        <p>
          Super Admin can view all customers here.
        </p>

        <h2>
          Total Customers: {customers.length}
        </h2>

        {customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          customers.map((customer) => (
            <div
              key={customer._id}
              className="super-admin-customer-card"
            >
              <h3>{customer.name}</h3>

              <p>
                <strong>Email:</strong>{" "}
                {customer.email}
              </p>

              <p>
                <strong>Customer ID:</strong>{" "}
                {customer._id}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {customer.role}
              </p>
            </div>
          ))
        )}

      </main>

    </div>
  );
}

export default SuperAdminCustomers;