import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./StockLeft.css";

type StockLeftStatus = "SUBMITTED";

interface CompletedProductionRecord {
  id: number;
  productName: string;
  productCode: string;
  lastStage: string;
  lastStageLotNumber: string;
}

interface StockLeftEntry {
  id: number;
  productName: string;
  productCode: string;
  lastStage: string;
  lastStageLotNumber: string;

  /*
   * Internal relationship only.
   *
   * Production does not display or enter this value.
   * Admin uses this Batch Number.
   *
   * Later the backend will derive this from the existing
   * Batch Sheet using the production/lot relationship.
   */
  batchNumber: string;

  generatedQuantity: number;
  quantityLeft: number;
  submittedAt: string;
  status: StockLeftStatus;
}

/* ==================================================
   SHARED STORAGE
================================================== */

/*
 * Temporary frontend shared storage.
 *
 * Both Production Stock Left and Admin Pending Stock
 * use the same localStorage key.
 *
 * Later this will be replaced by the backend/API.
 */
export const STOCK_LEFT_STORAGE_KEY =
  "tadimety_stock_left_entries";

/*
 * Mock completed production records.
 *
 * Production selects ONE completed production record.
 */
const completedProductionRecords: CompletedProductionRecord[] = [
  {
    id: 1,
    productName: "Product G",
    productCode: "PRD-G",
    lastStage: "FBD",
    lastStageLotNumber: "FBD-000007",
  },
  {
    id: 2,
    productName: "Product H",
    productCode: "PRD-H",
    lastStage: "Packaging",
    lastStageLotNumber: "PL-000008",
  },
  {
    id: 3,
    productName: "Product I",
    productCode: "PRD-I",
    lastStage: "Centrifuge",
    lastStageLotNumber: "CF-000009",
  },
];

/*
 * Initial frontend demo records.
 *
 * IMPORTANT:
 * Batch Number is an internal relationship field.
 *
 * Production does NOT display this value.
 *
 * Admin will display it.
 */
const initialStockLeftEntries: StockLeftEntry[] = [
  {
    id: 1,
    productName: "Product G",
    productCode: "PRD-G",
    lastStage: "FBD",
    lastStageLotNumber: "FBD-000007",
    batchNumber: "BATCH-00021",
    generatedQuantity: 10000,
    quantityLeft: 1000,
    submittedAt: "05/09/2026 05:10 PM",
    status: "SUBMITTED",
  },
  {
    id: 2,
    productName: "Product H",
    productCode: "PRD-H",
    lastStage: "Packaging",
    lastStageLotNumber: "PL-000008",
    batchNumber: "BATCH-00022",
    generatedQuantity: 8000,
    quantityLeft: 500,
    submittedAt: "05/09/2026 07:00 PM",
    status: "SUBMITTED",
  },
];

/* ==================================================
   STORAGE HELPERS
================================================== */

const loadStockLeftEntries = (): StockLeftEntry[] => {
  try {
    const storedEntries = localStorage.getItem(
      STOCK_LEFT_STORAGE_KEY
    );

    if (!storedEntries) {
      localStorage.setItem(
        STOCK_LEFT_STORAGE_KEY,
        JSON.stringify(initialStockLeftEntries)
      );

      return initialStockLeftEntries;
    }

    const parsedEntries = JSON.parse(
      storedEntries
    ) as StockLeftEntry[];

    if (!Array.isArray(parsedEntries)) {
      localStorage.setItem(
        STOCK_LEFT_STORAGE_KEY,
        JSON.stringify(initialStockLeftEntries)
      );

      return initialStockLeftEntries;
    }

    return parsedEntries;
  } catch {
    return initialStockLeftEntries;
  }
};

const saveStockLeftEntries = (
  entries: StockLeftEntry[]
) => {
  localStorage.setItem(
    STOCK_LEFT_STORAGE_KEY,
    JSON.stringify(entries)
  );
};

/* ==================================================
   COMPONENT
================================================== */

