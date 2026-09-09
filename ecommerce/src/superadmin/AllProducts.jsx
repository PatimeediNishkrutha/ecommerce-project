import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./AllProducts.css";

function AllProducts() {
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem(
        "superAdminToken"
      );

      const response = await axios.get(
        "http://localhost:5000/api/superadmin/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ALL PRODUCTS RESPONSE:",
        response.data
      );

      setProducts(response.data.products || []);
    } catch (error) {
      console.error(
        "FETCH ALL PRODUCTS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-admin-layout">

      <SuperAdminSidebar />

      <main className="super-admin-main-content">

        <div className="all-products-header">
          <div>
            <h1>All Products</h1>

            <p>
              View products from all administrators
            </p>
          </div>
        </div>

        <div className="all-products-table-container">

          {loading ? (
            <p className="all-products-message">
              Loading products...
            </p>
          ) : error ? (
            <p className="all-products-error">
              {error}
            </p>
          ) : (
            <table className="all-products-table">

              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Admin</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>

                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-table-image"
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>

                      <td>
                        {product.name}
                      </td>

                      <td>
                        {product.category}
                      </td>

                      <td>
                        ₹{product.price}
                      </td>

                      <td>
                        {product.stock}
                      </td>

                      <td>
                        {product.admin?.name ||
                          "Unknown Admin"}
                      </td>

                      <td>
                        {product.stock > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </td>
                      <td>
  <button
    className="edit-product-button"
    onClick={() =>
      navigate(
        `/superadmin/products/edit/${product._id}`,
        {
          state: {
            product,
          },
        }
      )
    }
  >
    Edit
  </button>
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

export default AllProducts;