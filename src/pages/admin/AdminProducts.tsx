import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminProducts.css";

import {
  useProductData,
} from "../../context/ProductContext";

import type {
  Product,
} from "../../data/technicalData";

type ProductStatus = "Active" | "Inactive";

const AdminProducts = () => {
  const navigate = useNavigate();

  const {
    products,
    addProduct,
    updateProduct,
  } = useProductData();

  const [showProductModal, setShowProductModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");

  const [status, setStatus] =
    useState<ProductStatus>("Active");

  const [searchTerm, setSearchTerm] = useState("");

  /* ==================================================
     ADD PRODUCT
  ================================================== */

  const openAddProduct = () => {
    setEditingProduct(null);

    setProductCode("");
    setProductName("");
    setStatus("Active");

    setShowProductModal(true);
  };

  /* ==================================================
     EDIT PRODUCT
  ================================================== */

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);

    setProductCode(product.productCode);
    setProductName(product.productName);
    setStatus(product.status);

    setShowProductModal(true);
  };

  /* ==================================================
     CLOSE MODAL
  ================================================== */

  const closeProductModal = () => {
    setShowProductModal(false);

    setEditingProduct(null);

    setProductCode("");
    setProductName("");
    setStatus("Active");
  };

  /* ==================================================
     SAVE PRODUCT
  ================================================== */

  const handleSaveProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        productName,
        status,
      });
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        productCode,
        productName,
        status,
      };

      addProduct(newProduct);
    }

    closeProductModal();
  };

  /* ==================================================
     SEARCH
  ================================================== */

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      product.productCode
        .toLowerCase()
        .includes(search) ||
      product.productName
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="admin-products-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-products-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage the products available in the Digital Batch
            Sheet Management System.
          </p>
        </div>

        <div className="admin-products-header-actions">

          <button
            type="button"
            className="admin-products-back-button"
            onClick={() => navigate("/admin")}
          >
            Back
          </button>

          <button
            type="button"
            className="admin-products-add-button"
            onClick={openAddProduct}
          >
            + Add Product
          </button>

        </div>

      </div>

      {/* ==================================================
          PRODUCT LIST
      ================================================== */}

      <div className="admin-products-card">

        <div className="admin-products-card-header">

          <div>
            <h2>Product List</h2>

            <p>
              View and manage products configured in the system.
            </p>
          </div>

          <span className="admin-products-count">
            {filteredProducts.length} Products
          </span>

        </div>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="admin-products-toolbar">

          <div className="admin-products-search">

            <label htmlFor="admin-product-search">
              Search Products
            </label>

            <input
              id="admin-product-search"
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by Product Code or Product Name"
            />

          </div>

        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="admin-products-table-wrapper">

          {filteredProducts.length === 0 ? (
            <div className="admin-products-empty">
              No products found.
            </div>
          ) : (
            <table className="admin-products-table">

              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((product) => (
                  <tr key={product.id}>

                    <td>
                      <strong className="admin-product-code">
                        {product.productCode}
                      </strong>
                    </td>

                    <td>
                      <span className="admin-product-name">
                        {product.productName}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-product-status admin-product-status-${product.status.toLowerCase()}`}
                      >
                        {product.status === "Active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="admin-product-edit-button"
                        onClick={() =>
                          openEditProduct(product)
                        }
                      >
                        View / Edit
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

      {/* ==================================================
          ADD / EDIT PRODUCT MODAL
      ================================================== */}

      {showProductModal && (
        <div className="admin-product-modal-overlay">

          <div
            className="admin-product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-product-modal-title"
          >

            {/* Modal Header */}

            <div className="admin-product-modal-header">

              <div>
                <h2 id="admin-product-modal-title">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update the product information."
                    : "Add a new product to the system."}
                </p>
              </div>

              <button
                type="button"
                className="admin-product-modal-close"
                onClick={closeProductModal}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* Modal Body */}

            <div className="admin-product-modal-body">

              {/* Product Code */}

              <div className="admin-product-field">

                <label htmlFor="admin-product-code">
                  Product Code
                </label>

                <input
                  id="admin-product-code"
                  type="text"
                  value={productCode}
                  onChange={(event) =>
                    setProductCode(event.target.value)
                  }
                  readOnly={Boolean(editingProduct)}
                  className={
                    editingProduct
                      ? "admin-product-readonly"
                      : ""
                  }
                  placeholder="Enter Product Code"
                />

                {editingProduct && (
                  <span className="admin-product-field-note">
                    Product Code cannot be changed after creation.
                  </span>
                )}

              </div>

              {/* Product Name */}

              <div className="admin-product-field">

                <label htmlFor="admin-product-name">
                  Product Name
                </label>

                <input
                  id="admin-product-name"
                  type="text"
                  value={productName}
                  onChange={(event) =>
                    setProductName(event.target.value)
                  }
                  placeholder="Enter Product Name"
                />

              </div>

              {/* Status */}

              <div className="admin-product-field">

                <label htmlFor="admin-product-status">
                  Status
                </label>

                <select
                  id="admin-product-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as ProductStatus
                    )
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

              </div>

            </div>

            {/* Modal Actions */}

            <div className="admin-product-modal-actions">

              <button
                type="button"
                className="admin-product-cancel-button"
                onClick={closeProductModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-product-save-button"
                onClick={handleSaveProduct}
              >
                {editingProduct
                  ? "Save Changes"
                  : "Save Product"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminProducts;