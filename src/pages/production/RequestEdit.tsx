import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./RequestEdit.css";

type EditStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

interface EditRequest {
  id: number;
  productCode: string;
  productName: string;
  stage: string;
  lotNumber: string;
  requestedAt: string;
  reason: string;
  status: EditStatus;
  batchFile?: string;
}

const RequestEdit = () => {
  const navigate = useNavigate();

  const [editRequests, setEditRequests] = useState<EditRequest[]>([
    {
      id: 1,
      productCode: "PROD001",
      productName: "Product A",
      stage: "Reaction",
      lotNumber: "RL-000001",
      requestedAt: "06/09/2026 10:30 AM",
      reason: "Incorrect quantity entered in the production record.",
      status: "PENDING",
    },
    {
      id: 2,
      productCode: "PROD002",
      productName: "Product B",
      stage: "Distillation",
      lotNumber: "DL-000002",
      requestedAt: "06/09/2026 09:15 AM",
      reason: "Correction required in the entered process details.",
      status: "APPROVED",
      batchFile: "BatchSheet_PROD002_DL-000002.xlsx",
    },
    {
      id: 3,
      productCode: "PROD003",
      productName: "Product C",
      stage: "Washing",
      lotNumber: "WL-000003",
      requestedAt: "05/09/2026 04:40 PM",
      reason: "Wrong information entered during submission.",
      status: "REJECTED",
    },
  ]);

  const [showRequestForm, setShowRequestForm] = useState(false);

  const [selectedRequest, setSelectedRequest] =
    useState<EditRequest | null>(null);

  const [reason, setReason] = useState("");

  const availableRequests = editRequests;

  const handleOpenRequestForm = (request: EditRequest) => {
    setSelectedRequest(request);
    setReason(request.reason);
    setShowRequestForm(true);
  };

  const handleCloseRequestForm = () => {
    setShowRequestForm(false);
    setSelectedRequest(null);
    setReason("");
  };

  const handleSubmitUpdatedReport = (requestId: number) => {
    /*
     * Temporary frontend behavior.
     *
     * Later the backend will:
     * 1. Store the updated report.
     * 2. Preserve the original report.
     * 3. Store both versions for Admin.
     * 4. Remove the active edit request from
     *    the Production user's view.
     */
    setEditRequests((currentRequests) =>
      currentRequests.filter(
        (request) => request.id !== requestId
      )
    );

    setShowRequestForm(false);
    setSelectedRequest(null);
  };

  return (
    <div className="request-edit-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="request-edit-header">

        <div>
          <h1>Request Edit</h1>

          <p>
            Request correction of previously submitted production
            records.
          </p>
        </div>

        <button
          type="button"
          className="request-edit-back-button"
          onClick={() => navigate("/production")}
        >
          Back
        </button>

      </div>


      {/* ==================================================
          INFORMATION
      ================================================== */}

      <div className="request-edit-info-card">

        <div className="request-edit-info-title">
          Edit Request Information
        </div>

        <p>
          Previously submitted production records cannot be edited
          directly. An edit request must be approved by Admin before
          the batch sheet can be corrected.
        </p>

      </div>


      {/* ==================================================
          REQUEST LIST
      ================================================== */}

      <div className="request-edit-card">

        <div className="request-edit-card-header">

          <div>
            <h2>
              Edit Requests
            </h2>

            <p>
              View the status of your submitted edit requests.
            </p>
          </div>

          <span className="request-edit-count">
            {availableRequests.length} Requests
          </span>

        </div>


        <div className="request-edit-table-wrapper">

          {availableRequests.length === 0 ? (

            <div className="request-edit-empty">
              No edit requests available.
            </div>

          ) : (

            <table className="request-edit-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stage</th>
                  <th>Lot No.</th>
                  <th>Requested At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {availableRequests.map((request) => (

                  <tr key={request.id}>

                    <td>
                      <div className="request-product">

                        <strong>
                          {request.productCode}
                        </strong>

                        <span>
                          {request.productName}
                        </span>

                      </div>
                    </td>

                    <td>
                      {request.stage}
                    </td>

                    <td>
                      {request.lotNumber}
                    </td>

                    <td>
                      {request.requestedAt}
                    </td>

                    <td>

                      <span
                        className={`request-status request-status-${request.status.toLowerCase()}`}
                      >
                        {request.status === "PENDING" &&
                          "Pending Admin"}

                        {request.status === "APPROVED" &&
                          "Edit Approved"}

                        {request.status === "REJECTED" &&
                          "Rejected"}
                      </span>

                    </td>

                    <td>

                      {request.status === "APPROVED" ? (

                        <button
                          type="button"
                          className="edit-batch-button"
                          onClick={() =>
                            handleOpenRequestForm(request)
                          }
                        >
                          Edit Batch Sheet
                        </button>

                      ) : request.status === "PENDING" ? (

                        <span className="request-action-muted">
                          Awaiting approval
                        </span>

                      ) : (

                        <span className="request-action-muted">
                          No action available
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>


      {/* ==================================================
          EDIT BATCH SHEET
      ================================================== */}

      {showRequestForm && selectedRequest && (

        <div className="edit-batch-overlay">

          <div className="edit-batch-modal">

            <div className="edit-batch-header">

              <div>
                <h2>
                  Edit Batch Sheet
                </h2>

                <p>
                  Correct the approved batch sheet and submit
                  the updated report.
                </p>
              </div>

              <button
                type="button"
                className="edit-batch-close"
                onClick={handleCloseRequestForm}
              >
                ×
              </button>

            </div>


            {/* ==============================================
                BATCH INFORMATION
            ============================================== */}

            <div className="edit-batch-section">

              <div className="edit-batch-section-title">
                Batch Information
              </div>

              <div className="edit-batch-grid">

                <div className="edit-batch-field">
                  <label>
                    Product Code
                  </label>

                  <input
                    type="text"
                    value={selectedRequest.productCode}
                    readOnly
                  />
                </div>


                <div className="edit-batch-field">
                  <label>
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={selectedRequest.productName}
                    readOnly
                  />
                </div>


                <div className="edit-batch-field">
                  <label>
                    Process Stage
                  </label>

                  <input
                    type="text"
                    value={selectedRequest.stage}
                    readOnly
                  />
                </div>


                <div className="edit-batch-field">
                  <label>
                    Lot Number
                  </label>

                  <input
                    type="text"
                    value={selectedRequest.lotNumber}
                    readOnly
                  />
                </div>

              </div>

            </div>


            {/* ==============================================
                EDIT REQUEST
            ============================================== */}

            <div className="edit-batch-section">

              <div className="edit-batch-section-title">
                Edit Request
              </div>

              <div className="edit-batch-field">

                <label>
                  Reason for Edit
                </label>

                <textarea
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  rows={3}
                />

              </div>

            </div>


            {/* ==============================================
                ATTACHED BATCH FILE
            ============================================== */}

            <div className="edit-batch-section">

              <div className="edit-batch-section-title">
                Batch File
              </div>

              <div className="batch-file-box">

                <div>
                  <strong>
                    {selectedRequest.batchFile}
                  </strong>

                  <span>
                    Shared by Admin
                  </span>
                </div>

              </div>

            </div>


            {/* ==============================================
                ACTIONS
            ============================================== */}

            <div className="edit-batch-actions">

              <button
                type="button"
                className="edit-batch-cancel"
                onClick={handleCloseRequestForm}
              >
                Cancel
              </button>

              <button
                type="button"
                className="edit-batch-submit"
                onClick={() =>
                  handleSubmitUpdatedReport(
                    selectedRequest.id
                  )
                }
              >
                Submit Updated Report
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default RequestEdit;