const StockLeft = () => {
  const navigate = useNavigate();

  const [selectedRecordId, setSelectedRecordId] =
    useState("");

  const [generatedQuantity, setGeneratedQuantity] =
    useState("");

  const [quantityLeft, setQuantityLeft] =
    useState("");

  const [entries, setEntries] = useState<
    StockLeftEntry[]
  >(() => loadStockLeftEntries());

  const [recordError, setRecordError] =
    useState("");

  const [generatedQuantityError, setGeneratedQuantityError] =
    useState("");

  const [quantityLeftError, setQuantityLeftError] =
    useState("");

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [entryToDelete, setEntryToDelete] =
    useState<StockLeftEntry | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  /* ==================================================
     SYNC WITH ADMIN
  ================================================== */

  useEffect(() => {
    const handleStorageChange = (
      event: StorageEvent
    ) => {
      if (
        event.key !== STOCK_LEFT_STORAGE_KEY
      ) {
        return;
      }

      try {
        const updatedEntries = event.newValue
          ? (JSON.parse(
              event.newValue
            ) as StockLeftEntry[])
          : [];

        setEntries(
          Array.isArray(updatedEntries)
            ? updatedEntries
            : []
        );
      } catch {
        setEntries([]);
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /* -------------------------------
     Production Record Selection
  -------------------------------- */

  const handleRecordChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRecordId(
      event.target.value
    );

    setRecordError("");
  };

  /* -------------------------------
     Quantity Inputs
  -------------------------------- */

  const handleGeneratedQuantityChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setGeneratedQuantity(
      event.target.value
    );

    setGeneratedQuantityError("");
  };

  const handleQuantityLeftChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setQuantityLeft(
      event.target.value
    );

    setQuantityLeftError("");
  };

  /* -------------------------------
     Selected Record
  -------------------------------- */

  const selectedRecord =
    completedProductionRecords.find(
      (record) =>
        record.id.toString() ===
        selectedRecordId
    );

  /* -------------------------------
     Validation
  -------------------------------- */

  const validateForm = () => {
    let isValid = true;

    setRecordError("");
    setGeneratedQuantityError("");
    setQuantityLeftError("");

    if (!selectedRecordId) {
      setRecordError(
        "Please select a production record."
      );

      isValid = false;
    }

    if (!generatedQuantity.trim()) {
      setGeneratedQuantityError(
        "Please enter generated quantity."
      );

      isValid = false;
    } else if (
      Number.isNaN(
        Number(generatedQuantity)
      ) ||
      Number(generatedQuantity) < 0
    ) {
      setGeneratedQuantityError(
        "Please enter a valid quantity."
      );

      isValid = false;
    }

    if (!quantityLeft.trim()) {
      setQuantityLeftError(
        "Please enter quantity left."
      );

      isValid = false;
    } else if (
      Number.isNaN(
        Number(quantityLeft)
      ) ||
      Number(quantityLeft) < 0
    ) {
      setQuantityLeftError(
        "Please enter a valid quantity."
      );

      isValid = false;
    }

    /*
     * No comparison between Generated Quantity
     * and Quantity Left.
     *
     * There is no fixed maximum quantity.
     */

    return isValid;
  };

  /* ==================================================
     SUBMIT
  ================================================== */

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleCancelConfirmation = () => {
    if (isSubmitting) {
      return;
    }

    setShowConfirmation(false);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedRecord) {
      return;
    }

    setIsSubmitting(true);

    /*
     * Temporary frontend delay.
     *
     * Later this becomes the backend API request.
     *
     * Backend responsibilities:
     *
     * 1. Receive the last stage lot number.
     * 2. Find the existing Batch Sheet.
     * 3. Find its Batch Number.
     * 4. Create the Stock Left record.
     * 5. Keep the relationship with the original Batch Sheet.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    /*
     * TEMPORARY DEMO BATCH NUMBER
     *
     * Production does not enter this.
     *
     * Later backend will derive the actual Batch Number.
     */
    const batchNumberMap: Record<
      string,
      string
    > = {
      "FBD-000007": "BATCH-00021",
      "PL-000008": "BATCH-00022",
      "CF-000009": "BATCH-00023",
    };

    const newEntry: StockLeftEntry = {
      id: Date.now(),

      productName:
        selectedRecord.productName,

      productCode:
        selectedRecord.productCode,

      lastStage:
        selectedRecord.lastStage,

      lastStageLotNumber:
        selectedRecord.lastStageLotNumber,

      batchNumber:
        batchNumberMap[
          selectedRecord.lastStageLotNumber
        ] ?? `BATCH-${Date.now()}`,

      generatedQuantity:
        Number(generatedQuantity),

      quantityLeft:
        Number(quantityLeft),

      submittedAt:
        new Date().toLocaleString(
          "en-GB",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        ),

      status: "SUBMITTED",
    };

    const updatedEntries = [
      newEntry,
      ...entries,
    ];

    setEntries(updatedEntries);

    saveStockLeftEntries(
      updatedEntries
    );

    setSelectedRecordId("");
    setGeneratedQuantity("");
    setQuantityLeft("");

    setRecordError("");
    setGeneratedQuantityError("");
    setQuantityLeftError("");

    setIsSubmitting(false);
    setShowConfirmation(false);
  };

  /* ==================================================
     DELETE
  ================================================== */

  const handleDeleteEntry = (
    entry: StockLeftEntry
  ) => {
    setEntryToDelete(entry);
  };

  const handleCancelDelete = () => {
    if (isDeleting) {
      return;
    }

    setEntryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) {
      return;
    }

    setIsDeleting(true);

    /*
     * Temporary frontend delay.
     *
     * Later this becomes:
     *
     * DELETE /stock-left/{stockLeftId}
     *
     * Backend deletes the shared Stock Left record.
     *
     * IMPORTANT:
     * The original Batch Sheet is NOT deleted.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    const updatedEntries =
      entries.filter(
        (entry) =>
          entry.id !== entryToDelete.id
      );

    setEntries(updatedEntries);

    /*
     * Saving here makes the same deletion
     * available to Admin.
     */
    saveStockLeftEntries(
      updatedEntries
    );

    setEntryToDelete(null);
    setIsDeleting(false);
  };

  return (
    <div className="stock-left-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="stock-left-header">
        <h1>Stock Left</h1>

        <p>
          Report remaining stock from completed
          production for future use.
        </p>
      </div>

      {/* ==================================================
          ENTRY CARD
      ================================================== */}

      <div className="stock-left-card">

        <div className="stock-left-card-header">
          <div>
            <h2>Stock Left Entry</h2>

            <p>
              Select the completed production record
              and enter the remaining quantity.
            </p>
          </div>
        </div>

        <div className="stock-left-form">

          {/* Production Record */}
          <div className="stock-left-field stock-left-field-full">

            <label htmlFor="productionRecord">
              Production Record{" "}
              <span>*</span>
            </label>

            <select
              id="productionRecord"
              value={selectedRecordId}
              onChange={handleRecordChange}
              className={
                recordError
                  ? "stock-left-input-error"
                  : ""
              }
            >
              <option value="">
                Select Production Record
              </option>

              {completedProductionRecords.map(
                (record) => (
                  <option
                    key={record.id}
                    value={record.id}
                  >
                    {record.productName} —{" "}
                    {record.lastStage} —{" "}
                    {
                      record.lastStageLotNumber
                    }
                  </option>
                )
              )}
            </select>

            {recordError && (
              <div className="stock-left-error">
                {recordError}
              </div>
            )}

          </div>

          {/* Selected Record */}
          {selectedRecord && (
            <div className="stock-left-selected-record">

              <div className="stock-left-selected-item">
                <span>
                  Product Name
                </span>

                <strong>
                  {
                    selectedRecord.productName
                  }
                </strong>
              </div>

              <div className="stock-left-selected-item">
                <span>
                  Last Stage
                </span>

                <strong>
                  {
                    selectedRecord.lastStage
                  }
                </strong>
              </div>

              <div className="stock-left-selected-item">
                <span>
                  Last Stage Lot Number
                </span>

                <strong>
                  {
                    selectedRecord.lastStageLotNumber
                  }
                </strong>
              </div>

            </div>
          )}

          {/* Generated Quantity */}
          <div className="stock-left-field">

            <label htmlFor="generatedQuantity">
              Generated Quantity{" "}
              <span>*</span>
            </label>

            <input
              id="generatedQuantity"
              type="number"
              min="0"
              value={generatedQuantity}
              onChange={
                handleGeneratedQuantityChange
              }
              placeholder="Enter generated quantity"
              className={
                generatedQuantityError
                  ? "stock-left-input-error"
                  : ""
              }
            />

            {generatedQuantityError && (
              <div className="stock-left-error">
                {
                  generatedQuantityError
                }
              </div>
            )}

          </div>

          {/* Quantity Left */}
          <div className="stock-left-field">

            <label htmlFor="quantityLeft">
              Quantity Left{" "}
              <span>*</span>
            </label>

            <input
              id="quantityLeft"
              type="number"
              min="0"
              value={quantityLeft}
              onChange={
                handleQuantityLeftChange
              }
              placeholder="Enter quantity left"
              className={
                quantityLeftError
                  ? "stock-left-input-error"
                  : ""
              }
            />

            {quantityLeftError && (
              <div className="stock-left-error">
                {quantityLeftError}
              </div>
            )}

          </div>

        </div>

        {/* Form Actions */}
        <div className="stock-left-actions">

          <button
            type="button"
            className="stock-left-btn stock-left-btn-secondary"
            onClick={() =>
              navigate("/production")
            }
          >
            Cancel
          </button>

          <button
            type="button"
            className="stock-left-btn stock-left-btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>

        </div>

      </div>

      {/* ==================================================
          HISTORY
      ================================================== */}

      <div className="stock-left-card stock-left-history-card">

        <div className="stock-left-card-header">
          <div>
            <h2>Stock Left History</h2>

            <p>
              Previously submitted stock-left
              records are shown below.
            </p>
          </div>
        </div>

        <div className="stock-left-table-wrapper">

          <table className="stock-left-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Last Stage</th>
                <th>
                  Last Stage Lot No.
                </th>
                <th>
                  Generated Quantity
                </th>
                <th>
                  Quantity Left
                </th>
                <th>
                  Submitted At
                </th>
                <th>
                  Status
                </th>
                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry.id}>

                    <td>
                      {entry.productName}
                    </td>

                    <td>
                      {entry.lastStage}
                    </td>

                    <td>
                      {
                        entry.lastStageLotNumber
                      }
                    </td>

                    <td>
                      {entry.generatedQuantity.toLocaleString()}
                    </td>

                    <td>
                      {entry.quantityLeft.toLocaleString()}
                    </td>

                    <td>
                      {entry.submittedAt}
                    </td>

                    <td>
                      <span className="stock-left-status">
                        Submitted to Admin
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="stock-left-delete-btn"
                        onClick={() =>
                          handleDeleteEntry(
                            entry
                          )
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
                    colSpan={8}
                    className="stock-left-empty"
                  >
                    No stock-left records
                    available.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==================================================
          SUBMIT CONFIRMATION
      ================================================== */}

      {showConfirmation && (
        <div className="stock-left-modal-overlay">

          <div
            className="stock-left-confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stock-left-confirmation-title"
          >

            <h3 id="stock-left-confirmation-title">
              Confirm Submission
            </h3>

            <p>
              Once submitted, this stock-left
              entry cannot be edited.
              <br />
              Do you want to continue?
            </p>

            <div className="stock-left-confirmation-actions">

              <button
                type="button"
                className="stock-left-btn stock-left-btn-secondary"
                onClick={
                  handleCancelConfirmation
                }
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="stock-left-btn stock-left-btn-primary"
                onClick={
                  handleConfirmSubmit
                }
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          DELETE CONFIRMATION
      ================================================== */}

      {entryToDelete && (
        <div className="stock-left-modal-overlay">

          <div
            className="stock-left-confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stock-left-delete-title"
          >

            <h3 id="stock-left-delete-title">
              Delete Stock Left Entry
            </h3>

            <p>
              Are you sure you want to delete
              this stock-left entry?
              <br />
              This action cannot be undone.
            </p>

            <div className="stock-left-delete-details">

              <div>
                <span>
                  Product
                </span>

                <strong>
                  {
                    entryToDelete.productName
                  }
                </strong>
              </div>

              <div>
                <span>
                  Last Stage
                </span>

                <strong>
                  {
                    entryToDelete.lastStage
                  }
                </strong>
              </div>

              <div>
                <span>
                  Lot Number
                </span>

                <strong>
                  {
                    entryToDelete.lastStageLotNumber
                  }
                </strong>
              </div>

            </div>

            <div className="stock-left-confirmation-actions">

              <button
                type="button"
                className="stock-left-btn stock-left-btn-secondary"
                onClick={
                  handleCancelDelete
                }
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="stock-left-delete-confirm-btn"
                onClick={
                  handleConfirmDelete
                }
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

export default StockLeft;