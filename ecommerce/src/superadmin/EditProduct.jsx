import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "./EditProduct.css";

function EditProduct() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    stock: product?.stock || "",
    image: product?.image || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("EDIT PRODUCT DATA:", formData);
  };

  if (!product) {
    return (
      <div className="super-admin-layout">
        <SuperAdminSidebar />

        <main className="super-admin-main-content">
          <h1>Product Not Found</h1>

          <button
            onClick={() =>
              navigate("/superadmin/products")
            }
          >
            Back to All Products
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="edit-product-page">

      <SuperAdminSidebar />

      <main className="edit-product-content">

        <div className="edit-product-header">
          <h1>Edit Product</h1>

          <p>
            Update product information
          </p>
        </div>

        <div className="edit-product-card">

          <form
            className="edit-product-form"
            onSubmit={handleSubmit}
          >

            <div className="edit-product-input-group">
              <label>Product Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-product-input-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="edit-product-row">

              <div className="edit-product-input-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="edit-product-input-group">
                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

            </div>

            <div className="edit-product-input-group">
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-product-input-group">
              <label>Image URL</label>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div className="edit-product-actions">

              <button
                type="button"
                className="cancel-product-button"
                onClick={() =>
                  navigate("/superadmin/products")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-button"
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

export default EditProduct;