import { useMemo, useState } from "react";
import "./AdminPendingStock.css";

interface PendingStockRecord {
  id: number;
  productName: string;
  productCode: string;
  batchNumber: string;
  generatedQuantity: number;
  quantityLeft: number;
}

/*
 * TEMPORARY FRONTEND DATA
 *
 * Batch Number is the Admin-facing identifier.
 *
 * The relationship between the Stock Left record and the
 * original Batch Sheet will later be handled by the backend.
 *
 * Production does not need to know this Batch Number.
 */
const initialPendingStockRecords: PendingStockRecord[] = [
  {
    id: 1,
    productName: "Product G",
    productCode: "PRD-G",
    batchNumber: "BATCH-00021",
    generatedQuantity: 10000,
    quantityLeft: 1000,
  },
  {
    id: 2,
    productName: "Product H",
    productCode: "PRD-H",
    batchNumber: "BATCH-00022",
    generatedQuantity: 8000,
    quantityLeft: 500,
  },
];

const AdminPendingStock = () => {
  const [records, setRecords] = useState<PendingStockRecord[]>(
    initialPendingStockRecords
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("ALL");

  const [recordToDelete, setRecordToDelete] =
    useState<PendingStockRecord | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  /* -------------------------------
     Product Filter Options
  -------------------------------- */

  const products = useMemo(() => {
    return Array.from(
      new Set(records.map((record) => record.productName))
    );
  }, [records]);

  /* -------------------------------
     Filter Records
  -------------------------------- */

  const filteredRecords = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !search ||
        record.productName.toLowerCase().includes(search) ||
        record.productCode.toLowerCase().includes(search) ||
        record.batchNumber.toLowerCase().includes(search);

      const matchesProduct =
        productFilter === "ALL" ||
        record.productName === productFilter;

      return matchesSearch && matchesProduct;
    });
  }, [records, searchTerm, productFilter]);

  /* -------------------------------
     Delete
  -------------------------------- */

  const handleDeleteRecord = (
    record: PendingStockRecord
  ) => {
    setRecordToDelete(record);
  };

  const handleCancelDelete = () => {
    if (isDeleting) {
      return;
    }

    setRecordToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) {
      return;
    }

    setIsDeleting(true);

    /*
     * Temporary frontend delay.
     *
     * Later this will become the backend request:
     *
     * DELETE /stock-left/{stockLeftId}
     *
     * The backend will delete the shared Stock Left record.
     *
     * This must NOT delete the original Batch Sheet.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    setRecords((currentRecords) =>
      currentRecords.filter(
        (record) => record.id !== recordToDelete.id
      )
    );

    setRecordToDelete(null);
    setIsDeleting(false);
  };

  /* -------------------------------
     Clear Filters
  -------------------------------- */

  const handleClearFilters = () => {
    setSearchTerm("");
    setProductFilter("ALL");
  };

  /* -------------------------------
     Quantity Formatting
  -------------------------------- */

  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString("en-IN");
  };

  return (
    <div className="admin-pending-stock">

      {/* Page Header */}
      <div className="admin-pending-stock-header">
        <div>
          <h1>Pending Stock</h1>

          <p>
            Stock remaining from completed production
            batches is shown below.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="pending-stock-card">

        {/* Card Header */}
        <div className="pending-stock-card-header">
          <div>
            <h2>Pending Stock</h2>

            <p>
              Previously submitted stock-left records
              available for future use.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="pending-stock-filters">

          {/* Search */}
          <div className="pending-stock-field pending-stock-search-field">

            <label htmlFor="pendingStockSearch">
              Search
            </label>

            <input
              id="pendingStockSearch"
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search product or batch number"
            />

          </div>

          {/* Product */}
          <div className="pending-stock-field">

            <label htmlFor="pendingStockProduct">
              Product
            </label>

            <select
              id="pendingStockProduct"
              value={productFilter}
              onChange={(event) =>
                setProductFilter(event.target.value)
              }
            >
              <option value="ALL">
                All Products
              </option>

              {products.map((product) => (
                <option
                  key={product}
                  value={product}
                >
                  {product}
                </option>
              ))}
            </select>

          </div>

          {/* Clear */}
          <div className="pending-stock-filter-action">

            <button
              type="button"
              className="pending-stock-clear-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="pending-stock-table-wrapper">

          <table className="pending-stock-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Batch Number</th>
                <th>Generated Quantity</th>
                <th>Quantity Left</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id}>

                    {/* Product */}
                    <td>
                      <div className="pending-stock-product-cell">

                        <strong>
                          {record.productName}
                        </strong>

                        <span>
                          {record.productCode}
                        </span>

                      </div>
                    </td>

                    {/* Batch Number */}
                    <td className="pending-stock-batch-number">
                      {record.batchNumber}
                    </td>

                    {/* Generated Quantity */}
                    <td>
                      {formatQuantity(
                        record.generatedQuantity
                      )}
                    </td>

                    {/* Quantity Left */}
                    <td>
                      {formatQuantity(
                        record.quantityLeft
                      )}
                    </td>

                    {/* Delete */}
                    <td>
                      <button
                        type="button"
                        className="pending-stock-delete-button"
                        onClick={() =>
                          handleDeleteRecord(record)
                        }
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="pending-stock-empty-cell"
                  >
                    <div className="pending-stock-empty-state">

                      <h3>
                        No Pending Stock Records
                      </h3>

                      <p>
                        No stock-left records match
                        the selected filters.
                      </p>

                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="pending-stock-table-footer">

          <span>
            Showing {filteredRecords.length} of{" "}
            {records.length} records
          </span>

        </div>

      </div>

      {/* Delete Confirmation */}
      {recordToDelete && (
        <div className="pending-stock-modal-overlay">

          <div
            className="pending-stock-confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pending-stock-delete-title"
          >

            <h3 id="pending-stock-delete-title">
              Delete Stock Left Entry
            </h3>

            <p>
              Are you sure you want to delete this
              stock-left entry?
              <br />
              This action cannot be undone.
            </p>

            <div className="pending-stock-delete-details">

              <div>
                <span>Product</span>

                <strong>
                  {recordToDelete.productName}
                </strong>
              </div>

              <div>
                <span>Batch Number</span>

                <strong>
                  {recordToDelete.batchNumber}
                </strong>
              </div>

              <div>
                <span>Quantity Left</span>

                <strong>
                  {formatQuantity(
                    recordToDelete.quantityLeft
                  )}
                </strong>
              </div>

            </div>

            <div className="pending-stock-confirmation-actions">

              <button
                type="button"
                className="pending-stock-cancel-button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="pending-stock-delete-confirm-button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminPendingStock;