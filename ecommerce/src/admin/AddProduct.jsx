import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

function AddProduct() {
  const navigate = useNavigate();

  // ======================================================
  // CLOUDINARY CONFIGURATION
  // ======================================================

  const CLOUDINARY_CLOUD_NAME = "uk7te9ti";
  const CLOUDINARY_UPLOAD_PRESET = "ecommerce";

  // ======================================================
  // PRODUCT STATE
  // ======================================================

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // ======================================================
  // HANDLE INPUT CHANGES
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // ======================================================
  // CLOUDINARY IMAGE UPLOAD
  // ======================================================

  const openCloudinaryWidget = () => {
    // Check whether Cloudinary script has loaded
    if (!window.cloudinary) {
      alert(
        "Cloudinary is not loaded. Please refresh the page and try again."
      );
      return;
    }

    setImageUploading(true);

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,

        // Allow image selection from computer
        sources: ["local", "camera"],

        // Only one image
        multiple: false,
        maxFiles: 1,

        // Only images
        resourceType: "image",

        // Allowed image formats
        clientAllowedFormats: [
          "jpg",
          "jpeg",
          "png",
          "webp",
        ],

        // Maximum file size = 5 MB
        maxFileSize: 5000000,

        // Enable cropping
        cropping: true,

        // Square crop
        croppingAspectRatio: 1,

        showSkipCropButton: false,
      },

      (error, result) => {
        // ==================================================
        // CLOUDINARY ERROR
        // ==================================================

        if (error) {
          console.error(
            "CLOUDINARY ERROR:",
            error
          );

          setImageUploading(false);

          alert(
            "Image upload failed. Please try again."
          );

          return;
        }

        // ==================================================
        // UPLOAD SUCCESS
        // ==================================================

        if (
          result &&
          result.event === "success"
        ) {
          console.log(
            "CLOUDINARY IMAGE INFORMATION:",
            result.info
          );

          // Get secure HTTPS image URL
          const imageUrl =
            result.info.secure_url;

          // Save Cloudinary URL into product state
          setProduct((prevProduct) => ({
            ...prevProduct,
            image: imageUrl,
          }));

          setImageUploading(false);

          alert(
            "Image uploaded successfully!"
          );
        }

        // ==================================================
        // WIDGET CLOSED
        // ==================================================

        if (
          result &&
          result.event === "close"
        ) {
          setImageUploading(false);
        }
      }
    );

    widget.open();
  };

  // ======================================================
  // ADD PRODUCT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ====================================================
    // CHECK IMAGE
    // ====================================================

    if (!product.image) {
      alert("Please upload a product image first.");
      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // GET ADMIN TOKEN
      // ==================================================

      const token =
        localStorage.getItem("adminToken");

      console.log(
        "ADMIN TOKEN FOR ADD PRODUCT:",
        token
      );

      // ==================================================
      // CHECK ADMIN LOGIN
      // ==================================================

      if (!token) {
        alert(
          "Please login as admin first"
        );

        navigate("/admin/login");

        return;
      }

      // ==================================================
      // SEND PRODUCT TO BACKEND
      // ==================================================

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            // IMPORTANT:
            // Send ADMIN token
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: product.name,

            price: Number(product.price),

            category: product.category,

            description: product.description,

            stock: Number(product.stock),

            // Cloudinary URL
            image: product.image,
          }),
        }
      );

      // ==================================================
      // GET BACKEND RESPONSE
      // ==================================================

      const data =
        await response.json();

      console.log(
        "ADD PRODUCT RESPONSE:",
        data
      );

      // ==================================================
      // HANDLE ERROR
      // ==================================================

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to add product"
        );

        return;
      }

      // ==================================================
      // SUCCESS
      // ==================================================

      alert(
        "Product added successfully!"
      );

      // Go back to products page
      navigate(
        "/admin/products"
      );

    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
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
  // PAGE
  // ======================================================

  return (
    <div className="admin-layout">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <AdminSidebar />

      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <div className="admin-main">

        {/* ==================================================
            NAVBAR
        ================================================== */}

        <AdminNavbar />

        {/* ==================================================
            CONTENT
        ================================================== */}

        <main className="admin-content">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="products-heading">

            <div>
              <h1>
                Add Product
              </h1>

              <p>
                Add a new product to your store
              </p>
            </div>

            <Link
              to="/admin/products"
              className="back-button"
            >
              ← Back to Products
            </Link>

          </div>

          {/* ==================================================
              FORM CONTAINER
          ================================================== */}

          <div className="product-form-container">

            <form
              onSubmit={handleSubmit}
            >

              {/* ==================================================
                  PRODUCT NAME
              ================================================== */}

              <div className="form-group">

                <label htmlFor="name">
                  Product Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />

              </div>

              {/* ==================================================
                  PRICE + STOCK
              ================================================== */}

              <div className="form-row">

                {/* PRICE */}

                <div className="form-group">

                  <label htmlFor="price">
                    Price
                  </label>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    min="0"
                    required
                  />

                </div>

                {/* STOCK */}

                <div className="form-group">

                  <label htmlFor="stock">
                    Stock
                  </label>

                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    min="0"
                    required
                  />

                </div>

              </div>

              {/* ==================================================
                  CATEGORY
              ================================================== */}

              <div className="form-group">

                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
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

              {/* ==================================================
                  PRODUCT IMAGE
              ================================================== */}

              <div className="form-group">

                <label>
                  Product Image
                </label>

                {/* UPLOAD BUTTON */}

                <button
                  type="button"
                  className="save-product-button"
                  onClick={
                    openCloudinaryWidget
                  }
                  disabled={
                    imageUploading ||
                    loading
                  }
                >

                  {imageUploading
                    ? "Uploading Image..."
                    : "📷 Upload Product Image"}

                </button>

                {/* IMAGE PREVIEW */}

                {product.image && (
                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >

                    <p
                      style={{
                        marginBottom: "10px",
                        fontWeight: "600",
                      }}
                    >
                      Image Preview
                    </p>

                    <img
                      src={product.image}
                      alt="Product Preview"
                      style={{
                        width: "180px",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border:
                          "1px solid #ddd",
                        display: "block",
                      }}
                    />

                  </div>
                )}

              </div>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div className="form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    product.description
                  }
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="5"
                  required
                />

              </div>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div className="form-buttons">

                {/* CANCEL */}

                <Link
                  to="/admin/products"
                  className="cancel-button"
                >
                  Cancel
                </Link>

                {/* ADD PRODUCT */}

                <button
                  type="submit"
                  className="save-product-button"
                  disabled={
                    loading ||
                    imageUploading
                  }
                >

                  {loading
                    ? "Adding Product..."
                    : "Add Product"}

                </button>

              </div>

            </form>

          </div>

        </main>

      </div>

    </div>
  );
}

export default AddProduct;