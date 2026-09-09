import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  // =====================================================
  // FETCH ONLY LOGGED-IN ADMIN'S PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      console.log("ADMIN TOKEN FOR PRODUCTS:", token);

      if (!token) {
        setError("Admin login session not found.");
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/products/admin/my-products",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("ADMIN PRODUCTS RESPONSE:", data);

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        alert("Admin session expired. Please login again.");

        navigate("/admin/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "FETCH ADMIN PRODUCTS ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getAdminToken();

      console.log(
        "ADMIN TOKEN FOR DELETE:",
        token
      );

      if (!token) {
        alert("Please login as admin first.");
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "DELETE PRODUCT RESPONSE:",
        data
      );

      // =================================================
      // SESSION EXPIRED
      // =================================================

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        alert(
          "Admin session expired. Please login again."
        );

        navigate("/admin/login");

        return;
      }

      // =================================================
      // ADMIN NOT AUTHORIZED
      // =================================================

      if (response.status === 403) {
        alert(
          data.message ||
            "You are not authorized to delete this product."
        );

        return;
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete product"
        );

        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Product deleted successfully!"
      );

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) =>
            product._id !== id
        )
      );
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminNavbar />

          <main className="admin-content">
            <h2>
              Loading products...
            </h2>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

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

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="products-heading">

            <div>
              <h1>
                Products
              </h1>

              <p>
                Manage your products
              </p>
            </div>

            <Link
              to="/admin/products/add"
              className="add-product-button"
            >
              + Add Product
            </Link>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* =================================================
              NO PRODUCTS
          ================================================= */}

          {!error &&
            products.length === 0 && (
              <div className="empty-products">

                <h2>
                  No products found
                </h2>

                <p>
                  You have not added any
                  products yet.
                </p>

                <Link
                  to="/admin/products/add"
                  className="add-product-button"
                >
                  + Add Product
                </Link>

              </div>
            )}

          {/* =================================================
              PRODUCTS TABLE
          ================================================= */}

          {products.length > 0 && (

            <div className="products-table-section">

              <table>

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => (

                      <tr
                        key={product._id}
                      >

                        {/* ID */}

                        <td>
                          #
                          {product._id.slice(-6)}
                        </td>

                        {/* PRODUCT */}

                        <td>
                          <strong>
                            {product.name}
                          </strong>
                        </td>

                        {/* CATEGORY */}

                        <td>
                          {product.category}
                        </td>

                        {/* PRICE */}

                        <td>
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* STOCK */}

                        <td>

                          {Number(
                            product.stock
                          ) > 0 ? (

                            <span className="stock-available">
                              {product.stock}
                            </span>

                          ) : (

                            <span className="stock-out">
                              Out of Stock
                            </span>

                          )}

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="product-actions">

                            {/* EDIT */}

                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="edit-button"
                            >
                              Edit
                            </Link>

                            {/* DELETE */}

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                handleDelete(
                                  product._id,
                                  product.name
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}

export default AdminProducts;