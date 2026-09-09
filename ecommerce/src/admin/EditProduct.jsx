import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "./admin.css";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    image: ""
  });

  const [loading, setLoading] = useState(true);


  // Get product details
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Product not found");
          return;
        }

        setProduct({
          name: data.name || "",
          price: data.price || "",
          category: data.category || "",
          description: data.description || "",
          stock: data.stock || "",
          image: data.image || ""
        });

      } catch (error) {

        console.error(
          "FETCH PRODUCT ERROR:",
          error
        );

        alert("Unable to load product");

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);


  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value
    });

  };


  // Update product
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(product)
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          "Failed to update product"
        );

        return;

      }

      alert(
        "Product updated successfully"
      );

      navigate("/admin/products");

    } catch (error) {

      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      alert(
        "Something went wrong"
      );

    }

  };


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


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="admin-content">

          <div className="products-heading">

            <div>

              <h1>
                Edit Product
              </h1>

              <p>
                Update product information
              </p>

            </div>

            <Link
              to="/admin/products"
              className="back-button"
            >
              ← Back to Products
            </Link>

          </div>


          <div className="product-form-container">

            <form onSubmit={handleSubmit}>

              {/* Product Name */}

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Price and Stock */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
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
                    value={product.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />

                </div>

              </div>


              {/* Category */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
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


              {/* Image */}

              <div className="form-group">

                <label>
                  Product Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={product.image}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />

              </div>


              {/* Description */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />

              </div>


              {/* Buttons */}

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
                >
                  Update Product
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