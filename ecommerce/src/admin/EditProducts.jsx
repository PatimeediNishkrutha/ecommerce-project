import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

function EditProduct() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    image: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = () => {
    return localStorage.getItem(
      "adminToken"
    );
  };

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  const fetchProduct = async () => {

    try {

      setLoading(true);

      const token =
        getAdminToken();

      if (!token) {

        alert(
          "Please login as admin first."
        );

        navigate(
          "/admin/login"
        );

        return;
      }

      const response =
        await fetch(
          `http://localhost:5000/api/products/${id}`
        );

      const data =
        await response.json();

      console.log(
        "PRODUCT:",
        data
      );

      if (!response.ok) {

        alert(
          data.message ||
          "Unable to fetch product"
        );

        navigate(
          "/admin/products"
        );

        return;
      }

      setProduct({

        name:
          data.name || "",

        price:
          data.price ?? "",

        category:
          data.category || "",

        description:
          data.description || "",

        stock:
          data.stock ?? "",

        image:
          data.image || "",

      });

    } catch (error) {

      console.error(
        "FETCH PRODUCT ERROR:",
        error
      );

      alert(
        "Unable to connect to server."
      );

      navigate(
        "/admin/products"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // LOAD PRODUCT
  // =====================================================

  useEffect(() => {

    fetchProduct();

  }, [id]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setProduct(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      const token =
        getAdminToken();

      if (!token) {

        alert(
          "Please login as admin first."
        );

        navigate(
          "/admin/login"
        );

        return;
      }

      const response =
        await fetch(
          `http://localhost:5000/api/products/${id}`,
          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify({

                name:
                  product.name,

                description:
                  product.description,

                price:
                  Number(
                    product.price
                  ),

                category:
                  product.category,

                stock:
                  Number(
                    product.stock
                  ),

                image:
                  product.image,

              }),

          }
        );

      const data =
        await response.json();

      console.log(
        "UPDATE PRODUCT RESPONSE:",
        data
      );

      // =================================================
      // UNAUTHORIZED
      // =================================================

      if (
        response.status === 401
      ) {

        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );

        alert(
          "Admin session expired. Please login again."
        );

        navigate(
          "/admin/login"
        );

        return;
      }

      // =================================================
      // FORBIDDEN
      // =================================================

      if (
        response.status === 403
      ) {

        alert(
          data.message ||
          "You are not authorized to edit this product."
        );

        return;
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      if (!response.ok) {

        alert(
          data.message ||
          "Failed to update product"
        );

        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Product updated successfully!"
      );

      navigate(
        "/admin/products"
      );

    } catch (error) {

      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      alert(
        "Unable to connect to server."
      );

    } finally {

      setSaving(false);

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
              Loading product...
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

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="admin-content">

          {/* HEADER */}

          <div className="products-heading">

            <div>

              <h1>
                Edit Product
              </h1>

              <p>
                Update your product information
              </p>

            </div>

            <Link
              to="/admin/products"
              className="back-button"
            >
              ← Back to Products
            </Link>

          </div>

          {/* FORM */}

          <div className="product-form-container">

            <form
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    product.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* PRICE + STOCK */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      product.price
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={
                      product.stock
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    required
                  />

                </div>

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={
                    product.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Mobile">
                    Mobile
                  </option>

                  <option value="Laptop">
                    Laptop
                  </option>

                  <option value="Audio">
                    Audio
                  </option>

                  <option value="Wearables">
                    Wearables
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* IMAGE */}

              <div className="form-group">

                <label>
                  Product Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={
                    product.image
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter image URL"
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    product.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="5"
                  required
                />

              </div>

              {/* BUTTONS */}

              <div className="form-buttons">

                <Link
                  to="/admin/products"
                  className="cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="save-product-button"
                  disabled={saving}
                >
                  {saving
                    ? "Updating..."
                    : "Update Product"}
                </button>

              </div>

            </form>

          </div>

        </main>

      </div>

    </div>

  );
}

export default EditProduct;