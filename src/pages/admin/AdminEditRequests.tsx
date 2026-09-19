import { useMemo, useState } from "react";
import "./AdminEditRequests.css";

type EditStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EDITED_RESUBMITTED";

interface EditRequest {
  id: number;
  productCode: string;
  productName: string;
  lastStageLotNumber: string;
  requestedAt: string;
  reason: string;
  status: EditStatus;
  batchNumber?: string;
  requestedBy?: string;
  attachmentName?: string;
  decisionAt?: string;
  decisionBy?: string;
  rejectionReason?: string;
}

type RequestFilter =
  | "ALL"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EDITED_RESUBMITTED";

const AdminEditRequests = () => {
  /* ==================================================
     MOCK DATA
     
     This is intentionally separate from Production
     RequestEdit.tsx for now.

     Later this will be replaced with Firestore/API.
  ================================================== */

  const [requests, setRequests] = useState<EditRequest[]>([
    {
      id: 1,
      productCode: "PROD001",
      productName: "Product A",
      lastStageLotNumber: "FBD-000001",
      requestedAt: "06/09/2026 10:30 AM",
      reason:
        "Incorrect quantity entered in the completed production record.",
      status: "PENDING",
      batchNumber: "BS-2026-0001",
      requestedBy: "Production Employee",
    },
    {
      id: 2,
      productCode: "PROD002",
      productName: "Product B",
      lastStageLotNumber: "PK-000002",
      requestedAt: "06/09/2026 09:15 AM",
      reason:
        "Correction required in the submitted process details.",
      status: "APPROVED",
      batchNumber: "BS-2026-0002",
      requestedBy: "Production Employee",
      decisionAt: "06/09/2026 11:00 AM",
      decisionBy: "Admin",
    },
    {
      id: 3,
      productCode: "PROD003",
      productName: "Product C",
      lastStageLotNumber: "DST-000003",
      requestedAt: "05/09/2026 04:40 PM",
      reason:
        "Wrong information entered during submission.",
      status: "REJECTED",
      batchNumber: "BS-2026-0003",
      requestedBy: "Production Employee",
      decisionAt: "05/09/2026 05:10 PM",
      decisionBy: "Admin",
      rejectionReason:
        "The requested correction could not be verified.",
    },
  ]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<RequestFilter>("ALL");

  const [selectedRequest, setSelectedRequest] =
    useState<EditRequest | null>(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showApproveConfirmation, setShowApproveConfirmation] =
    useState(false);

  const [showRejectConfirmation, setShowRejectConfirmation] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [rejectionReasonError, setRejectionReasonError] =
    useState("");

  const [isProcessing, setIsProcessing] =
    useState(false);

  /* ==================================================
     FILTERED REQUESTS
  ================================================== */

  const filteredRequests = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        request.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        request.productCode,
        request.productName,
        request.lastStageLotNumber,
        request.batchNumber ?? "",
        request.reason,
        request.requestedBy ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [requests, search, statusFilter]);


  /* ==================================================
     STATUS
  ================================================== */

  const getStatusLabel = (
    status: EditStatus
  ) => {
    switch (status) {
      case "PENDING":
        return "Pending Approval";

      case "APPROVED":
        return "Edit Approved";

      case "REJECTED":
        return "Rejected";

      case "EDITED_RESUBMITTED":
        return "Edited & Resubmitted";

      default:
        return status;
    }
  };

  const getStatusClass = (
    status: EditStatus
  ) => {
    return `admin-edit-request-status admin-edit-request-status-${status.toLowerCase()}`;
  };

  /* ==================================================
     VIEW REQUEST
  ================================================== */

  const handleViewRequest = (
    request: EditRequest
  ) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    if (isProcessing) {
      return;
    }

    setShowDetails(false);
    setSelectedRequest(null);
  };

  /* ==================================================
     APPROVE
  ================================================== */

  const handleOpenApproveConfirmation = () => {
    if (!selectedRequest) {
      return;
    }

    if (selectedRequest.status !== "PENDING") {
      return;
    }

    setShowApproveConfirmation(true);
  };

  const handleCancelApprove = () => {
    if (isProcessing) {
      return;
    }

    setShowApproveConfirmation(false);
  };

  const handleConfirmApprove = () => {
    if (!selectedRequest) {
      return;
    }

    setIsProcessing(true);

    window.setTimeout(() => {
      const now = new Date();

      const decisionAt = `${now.toLocaleDateString(
        "en-GB"
      )} ${now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;

      const updatedRequests =
        requests.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: "APPROVED" as const,
                decisionAt,
                decisionBy: "Admin",
              }
            : request
        );

      setRequests(updatedRequests);

      const updatedRequest =
        updatedRequests.find(
          (request) =>
            request.id === selectedRequest.id
        );

      setSelectedRequest(
        updatedRequest ?? null
      );

      setIsProcessing(false);
      setShowApproveConfirmation(false);
    }, 700);
  };

  /* ==================================================
     REJECT
  ================================================== */

  const handleOpenRejectConfirmation = () => {
    if (!selectedRequest) {
      return;
    }

    if (selectedRequest.status !== "PENDING") {
      return;
    }

    setRejectionReason("");
    setRejectionReasonError("");
    setShowRejectConfirmation(true);
  };

  const handleCancelReject = () => {
    if (isProcessing) {
      return;
    }

    setShowRejectConfirmation(false);
    setRejectionReason("");
    setRejectionReasonError("");
  };

  const handleConfirmReject = () => {
    if (!selectedRequest) {
      return;
    }

    if (!rejectionReason.trim()) {
      setRejectionReasonError(
        "Please enter a rejection reason."
      );
      return;
    }

    setIsProcessing(true);

    window.setTimeout(() => {
      const now = new Date();

      const decisionAt = `${now.toLocaleDateString(
        "en-GB"
      )} ${now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;

      const updatedRequests =
        requests.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: "REJECTED" as const,
                rejectionReason:
                  rejectionReason.trim(),
                decisionAt,
                decisionBy: "Admin",
              }
            : request
        );

      setRequests(updatedRequests);

      const updatedRequest =
        updatedRequests.find(
          (request) =>
            request.id === selectedRequest.id
        );

      setSelectedRequest(
        updatedRequest ?? null
      );

      setIsProcessing(false);
      setShowRejectConfirmation(false);
      setRejectionReason("");
      setRejectionReasonError("");
    }, 700);
  };

  return (
    <div className="admin-edit-requests-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-edit-requests-header">

        <div>
          <h1>Edit Requests</h1>

          <p>
            Review and manage edit requests submitted
            by Production.
          </p>
        </div>

      </div>


      {/* ==================================================
          MAIN CARD
      ================================================== */}

      <div className="admin-edit-requests-card">

        <div className="admin-edit-requests-card-header">

          <div>
            <h2>
              Production Edit Requests
            </h2>

            <p>
              Review requests before allowing
              corrections to completed batch sheets.
            </p>
          </div>

        </div>


        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="admin-edit-requests-filters">

          <div className="admin-edit-request-search">

            <label htmlFor="edit-request-search">
              Search
            </label>

            <input
              id="edit-request-search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search product, lot number or batch number"
            />

          </div>


          <div className="admin-edit-request-filter">

            <label htmlFor="edit-request-status">
              Status
            </label>

            <select
              id="edit-request-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as RequestFilter
                )
              }
            >
              <option value="ALL">
                All
              </option>

              <option value="PENDING">
                Pending Approval
              </option>

              <option value="APPROVED">
                Edit Approved
              </option>

              <option value="REJECTED">
                Rejected
              </option>

              <option value="EDITED_RESUBMITTED">
                Edited &amp; Resubmitted
              </option>
            </select>

          </div>

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="admin-edit-requests-table-wrapper">

          <table className="admin-edit-requests-table">

            <thead>

              <tr>
                <th>Product</th>
                <th>Batch Number</th>
                <th>Last Stage Lot No.</th>
                <th>Requested By</th>
                <th>Requested At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredRequests.length > 0 ? (

                filteredRequests.map(
                  (request) => (

                    <tr key={request.id}>

                      <td>
                        <div className="admin-edit-request-product">

                          <strong>
                            {request.productCode}
                          </strong>

                          <span>
                            {request.productName}
                          </span>

                        </div>
                      </td>


                      <td>
                        {request.batchNumber ?? "—"}
                      </td>


                      <td>
                        {request.lastStageLotNumber}
                      </td>


                      <td>
                        {request.requestedBy ??
                          "Production"}
                      </td>


                      <td>
                        {request.requestedAt}
                      </td>


                      <td>

                        <span
                          className={getStatusClass(
                            request.status
                          )}
                        >
                          {getStatusLabel(
                            request.status
                          )}
                        </span>

                      </td>


                      <td>

                        <button
                          type="button"
                          className="admin-edit-request-view-button"
                          onClick={() =>
                            handleViewRequest(
                              request
                            )
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={7}
                    className="admin-edit-request-empty"
                  >
                    No edit requests found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==================================================
          REQUEST DETAILS MODAL
      ================================================== */}

      {showDetails &&
        selectedRequest && (

          <div className="admin-edit-request-overlay">

            <div
              className="admin-edit-request-modal"
              role="dialog"
              aria-modal="true"
            >

              <div className="admin-edit-request-modal-header">

                <div>

                  <h2>
                    Edit Request Details
                  </h2>

                  <p>
                    Review the request before
                    approving or rejecting edit access.
                  </p>

                </div>


                <button
                  type="button"
                  className="admin-edit-request-close"
                  onClick={handleCloseDetails}
                  disabled={isProcessing}
                  aria-label="Close"
                >
                  ×
                </button>

              </div>


              <div className="admin-edit-request-modal-body">

                {/* REQUEST SUMMARY */}

                <div className="admin-edit-request-summary-card">

                  <div>
                    <span>Product Code</span>

                    <strong>
                      {selectedRequest.productCode}
                    </strong>
                  </div>


                  <div>
                    <span>Product Name</span>

                    <strong>
                      {selectedRequest.productName}
                    </strong>
                  </div>


                  <div>
                    <span>Batch Number</span>

                    <strong>
                      {selectedRequest.batchNumber ??
                        "Assigned Batch Number"}
                    </strong>
                  </div>


                  <div>
                    <span>Last Stage Lot Number</span>

                    <strong>
                      {selectedRequest.lastStageLotNumber}
                    </strong>
                  </div>


                  <div>
                    <span>Requested By</span>

                    <strong>
                      {selectedRequest.requestedBy ??
                        "Production"}
                    </strong>
                  </div>


                  <div>
                    <span>Requested At</span>

                    <strong>
                      {selectedRequest.requestedAt}
                    </strong>
                  </div>

                </div>


                {/* STATUS */}

                <div className="admin-edit-request-detail-row">

                  <span>
                    Status
                  </span>

                  <span
                    className={getStatusClass(
                      selectedRequest.status
                    )}
                  >
                    {getStatusLabel(
                      selectedRequest.status
                    )}
                  </span>

                </div>


                {/* REASON */}

                <div className="admin-edit-request-detail-section">

                  <label>
                    Edit Request Reason
                  </label>

                  <div className="admin-edit-request-reason">
                    {selectedRequest.reason}
                  </div>

                </div>


                {/* ATTACHMENT */}

                <div className="admin-edit-request-detail-section">

                  <label>
                    Attachment
                  </label>

                  <div className="admin-edit-request-attachment">

                    {selectedRequest.attachmentName ? (
                      <span>
                        {selectedRequest.attachmentName}
                      </span>
                    ) : (
                      <span>
                        No attachment provided.
                      </span>
                    )}

                  </div>

                </div>


                {/* REJECTION REASON */}

                {selectedRequest.status ===
                    "REJECTED" &&
                  selectedRequest.rejectionReason && (

                    <div className="admin-edit-request-rejection-box">

                      <label>
                        Rejection Reason
                      </label>

                      <p>
                        {
                          selectedRequest.rejectionReason
                        }
                      </p>

                    </div>

                  )}


                {/* DECISION */}

                {selectedRequest.decisionAt && (

                  <div className="admin-edit-request-decision-info">

                    <span>
                      Decision
                    </span>

                    <strong>
                      {selectedRequest.decisionBy ??
                        "Admin"}
                    </strong>

                    <small>
                      {selectedRequest.decisionAt}
                    </small>

                  </div>

                )}

              </div>


              {/* ACTIONS */}

              <div className="admin-edit-request-modal-actions">

                <button
                  type="button"
                  className="admin-edit-request-cancel-button"
                  onClick={handleCloseDetails}
                  disabled={isProcessing}
                >
                  Close
                </button>


                {selectedRequest.status ===
                  "PENDING" && (
                  <>

                    <button
                      type="button"
                      className="admin-edit-request-reject-button"
                      onClick={
                        handleOpenRejectConfirmation
                      }
                      disabled={isProcessing}
                    >
                      Reject Edit
                    </button>


                    <button
                      type="button"
                      className="admin-edit-request-approve-button"
                      onClick={
                        handleOpenApproveConfirmation
                      }
                      disabled={isProcessing}
                    >
                      Approve Edit
                    </button>

                  </>
                )}

              </div>

            </div>

          </div>

        )}


      {/* ==================================================
          APPROVE CONFIRMATION
      ================================================== */}

      {showApproveConfirmation &&
        selectedRequest && (

          <div className="admin-edit-request-overlay">

            <div
              className="admin-edit-request-confirm-modal"
              role="dialog"
              aria-modal="true"
            >

              <h3>
                Approve Edit Request
              </h3>

              <p>
                Are you sure you want to approve
                edit access for
                <strong>
                  {" "}
                  {selectedRequest.productName}
                </strong>
                ?
              </p>

              <p>
                Production will be allowed to open
                the existing batch sheet and submit
                the corrected information.
              </p>


              <div className="admin-edit-request-confirm-actions">

                <button
                  type="button"
                  className="admin-edit-request-cancel-button"
                  onClick={
                    handleCancelApprove
                  }
                  disabled={isProcessing}
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="admin-edit-request-approve-button"
                  onClick={
                    handleConfirmApprove
                  }
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Approving..."
                    : "Approve Edit"}
                </button>

              </div>

            </div>

          </div>

        )}


      {/* ==================================================
          REJECT CONFIRMATION
      ================================================== */}

      {showRejectConfirmation &&
        selectedRequest && (

          <div className="admin-edit-request-overlay">

            <div
              className="admin-edit-request-confirm-modal"
              role="dialog"
              aria-modal="true"
            >

              <h3>
                Reject Edit Request
              </h3>

              <p>
                Please provide a reason for
                rejecting this edit request.
              </p>


              <div className="admin-edit-request-rejection-field">

                <label htmlFor="admin-rejection-reason">
                  Rejection Reason
                  <span>*</span>
                </label>

                <textarea
                  id="admin-rejection-reason"
                  value={rejectionReason}
                  onChange={(event) => {

                    setRejectionReason(
                      event.target.value
                    );

                    if (
                      event.target.value.trim()
                    ) {
                      setRejectionReasonError("");
                    }

                  }}
                  rows={4}
                  placeholder="Enter the reason for rejection"
                  className={
                    rejectionReasonError
                      ? "admin-edit-request-input-error"
                      : ""
                  }
                />

                {rejectionReasonError && (
                  <span className="admin-edit-request-error">
                    {rejectionReasonError}
                  </span>
                )}

              </div>


              <div className="admin-edit-request-confirm-actions">

                <button
                  type="button"
                  className="admin-edit-request-cancel-button"
                  onClick={
                    handleCancelReject
                  }
                  disabled={isProcessing}
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="admin-edit-request-reject-button"
                  onClick={
                    handleConfirmReject
                  }
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Rejecting..."
                    : "Reject Edit"}
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default AdminEditRequests;