import React, {
  useEffect,
  useState,
} from "react";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ======================================================
  // FETCH ADMIN ORDERS
  // ======================================================

  const fetchOrders = async () => {

    try {

      const token =
        localStorage.getItem(
          "adminToken"
        );


      console.log(
        "ADMIN TOKEN FOR ORDERS:",
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
          "http://localhost:5000/api/orders",
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
        "ADMIN ORDERS RESPONSE:",
        data
      );


      if (!response.ok) {

        alert(
          data.message ||
          "Failed to fetch orders"
        );

        return;
      }


      setOrders(
        data.orders || []
      );


    } catch (error) {

      console.error(
        "FETCH ORDERS ERROR:",
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
  // LOAD ORDERS
  // ======================================================

  useEffect(() => {

    fetchOrders();

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
                Orders
              </h1>

              <p>
                View orders placed for your products
              </p>

            </div>

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="product-form-container">

              <h3>
                Loading orders...
              </h3>

            </div>


          ) : orders.length === 0 ? (

            // =================================================
            // NO ORDERS
            // =================================================

            <div className="product-form-container">

              <h3>
                No Orders Found
              </h3>

              <p>
                Customers have not placed any
                orders for your products yet.
              </p>

            </div>


          ) : (

            // =================================================
            // ORDERS TABLE
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
                        Order ID
                      </th>


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
                        Products
                      </th>


                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        Total
                      </th>


                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        Status
                      </th>


                      <th
                        style={{
                          padding: "12px",
                          textAlign:
                            "left",
                        }}
                      >
                        Date
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {orders.map(
                      (order) => (

                        <tr
                          key={
                            order._id
                          }
                        >

                          {/* ORDER ID */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            #
                            {order._id.slice(
                              -6
                            )}

                          </td>


                          {/* CUSTOMER */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            <strong>

                              {
                                order.user
                                  ?.name ||
                                order.customer
                                  ?.name ||
                                "Unknown"
                              }

                            </strong>

                            <br />

                            <small>

                              {
                                order.user
                                  ?.email ||
                                "No email"
                              }

                            </small>

                          </td>


                          {/* PRODUCTS */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            {order.products?.map(
                              (
                                product,
                                index
                              ) => (

                                <div
                                  key={
                                    index
                                  }
                                  style={{
                                    marginBottom:
                                      "6px",
                                  }}
                                >

                                  {product.name}

                                  {" × "}

                                  {
                                    product.quantity
                                  }

                                </div>

                              )
                            )}

                          </td>


                          {/* TOTAL */}

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
                              order.totalAmount
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </td>


                          {/* STATUS */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            <span>

                              {
                                order.status
                              }

                            </span>

                          </td>


                          {/* DATE */}

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >

                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
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

export default AdminOrders;