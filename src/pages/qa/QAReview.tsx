import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./QAReview.css";

interface QCParameter {
  name: string;
  standard: string;
  status: string;
  remarks: string;
}

type QADecision = "APPROVED" | "HOLD" | "REJECTED" | "";

const parameterNames = [
  "Quantity",
  "Yield (%)",
  "Purity (%)",
  "Process Parameters",
  "Specification",
  "Form / Appearance",
  "Test Results",
  "Equipment Used",
  "Method",
  "Column",
];

const QAReview = () => {
  const navigate = useNavigate();

  const { lotNumber } = useParams<{ lotNumber: string }>();

  const currentLotNumber = lotNumber || "RL-000001";

  // --------------------------------------------------
  // SUBMIT POPUP
  // --------------------------------------------------

  const [showSubmitPopup, setShowSubmitPopup] =
    useState(false);

  // --------------------------------------------------
  // QA BASIC INFORMATION
  // --------------------------------------------------

  const [operatorName, setOperatorName] = useState("");
  const [qcSampleNo, setQcSampleNo] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");

  // --------------------------------------------------
  // QC PARAMETERS
  // --------------------------------------------------

  const [parameters, setParameters] = useState<QCParameter[]>(
    parameterNames.map((name) => ({
      name,
      standard: "",
      status: "",
      remarks: "",
    }))
  );

  // --------------------------------------------------
  // QC DECISION
  // --------------------------------------------------

  const [decision, setDecision] =
    useState<QADecision>("");

  // --------------------------------------------------
  // QA/QC REMARKS
  // --------------------------------------------------

  const [qaQcRemarks, setQaQcRemarks] = useState("");

  // --------------------------------------------------
  // REJECTION REASON
  // --------------------------------------------------

  const [rejectionReason, setRejectionReason] =
    useState("");

  // --------------------------------------------------
  // CHECKED BY
  // --------------------------------------------------

  const [checkedBy, setCheckedBy] = useState({
    name: "",
    signature: "",
    date: "",
    time: "",
    remarks: "",
  });

  // --------------------------------------------------
  // APPROVED BY
  // --------------------------------------------------

  const [approvedBy, setApprovedBy] = useState({
    name: "",
    signature: "",
    date: "",
    time: "",
    remarks: "",
  });

  // --------------------------------------------------
  // PARAMETER UPDATE
  // --------------------------------------------------

  const updateParameter = (
    index: number,
    field: "standard" | "status" | "remarks",
    value: string
  ) => {
    setParameters((current) =>
      current.map((parameter, parameterIndex) =>
        parameterIndex === index
          ? {
              ...parameter,
              [field]: value,
            }
          : parameter
      )
    );
  };

  // --------------------------------------------------
  // DECISION UPDATE
  // --------------------------------------------------

  const handleDecisionChange = (
    newDecision: QADecision
  ) => {
    setDecision(newDecision);

    if (newDecision !== "REJECTED") {
      setRejectionReason("");
    }
  };

  // --------------------------------------------------
  // SUBMIT BUTTON
  // --------------------------------------------------

  const handleSubmit = () => {
    // Decision is mandatory
    if (!decision) {
      alert("Please select a QC decision.");
      return;
    }

    // QA/QC remarks are mandatory
    if (!qaQcRemarks.trim()) {
      alert("Please enter QA/QC remarks.");
      return;
    }

    // Rejection reason is mandatory only when rejected
    if (
      decision === "REJECTED" &&
      !rejectionReason.trim()
    ) {
      alert("Please enter the rejection reason.");
      return;
    }

    /*
     * Show custom centered confirmation popup.
     */
    setShowSubmitPopup(true);
  };

  // --------------------------------------------------
  // CONFIRM SUBMIT
  // --------------------------------------------------

  const confirmSubmit = () => {
    /*
     * Close popup first.
     */
    setShowSubmitPopup(false);

    /*
     * BACKEND WILL BE CONNECTED HERE LATER.
     *
     * For now the QA form is frontend-only.
     */

    /*
     * Return to QA Dashboard.
     */
    navigate("/qa");
  };

  // --------------------------------------------------
  // CANCEL SUBMIT POPUP
  // --------------------------------------------------

  const cancelSubmit = () => {
    setShowSubmitPopup(false);
  };

  // --------------------------------------------------
  // BACK TO QA DASHBOARD
  // --------------------------------------------------

  const handleBack = () => {
    navigate("/qa");
  };

  return (
    <div className="qa-review-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="qa-review-page-header">

        <div>
          <h1>QA/QC Inspection Sheet</h1>

          <p>
            Review and complete the QC inspection details
            for this production.
          </p>
        </div>

        <button
          type="button"
          className="qa-back-button"
          onClick={handleBack}
        >
          Back
        </button>

      </div>

      {/* ==================================================
          QC INSPECTION
      ================================================== */}

      <div className="qa-form-card">

        <div className="qa-form-card-header">

          <h2>QC Inspection</h2>

          <p>
            Enter the inspection details and observations.
          </p>

        </div>

        <div className="qa-form-card-body">

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <div className="qa-info-grid">

            {/* Product */}

            <div className="qa-field">

              <label>
                Product Name / Code
              </label>

              <input
                type="text"
                value="PRD-002 - Product 2"
                readOnly
              />

            </div>

            {/* Process Stage */}

            <div className="qa-field">

              <label>
                Process Stage
              </label>

              <input
                type="text"
                value="Reaction"
                readOnly
              />

            </div>

            {/* Lot Number */}

            <div className="qa-field">

              <label>
                Lot Number
              </label>

              <input
                type="text"
                value={currentLotNumber}
                readOnly
              />

            </div>

            {/* QA Operator */}

            <div className="qa-field">

              <label>
                Operator (QA/QC)
              </label>

              <input
                type="text"
                value={operatorName}
                onChange={(event) =>
                  setOperatorName(event.target.value)
                }
                placeholder="Enter operator name"
              />

            </div>

            {/* QC Sample */}

            <div className="qa-field">

              <label>
                QC Sample No.
              </label>

              <input
                type="text"
                value={qcSampleNo}
                onChange={(event) =>
                  setQcSampleNo(event.target.value)
                }
                placeholder="Enter QC sample number"
              />

            </div>

            {/* Inspection Date */}

            <div className="qa-field">

              <label>
                Inspection Date
              </label>

              <input
                type="date"
                value={inspectionDate}
                onChange={(event) =>
                  setInspectionDate(event.target.value)
                }
              />

            </div>

          </div>

          {/* ==================================================
              QC INSPECTION PARAMETERS
          ================================================== */}

          <div className="qa-subheading">
            QC Inspection Parameters
          </div>

          <div className="qa-parameter-list">

            {/* Header */}

            <div className="qa-parameter-header">

              <div>
                QC Check / Parameter
              </div>

              <div>
                Standard / Specification
              </div>

              <div>
                Status
              </div>

              <div>
                Remarks
              </div>

            </div>

            {/* Rows */}

            {parameters.map((parameter, index) => (

              <div
                className="qa-parameter-row"
                key={parameter.name}
              >

                <div className="qa-parameter-name">
                  {parameter.name}
                </div>

                <div className="qa-parameter-input">

                  <input
                    type="text"
                    value={parameter.standard}
                    onChange={(event) =>
                      updateParameter(
                        index,
                        "standard",
                        event.target.value
                      )
                    }
                    placeholder="Enter standard"
                  />

                </div>

                <div className="qa-parameter-input">

                  <input
                    type="text"
                    value={parameter.status}
                    onChange={(event) =>
                      updateParameter(
                        index,
                        "status",
                        event.target.value
                      )
                    }
                    placeholder="Enter status"
                  />

                </div>

                <div className="qa-parameter-input">

                  <input
                    type="text"
                    value={parameter.remarks}
                    onChange={(event) =>
                      updateParameter(
                        index,
                        "remarks",
                        event.target.value
                      )
                    }
                    placeholder="Enter remarks"
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* ==================================================
          QC DECISION
      ================================================== */}

      <div className="qa-form-card">

        <div className="qa-form-card-header">

          <h2>QC Decision</h2>

          <p>
            Select the final decision for this batch.
          </p>

        </div>

        <div className="qa-decision-body">

          <span className="qa-decision-label">
            QC Decision
          </span>

          {/* APPROVED */}

          <label className="qa-radio-option">

            <input
              type="radio"
              name="qcDecision"
              value="APPROVED"
              checked={decision === "APPROVED"}
              onChange={() =>
                handleDecisionChange("APPROVED")
              }
            />

            <span>
              Approved
            </span>

          </label>

          {/* HOLD */}

          <label className="qa-radio-option">

            <input
              type="radio"
              name="qcDecision"
              value="HOLD"
              checked={decision === "HOLD"}
              onChange={() =>
                handleDecisionChange("HOLD")
              }
            />

            <span>
              Hold
            </span>

          </label>

          {/* REJECTED */}

          <label className="qa-radio-option">

            <input
              type="radio"
              name="qcDecision"
              value="REJECTED"
              checked={decision === "REJECTED"}
              onChange={() =>
                handleDecisionChange("REJECTED")
              }
            />

            <span>
              Rejected
            </span>

          </label>

        </div>

        {/* QA/QC REMARKS */}

        <div className="qa-decision-remarks">

          <div className="qa-field">

            <label>
              QA/QC Remarks <span>*</span>
            </label>

            <textarea
              value={qaQcRemarks}
              onChange={(event) =>
                setQaQcRemarks(event.target.value)
              }
              placeholder="Enter QA/QC remarks"
              rows={4}
            />

          </div>

        </div>

        {/* REJECTION REASON */}

        {decision === "REJECTED" && (

          <div className="qa-decision-remarks">

            <div className="qa-field">

              <label>
                Rejection Reason <span>*</span>
              </label>

              <textarea
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(event.target.value)
                }
                placeholder="Enter reason for rejection"
                rows={4}
              />

            </div>

          </div>

        )}

      </div>

      {/* ==================================================
          VERIFICATION & APPROVAL
      ================================================== */}

      <div className="qa-form-card">

        <div className="qa-form-card-header">

          <h2>
            Verification &amp; Approval
          </h2>

          <p>
            Enter the verification and approval details.
          </p>

        </div>

        <div className="qa-approval-grid">

          {/* ==================================================
              CHECKED BY
          ================================================== */}

          <div className="qa-approval-box">

            <h3>
              Checked By
            </h3>

            <div className="qa-approval-fields">

              <div className="qa-field">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  value={checkedBy.name}
                  onChange={(event) =>
                    setCheckedBy({
                      ...checkedBy,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter name"
                />

              </div>

              <div className="qa-field">

                <label>
                  Signature
                </label>

                <input
                  type="text"
                  value={checkedBy.signature}
                  onChange={(event) =>
                    setCheckedBy({
                      ...checkedBy,
                      signature: event.target.value,
                    })
                  }
                  placeholder="Enter signature"
                />

              </div>

              <div className="qa-field">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={checkedBy.date}
                  onChange={(event) =>
                    setCheckedBy({
                      ...checkedBy,
                      date: event.target.value,
                    })
                  }
                />

              </div>

              <div className="qa-field">

                <label>
                  Time
                </label>

                <input
                  type="time"
                  value={checkedBy.time}
                  onChange={(event) =>
                    setCheckedBy({
                      ...checkedBy,
                      time: event.target.value,
                    })
                  }
                />

              </div>

              <div className="qa-field qa-full-width">

                <label>
                  Remarks
                </label>

                <textarea
                  value={checkedBy.remarks}
                  onChange={(event) =>
                    setCheckedBy({
                      ...checkedBy,
                      remarks: event.target.value,
                    })
                  }
                  placeholder="Enter remarks"
                  rows={3}
                />

              </div>

            </div>

          </div>

          {/* ==================================================
              APPROVED BY
          ================================================== */}

          <div className="qa-approval-box">

            <h3>
              Approved By
            </h3>

            <div className="qa-approval-fields">

              <div className="qa-field">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  value={approvedBy.name}
                  onChange={(event) =>
                    setApprovedBy({
                      ...approvedBy,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter name"
                />

              </div>

              <div className="qa-field">

                <label>
                  Signature
                </label>

                <input
                  type="text"
                  value={approvedBy.signature}
                  onChange={(event) =>
                    setApprovedBy({
                      ...approvedBy,
                      signature: event.target.value,
                    })
                  }
                  placeholder="Enter signature"
                />

              </div>

              <div className="qa-field">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={approvedBy.date}
                  onChange={(event) =>
                    setApprovedBy({
                      ...approvedBy,
                      date: event.target.value,
                    })
                  }
                />

              </div>

              <div className="qa-field">

                <label>
                  Time
                </label>

                <input
                  type="time"
                  value={approvedBy.time}
                  onChange={(event) =>
                    setApprovedBy({
                      ...approvedBy,
                      time: event.target.value,
                    })
                  }
                />

              </div>

              <div className="qa-field qa-full-width">

                <label>
                  Remarks
                </label>

                <textarea
                  value={approvedBy.remarks}
                  onChange={(event) =>
                    setApprovedBy({
                      ...approvedBy,
                      remarks: event.target.value,
                    })
                  }
                  placeholder="Enter remarks"
                  rows={3}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div className="qa-review-actions">

        <button
          type="button"
          className="qa-cancel-button"
          onClick={handleBack}
        >
          Cancel
        </button>

        <button
          type="button"
          className="qa-submit-button"
          onClick={handleSubmit}
        >
          Submit QC Review
        </button>

      </div>

      {/* ==================================================
          CENTERED SUBMIT CONFIRMATION POPUP
      ================================================== */}

      {showSubmitPopup && (
        <div
          className="qa-modal-overlay"
          onClick={cancelSubmit}
        >

          <div
            className="qa-confirm-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="qa-confirm-icon">
              !
            </div>

            <h2>
              Are you sure?
            </h2>

            <p>
              Once submitted, this form cannot be edited.
            </p>

            <div className="qa-confirm-actions">

              <button
                type="button"
                className="qa-confirm-cancel"
                onClick={cancelSubmit}
              >
                Cancel
              </button>

              <button
                type="button"
                className="qa-confirm-submit"
                onClick={confirmSubmit}
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default QAReview;