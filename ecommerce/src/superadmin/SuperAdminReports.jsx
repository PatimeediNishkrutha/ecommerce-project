import React, { useEffect, useState } from "react";
import axios from "axios";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./SuperAdminReports.css";

function SuperAdminReports() {
  const [reports, setReports] = useState(null);

  // =====================================================
  // FETCH REVENUE & REPORTS
  // =====================================================

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("superAdminToken");

        const response = await axios.get(
          "http://localhost:5000/api/superadmin/reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "REVENUE REPORTS:",
          JSON.stringify(response.data, null, 2)
        );

        setReports(response.data);
      } catch (error) {
        console.error(
          "FETCH REVENUE REPORTS ERROR:",
          error
        );
      }
    };

    fetchReports();
  }, []);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="super-admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <SuperAdminSidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="super-admin-main-content super-admin-reports-container">

        <h1>Revenue & Reports</h1>

        <p className="reports-subtitle">
          Super Admin can view overall revenue and order
          reports here.
        </p>

        {/* =================================================
            LOADING
        ================================================= */}

        {!reports ? (

          <p>Loading reports...</p>

        ) : (

          <>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="reports-summary">

              {/* TOTAL REVENUE */}

              <div className="report-card">

                <h3>
                  Total Revenue
                </h3>

                <h2>
                  ₹{reports.totalRevenue}
                </h2>

              </div>


              {/* TOTAL ORDERS */}

              <div className="report-card">

                <h3>
                  Total Orders
                </h3>

                <h2>
                  {reports.totalOrders}
                </h2>

              </div>

            </div>


            {/* =================================================
                ORDER STATUS
            ================================================= */}

            <div className="order-status-card">

              <h2>
                Order Status
              </h2>


              {/* PENDING */}

              <div className="status-row">

                <span className="status-name">
                  Pending
                </span>

                <span className="status-count">
                  {reports.orderStatus?.pending || 0}
                </span>

              </div>


              {/* CONFIRMED */}

              <div className="status-row">

                <span className="status-name">
                  Confirmed
                </span>

                <span className="status-count">
                  {reports.orderStatus?.confirmed || 0}
                </span>

              </div>


              {/* SHIPPED */}

              <div className="status-row">

                <span className="status-name">
                  Shipped
                </span>

                <span className="status-count">
                  {reports.orderStatus?.shipped || 0}
                </span>

              </div>


              {/* DELIVERED */}

              <div className="status-row">

                <span className="status-name">
                  Delivered
                </span>

                <span className="status-count">
                  {reports.orderStatus?.delivered || 0}
                </span>

              </div>


              {/* CANCELLED */}

              <div className="status-row">

                <span className="status-name">
                  Cancelled
                </span>

                <span className="status-count">
                  {reports.orderStatus?.cancelled || 0}
                </span>

              </div>

            </div>

          </>

        )}

      </main>

    </div>
  );
}

export default SuperAdminReports;