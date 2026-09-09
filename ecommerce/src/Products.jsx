import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      console.log("Products API response:", response.data);

      const productData = Array.isArray(response.data)
        ? response.data
        : response.data.products || [];

      setProducts(productData);

    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="products-message">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-message">
        <h2>Unable to load products</h2>

        <p>{error}</p>

        <button onClick={fetchProducts}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">

      <div className="products-header">
        <h1>Our Products</h1>

        <p>
          Find the perfect products for you
        </p>
      </div>

      {products.length === 0 ? (
        <div className="products-message">
          <h2>No products available</h2>

          <p>
            Products added by the admin will
            appear here.
          </p>
        </div>
      ) : (
        <div className="products-grid">

          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Products;