import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QADashboard.css";

interface QAReview {
  lotNumber: string;
  status: "PENDING" | "APPROVED" | "HOLD" | "REJECTED";
  submittedAt: string;
}

const initialReviews: QAReview[] = [
  {
    lotNumber: "RL-000001",
    status: "PENDING",
    submittedAt: "17-08-2026 01:20 PM",
  },
];

const QADashboard = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] =
    useState<QAReview[]>(initialReviews);

  const [selectedReview, setSelectedReview] =
    useState<QAReview | null>(null);

  const [showRejectModal, setShowRejectModal] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  // --------------------------------------------------
  // FILTER REVIEWS
  // --------------------------------------------------

  const pendingReviews = reviews.filter(
    (review) => review.status === "PENDING"
  );

  const approvedReviews = reviews.filter(
    (review) => review.status === "APPROVED"
  );

  const holdReviews = reviews.filter(
    (review) => review.status === "HOLD"
  );

  const rejectedReviews = reviews.filter(
    (review) => review.status === "REJECTED"
  );

  // --------------------------------------------------
  // OPEN REVIEW
  // --------------------------------------------------

  const handleOpenReview = (review: QAReview) => {
    navigate(`/qa/review/${review.lotNumber}`);
  };

  // --------------------------------------------------
  // CLOSE REVIEW
  // --------------------------------------------------

  const handleCloseReview = () => {
    setSelectedReview(null);
  };

  // --------------------------------------------------
  // APPROVE
  // --------------------------------------------------

  const handleApprove = () => {
    if (!selectedReview) {
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.lotNumber === selectedReview.lotNumber
          ? {
              ...review,
              status: "APPROVED",
            }
          : review
      )
    );

    setSelectedReview(null);
  };

  // --------------------------------------------------
  // HOLD
  // --------------------------------------------------

  const handleHold = () => {
    if (!selectedReview) {
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.lotNumber === selectedReview.lotNumber
          ? {
              ...review,
              status: "HOLD",
            }
          : review
      )
    );

    setSelectedReview(null);
  };

  // --------------------------------------------------
  // REJECT MODAL
  // --------------------------------------------------

  const handleOpenReject = () => {
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleCloseReject = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };

  // --------------------------------------------------
  // REJECT
  // --------------------------------------------------

  const handleReject = () => {
    if (!selectedReview) {
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.lotNumber === selectedReview.lotNumber
          ? {
              ...review,
              status: "REJECTED",
            }
          : review
      )
    );

    setShowRejectModal(false);
    setSelectedReview(null);
    setRejectionReason("");
  };

  return (
    <div className="qa-dashboard-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="qa-dashboard-header">

        <div>
          <h1>QA/QC Dashboard</h1>

          <p>
            Review and manage submitted QA/QC requests.
          </p>
        </div>

      </div>


      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="qa-stat-grid">

        <div className="qa-stat-card">

          <span className="qa-stat-label">
            Pending Review
          </span>

          <strong>
            {pendingReviews.length}
          </strong>

        </div>


        <div className="qa-stat-card">

          <span className="qa-stat-label">
            Approved
          </span>

          <strong>
            {approvedReviews.length}
          </strong>

        </div>


        <div className="qa-stat-card">

          <span className="qa-stat-label">
            On Hold
          </span>

          <strong>
            {holdReviews.length}
          </strong>

        </div>


        <div className="qa-stat-card">

          <span className="qa-stat-label">
            Rejected
          </span>

          <strong>
            {rejectedReviews.length}
          </strong>

        </div>

      </div>


      {/* ==================================================
          PENDING REVIEWS
      ================================================== */}

      <div className="qa-section-card">

        <div className="qa-section-header">

          <div>
            <h2>
              Pending QA/QC Reviews
            </h2>

            <p>
              Requests waiting for QA/QC decision.
            </p>
          </div>

        </div>


        {pendingReviews.length === 0 ? (

          <div className="qa-empty-state">

            <div className="qa-empty-icon">
              ✓
            </div>

            <h3>
              No Pending Reviews
            </h3>

            <p>
              There are no QA/QC requests waiting
              for review.
            </p>

          </div>

        ) : (

          <div className="qa-review-list">

            {pendingReviews.map((review) => (

              <div
                className="qa-review-row"
                key={review.lotNumber}
              >

                <div className="qa-review-info">

                  <div className="qa-review-id">
                    {review.lotNumber}
                  </div>

                  <div className="qa-review-submitted">
                    Submitted: {review.submittedAt}
                  </div>

                </div>


                <div className="qa-review-status">

                  <span className="qa-status pending">
                    Pending Review
                  </span>

                </div>


                <button
                  type="button"
                  className="qa-open-button"
                  onClick={() =>
                    handleOpenReview(review)
                  }
                >
                  Open Review
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ==================================================
          ON HOLD REVIEWS
      ================================================== */}

      <div className="qa-section-card">

        <div className="qa-section-header">

          <div>
            <h2>
              On Hold
            </h2>

            <p>
              QA/QC requests currently placed on hold.
            </p>
          </div>

        </div>


        {holdReviews.length === 0 ? (

          <div className="qa-empty-state">

            <div className="qa-empty-icon">
              —
            </div>

            <h3>
              No On Hold Reviews
            </h3>

            <p>
              There are no QA/QC requests currently
              placed on hold.
            </p>

          </div>

        ) : (

          <div className="qa-review-list">

            {holdReviews.map((review) => (

              <div
                className="qa-review-row"
                key={review.lotNumber}
              >

                <div className="qa-review-info">

                  <div className="qa-review-id">
                    {review.lotNumber}
                  </div>

                  <div className="qa-review-submitted">
                    Submitted: {review.submittedAt}
                  </div>

                </div>


                <div className="qa-review-status">

                  <span className="qa-status hold">
                    On Hold
                  </span>

                </div>


                <button
                  type="button"
                  className="qa-open-button"
                  onClick={() =>
                    handleOpenReview(review)
                  }
                >
                  View Review
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ==================================================
          APPROVED REVIEWS
      ================================================== */}

      <div className="qa-section-card">

        <div className="qa-section-header">

          <div>
            <h2>
              Approved Reviews
            </h2>

            <p>
              QA/QC requests that have been approved.
            </p>
          </div>

        </div>


        {approvedReviews.length === 0 ? (

          <div className="qa-empty-state">

            <div className="qa-empty-icon">
              ✓
            </div>

            <h3>
              No Approved Reviews
            </h3>

            <p>
              No QA/QC requests have been approved yet.
            </p>

          </div>

        ) : (

          <div className="qa-review-list">

            {approvedReviews.map((review) => (

              <div
                className="qa-review-row"
                key={review.lotNumber}
              >

                <div className="qa-review-info">

                  <div className="qa-review-id">
                    {review.lotNumber}
                  </div>

                  <div className="qa-review-submitted">
                    Submitted: {review.submittedAt}
                  </div>

                </div>


                <div className="qa-review-status">

                  <span className="qa-status approved">
                    Approved
                  </span>

                </div>


                <button
                  type="button"
                  className="qa-open-button"
                  onClick={() =>
                    handleOpenReview(review)
                  }
                >
                  View Review
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ==================================================
          REJECTED REVIEWS
      ================================================== */}

      <div className="qa-section-card">

        <div className="qa-section-header">

          <div>
            <h2>
              Rejected Reviews
            </h2>

            <p>
              QA/QC requests that have been rejected.
            </p>
          </div>

        </div>


        {rejectedReviews.length === 0 ? (

          <div className="qa-empty-state">

            <div className="qa-empty-icon">
              —
            </div>

            <h3>
              No Rejected Reviews
            </h3>

            <p>
              No QA/QC requests have been rejected yet.
            </p>

          </div>

        ) : (

          <div className="qa-review-list">

            {rejectedReviews.map((review) => (

              <div
                className="qa-review-row"
                key={review.lotNumber}
              >

                <div className="qa-review-info">

                  <div className="qa-review-id">
                    {review.lotNumber}
                  </div>

                  <div className="qa-review-submitted">
                    Submitted: {review.submittedAt}
                  </div>

                </div>


                <div className="qa-review-status">

                  <span className="qa-status rejected">
                    Rejected
                  </span>

                </div>


                <button
                  type="button"
                  className="qa-open-button"
                  onClick={() =>
                    handleOpenReview(review)
                  }
                >
                  View Review
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ==================================================
          REVIEW PANEL
          Kept temporarily for dashboard testing.
      ================================================== */}

      {selectedReview && (

        <div className="qa-modal-overlay">

          <div
            className="qa-review-modal"
            role="dialog"
            aria-modal="true"
          >

            <div className="qa-modal-header">

              <div>

                <span className="qa-modal-label">
                  QA/QC Review
                </span>

                <h2>
                  {selectedReview.lotNumber}
                </h2>

              </div>


              <button
                type="button"
                className="qa-close-button"
                onClick={handleCloseReview}
              >
                ×
              </button>

            </div>


            <div className="qa-review-content">

              <div className="qa-review-status-box">

                <span>
                  Review Status
                </span>

                <strong>

                  {selectedReview.status ===
                    "PENDING" &&
                    "Pending QA/QC Review"}

                  {selectedReview.status ===
                    "APPROVED" &&
                    "Approved"}

                  {selectedReview.status ===
                    "HOLD" &&
                    "On Hold"}

                  {selectedReview.status ===
                    "REJECTED" &&
                    "Rejected"}

                </strong>

              </div>


              <div className="qa-review-placeholder">

                <div className="qa-placeholder-icon">
                  QA
                </div>

                <h3>
                  QA/QC Review Details
                </h3>

                <p>
                  The QA/QC-specific review fields will
                  be displayed here.
                </p>

                <p>
                  Production form details are not
                  displayed in this QA/QC interface.
                </p>

              </div>

            </div>


            {selectedReview.status === "PENDING" && (

              <div className="qa-modal-actions">

                <button
                  type="button"
                  className="qa-reject-button"
                  onClick={handleOpenReject}
                >
                  Reject
                </button>


                <button
                  type="button"
                  className="qa-hold-button"
                  onClick={handleHold}
                >
                  Hold
                </button>


                <button
                  type="button"
                  className="qa-approve-button"
                  onClick={handleApprove}
                >
                  Approve
                </button>

              </div>

            )}

          </div>

        </div>

      )}


      {/* ==================================================
          REJECT MODAL
      ================================================== */}

      {showRejectModal && (

        <div className="qa-modal-overlay">

          <div
            className="qa-reject-modal"
            role="dialog"
            aria-modal="true"
          >

            <div className="qa-reject-icon">
              !
            </div>


            <h2>
              Reject QA/QC Review?
            </h2>


            <p>
              Enter the QA/QC rejection reason.
            </p>


            <textarea
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(
                  event.target.value
                )
              }
              placeholder="Enter rejection reason"
              rows={5}
            />


            <div className="qa-reject-actions">

              <button
                type="button"
                className="qa-cancel-button"
                onClick={handleCloseReject}
              >
                Cancel
              </button>


              <button
                type="button"
                className="qa-confirm-reject-button"
                onClick={handleReject}
              >
                Reject
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default QADashboard;