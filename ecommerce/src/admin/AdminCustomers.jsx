import React, {
  useEffect,
  useState,
} from "react";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

function AdminCustomers() {

  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ======================================================
  // FETCH CUSTOMERS
  // ======================================================

  const fetchCustomers = async () => {

    try {

      const token =
        localStorage.getItem(
          "adminToken"
        );


      console.log(
        "ADMIN TOKEN FOR CUSTOMERS:",
        token
      );


      if (!token) {

        console.log(
          "ADMIN TOKEN NOT FOUND"
        );

        setLoading(false);

        return;
      }


      const response =
        await fetch(
          "http://localhost:5000/api/orders/customers",
          {

            method: "GET",

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }
        );


      const data =
        await response.json();


      console.log(
        "CUSTOMERS RESPONSE:",
        data
      );


      if (!response.ok) {

        alert(
          data.message ||
          "Failed to fetch customers"
        );

        return;
      }


      setCustomers(
        data.customers || []
      );


    } catch (error) {

      console.error(
        "FETCH CUSTOMERS ERROR:",
        error
      );


      alert(
        "Unable to connect to the server"
      );


    } finally {

      setLoading(false);

    }

  };


  // ======================================================
  // LOAD CUSTOMERS
  // ======================================================

  useEffect(() => {

    fetchCustomers();

  }, []);


  // ======================================================
  // PAGE
  // ======================================================

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}

      <AdminSidebar />


      {/* MAIN */}

      <div className="admin-main">

        {/* NAVBAR */}

        <AdminNavbar />


        {/* CONTENT */}

        <main className="admin-content">


          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="products-heading">

            <div>

              <h1>
                Customers
              </h1>

              <p>
                Customers who purchased your products
              </p>

            </div>

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="product-form-container">

              <h3>
                Loading customers...
              </h3>

            </div>


          ) : customers.length === 0 ? (

            // =================================================
            // NO CUSTOMERS
            // =================================================

            <div className="product-form-container">

              <h3>
                No Customers Found
              </h3>

              <p>
                Customers will appear here after
                purchasing your products.
              </p>

            </div>


          ) : (

            // =================================================
            // CUSTOMERS TABLE
            // =================================================

            <div className="product-form-container">

              <div
                style={{
                  overflowX: "auto",
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                  }}
                >

                  <thead>

                    <tr>

                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        Customer
                      </th>


                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        Email
                      </th>


                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        Phone
                      </th>


                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        City
                      </th>


                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        Orders
                      </th>


                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        Total Spent
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {customers.map(
                      (customer) => (

                        <tr
                          key={
                            customer._id
                          }
                        >

                          {/* NAME */}

                          <td
                            style={{
                              padding:
                                "12px",
                              fontWeight:
                                "600",
                            }}
                          >

                            {
                              customer.name
                            }

                          </td>


                          {/* EMAIL */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            {
                              customer.email
                            }

                          </td>


                          {/* PHONE */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            {
                              customer.phone ||
                              "N/A"
                            }

                          </td>


                          {/* CITY */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            {
                              customer.city ||
                              "N/A"
                            }

                          </td>


                          {/* ORDERS */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            {
                              customer.totalOrders
                            }

                          </td>


                          {/* TOTAL SPENT */}

                          <td
                            style={{
                              padding:
                                "12px",
                              fontWeight:
                                "600",
                            }}
                          >

                            ₹
                            {Number(
                              customer.totalSpent
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>

  );

}

export default AdminCustomers;