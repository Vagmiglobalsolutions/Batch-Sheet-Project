import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TechnicalProducts.css";

import {
  useTechnicalData,
} from "../../context/TechnicalDataContext";

import type {
  TechnicalProduct,
} from "../../data/technicalData";

type ProductStatus = "Active" | "Inactive";

const TechnicalProducts = () => {
  const navigate = useNavigate();

  /*
   * ==================================================
   * SHARED TECHNICAL DATA
   * ==================================================
   *
   * Products are now coming from the shared
   * TechnicalDataContext.
   *
   * This means other Technical modules such as
   * Reactor Machines and Employees can use the
   * exact same product list.
   */

  const {
    products,
    addProduct,
    updateProduct,
  } = useTechnicalData();

  const [showProductModal, setShowProductModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<TechnicalProduct | null>(null);

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

  const openEditProduct = (
    product: TechnicalProduct
  ) => {
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
    /*
     * EDIT EXISTING PRODUCT
     */

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        productName,
        status,
      });
    }

    /*
     * ADD NEW PRODUCT
     */

    else {
      const newProduct: TechnicalProduct = {
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

  const filteredProducts = products.filter(
    (product) => {
      const search =
        searchTerm.toLowerCase().trim();

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
    }
  );

  return (
    <div className="technical-products-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="technical-products-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage the products available in the Digital Batch
            Sheet Management System.
          </p>
        </div>

        <div className="technical-products-header-actions">

          <button
            type="button"
            className="technical-products-back-button"
            onClick={() => navigate("/technical")}
          >
            Back
          </button>

          <button
            type="button"
            className="technical-products-add-button"
            onClick={openAddProduct}
          >
            + Add Product
          </button>

        </div>

      </div>


      {/* ==================================================
          PRODUCT LIST
      ================================================== */}

      <div className="technical-products-card">

        <div className="technical-products-card-header">

          <div>
            <h2>Product List</h2>

            <p>
              View and manage products configured in the system.
            </p>
          </div>

          <span className="technical-products-count">
            {filteredProducts.length} Products
          </span>

        </div>


        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="technical-products-toolbar">

          <div className="technical-products-search">

            <label htmlFor="product-search">
              Search Products
            </label>

            <input
              id="product-search"
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

        <div className="technical-products-table-wrapper">

          {filteredProducts.length === 0 ? (
            <div className="technical-products-empty">
              No products found.
            </div>
          ) : (
            <table className="technical-products-table">

              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => (
                    <tr key={product.id}>

                      <td>
                        <strong className="technical-product-code">
                          {product.productCode}
                        </strong>
                      </td>

                      <td>
                        <span className="technical-product-name">
                          {product.productName}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`technical-product-status technical-product-status-${product.status.toLowerCase()}`}
                        >
                          {product.status === "Active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="technical-product-edit-button"
                          onClick={() =>
                            openEditProduct(
                              product
                            )
                          }
                        >
                          View / Edit
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>


      {/* ==================================================
          ADD / EDIT PRODUCT MODAL
      ================================================== */}

      {showProductModal && (
        <div className="technical-product-modal-overlay">

          <div
            className="technical-product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="technical-product-modal-title"
          >

            {/* Modal Header */}

            <div className="technical-product-modal-header">

              <div>
                <h2 id="technical-product-modal-title">
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
                className="technical-product-modal-close"
                onClick={closeProductModal}
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* Modal Body */}

            <div className="technical-product-modal-body">

              {/* Product Code */}

              <div className="technical-product-field">

                <label htmlFor="product-code">
                  Product Code
                </label>

                <input
                  id="product-code"
                  type="text"
                  value={productCode}
                  onChange={(event) =>
                    setProductCode(
                      event.target.value
                    )
                  }
                  readOnly={Boolean(
                    editingProduct
                  )}
                  className={
                    editingProduct
                      ? "technical-product-readonly"
                      : ""
                  }
                  placeholder="Enter Product Code"
                />

                {editingProduct && (
                  <span className="technical-product-field-note">
                    Product Code cannot be changed after creation.
                  </span>
                )}

              </div>


              {/* Product Name */}

              <div className="technical-product-field">

                <label htmlFor="product-name">
                  Product Name
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={productName}
                  onChange={(event) =>
                    setProductName(
                      event.target.value
                    )
                  }
                  placeholder="Enter Product Name"
                />

              </div>


              {/* Status */}

              <div className="technical-product-field">

                <label htmlFor="product-status">
                  Status
                </label>

                <select
                  id="product-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as ProductStatus
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

            <div className="technical-product-modal-actions">

              <button
                type="button"
                className="technical-product-cancel-button"
                onClick={closeProductModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="technical-product-save-button"
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

export default TechnicalProducts;