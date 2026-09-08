import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RecoveryForm.css";

interface ProductionDetails {
  productCode: string;
  productName: string;
  machineCode: string;
  operatorName: string;
  operatorEmpId: string;
  formatNo: string;
  date: string;
  pageNo?: string;
}

interface RecoveryRow {
  id: number;
  activity: string;
  time: string;
  temp: string;
  signature: string;
  remarks: string;
}

interface CheckedBy {
  quantity: string;
  yieldPercentage: string;
  purity: string;
  productionInCharge: string;
  signature: string;
  date: string;
}

interface ApprovedBy {
  quantity: string;
  yieldPercentage: string;
  purity: string;
  qaInCharge: string;
  signature: string;
  date: string;
}

interface RecoveryLocationState {
  productionDetails: ProductionDetails | null;
  stageId: string;
  stageName: string;
  lotNumber: string;
}

const recoveryActivities = [
  "Cleanliness of the reactor checked by",
  "Crude charged by",
  "Charging completed by",
  "CTW, CHB circulation checked by",
  "Heating started at",
  "Recovery started at",
  "Recovery completed at",
  "Vacuum applied",
  "Total recovery completed at",
  "CRUDE DRAINED BY",
];

const createRecoveryRow = (
  activity: string,
  index: number
): RecoveryRow => ({
  id: Date.now() + index + Math.random(),
  activity,
  time: "",
  temp: "",
  signature: "",
  remarks: "",
});

const initialRecoveryRows = recoveryActivities.map(
  (activity, index) =>
    createRecoveryRow(activity, index)
);

const emptyCheckedBy: CheckedBy = {
  quantity: "",
  yieldPercentage: "",
  purity: "",
  productionInCharge: "",
  signature: "",
  date: "",
};

const emptyApprovedBy: ApprovedBy = {
  quantity: "",
  yieldPercentage: "",
  purity: "",
  qaInCharge: "",
  signature: "",
  date: "",
};

const RecoveryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    (location.state as RecoveryLocationState | null) ??
    null;

  const [productionDetails, setProductionDetails] =
    useState<ProductionDetails>(
      state?.productionDetails ?? {
        productCode: "",
        productName: "",
        machineCode: "",
        operatorName: "",
        operatorEmpId: "",
        formatNo: "",
        date: "",
      }
    );

  const lotNumber = state?.lotNumber ?? "";

  const [recoveryRows, setRecoveryRows] =
    useState<RecoveryRow[]>(initialRecoveryRows);

  const [totalRecovered, setTotalRecovered] =
    useState("");

  const [report, setReport] = useState("");

  const [crudeQty, setCrudeQty] = useState("");

  const [sampleGivenForAnalysis, setSampleGivenForAnalysis] =
    useState("");

  const [deviationsRemarks, setDeviationsRemarks] =
    useState("");

  const [checkedBy, setCheckedBy] =
    useState<CheckedBy>(emptyCheckedBy);

  const [approvedBy] =
    useState<ApprovedBy>(emptyApprovedBy);

  const [showSubmitConfirmation, setShowSubmitConfirmation] =
    useState(false);

  // --------------------------------------------------
  // AUTOMATIC PRODUCTION DETAILS
  // --------------------------------------------------

  const operatorName =
    productionDetails.operatorName;

  const operatorEmpId =
    productionDetails.operatorEmpId;

  const formatNo =
    productionDetails.formatNo;

  // --------------------------------------------------
  // UPDATE PRODUCTION DETAILS
  // Date remains editable.
  // Operator and Format No. are automatic.
  // --------------------------------------------------

  const updateProductionDetails = (
    field: keyof ProductionDetails,
    value: string
  ) => {
    if (
      field === "operatorName" ||
      field === "operatorEmpId" ||
      field === "formatNo"
    ) {
      return;
    }

    setProductionDetails((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // UPDATE RECOVERY ROW
  // --------------------------------------------------

  const updateRecoveryRow = (
    id: number,
    field: keyof Omit<RecoveryRow, "id" | "activity">,
    value: string
  ) => {
    setRecoveryRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  // --------------------------------------------------
  // UPDATE CHECKED BY
  // --------------------------------------------------

  const updateCheckedBy = (
    field: keyof CheckedBy,
    value: string
  ) => {
    setCheckedBy((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleReviewSubmit = () => {
    setShowSubmitConfirmation(true);
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirmation(false);

    navigate("/production", {
      replace: true,
    });
  };

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

  return (
    <div className="recovery-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="recovery-header">

        <div>

          <h1>
            Recovery of Solvent / Acid
          </h1>

          <p>
            Complete the Recovery stage details for this
            production.
          </p>

        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate("/production/generate-lot", {
              state,
            })
          }
        >
          Back
        </button>

      </div>

      {/* ==================================================
          PRODUCTION DETAILS
      ================================================== */}

      <div className="recovery-card">

        <div className="recovery-card-title">
          Production Details
        </div>

        <div className="recovery-summary-grid">

          {/* Product Name / Code */}

          <div className="recovery-summary-item">

            <span>
              Product Name / Code
            </span>

            <strong>
              {productionDetails.productCode || "—"}

              {productionDetails.productName
                ? ` - ${productionDetails.productName}`
                : ""}
            </strong>

          </div>

          {/* Recovery Lot */}

          <div className="recovery-summary-item recovery-lot-item">

            <span>
              Recovery Lot No.
            </span>

            <strong>
              {lotNumber || "—"}
            </strong>

          </div>

          {/* Operator */}

          <div className="recovery-summary-item">

            <span>
              Operator Name
            </span>

            <input
              type="text"
              value={
                operatorName
                  ? `${operatorName}${
                      operatorEmpId
                        ? ` - ${operatorEmpId}`
                        : ""
                    }`
                  : ""
              }
              readOnly
              disabled
              placeholder="Automatically populated"
            />

          </div>

          {/* Format No. */}

          <div className="recovery-summary-item">

            <span>
              Format No.
            </span>

            <input
              type="text"
              value={formatNo}
              readOnly
              disabled
              placeholder="Automatically populated"
            />

          </div>

          {/* Date */}

          <div className="recovery-summary-item">

            <span>
              Date
            </span>

            <input
              type="date"
              value={productionDetails.date}
              onChange={(event) =>
                updateProductionDetails(
                  "date",
                  event.target.value
                )
              }
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          RECOVERY PROCESS
      ================================================== */}

      <div className="recovery-card">

        <div className="recovery-card-heading">

          <div>

            <h2>
              Recovery Process
            </h2>

            <p>
              Record the recovery process activities,
              temperature, time and signatures.
            </p>

          </div>

        </div>

        <div className="recovery-table-wrapper">

          <table className="recovery-table">

            <thead>

              <tr>

                <th>
                  SL NO
                </th>

                <th>
                  PROCESS ACTIVITY
                </th>

                <th>
                  TIME
                </th>

                <th>
                  TEMP
                </th>

                <th>
                  SIGNATURE
                </th>

                <th>
                  REMARKS
                </th>

              </tr>

            </thead>

            <tbody>

              {recoveryRows.map((row, index) => (

                <tr key={row.id}>

                  <td className="recovery-serial-cell">
                    {index + 1}
                  </td>

                  <td className="recovery-activity-cell">
                    {row.activity}
                  </td>

                  <td>

                    <input
                      type="time"
                      value={row.time}
                      onChange={(event) =>
                        updateRecoveryRow(
                          row.id,
                          "time",
                          event.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <input
                      type="text"
                      value={row.temp}
                      onChange={(event) =>
                        updateRecoveryRow(
                          row.id,
                          "temp",
                          event.target.value
                        )
                      }
                      placeholder="Temp"
                    />

                  </td>

                  <td>

                    <input
                      type="text"
                      value={row.signature}
                      onChange={(event) =>
                        updateRecoveryRow(
                          row.id,
                          "signature",
                          event.target.value
                        )
                      }
                      placeholder="Signature"
                    />

                  </td>

                  <td>

                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(event) =>
                        updateRecoveryRow(
                          row.id,
                          "remarks",
                          event.target.value
                        )
                      }
                      placeholder="Remarks"
                    />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==================================================
          RECOVERY RESULT
      ================================================== */}

      <div className="recovery-card">

        <div className="recovery-card-title">
          Recovery Result
        </div>

        <div className="recovery-result-grid">

          <div className="recovery-result-group">

            <label htmlFor="totalRecovered">
              Total Recovered
            </label>

            <input
              id="totalRecovered"
              type="text"
              value={totalRecovered}
              onChange={(event) =>
                setTotalRecovered(event.target.value)
              }
              placeholder="Enter total recovered"
            />

          </div>

          <div className="recovery-result-group">

            <label htmlFor="report">
              Report
            </label>

            <input
              id="report"
              type="text"
              value={report}
              onChange={(event) =>
                setReport(event.target.value)
              }
              placeholder="Enter report"
            />

          </div>

          <div className="recovery-result-group">

            <label htmlFor="crudeQty">
              Qty of Crude
            </label>

            <input
              id="crudeQty"
              type="text"
              value={crudeQty}
              onChange={(event) =>
                setCrudeQty(event.target.value)
              }
              placeholder="Enter crude quantity"
            />

          </div>

          <div className="recovery-result-group">

            <label htmlFor="sampleGiven">
              Sample Given for Analysis
            </label>

            <input
              id="sampleGiven"
              type="text"
              value={sampleGivenForAnalysis}
              onChange={(event) =>
                setSampleGivenForAnalysis(
                  event.target.value
                )
              }
              placeholder="Enter details"
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          DEVIATIONS / REMARKS
      ================================================== */}

      <div className="recovery-card">

        <div className="recovery-card-title">
          Deviations / Remarks
        </div>

        <div className="recovery-form-grid">

          <div className="recovery-form-group full-width">

            <textarea
              value={deviationsRemarks}
              onChange={(event) =>
                setDeviationsRemarks(
                  event.target.value
                )
              }
              placeholder="Enter deviations or remarks"
              rows={5}
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          CHECKED BY / APPROVED BY
      ================================================== */}

      <div className="recovery-approval-grid">

        {/* ==================================================
            CHECKED BY
        ================================================== */}

        <div className="recovery-card">

          <div className="recovery-card-title">
            Checked By
          </div>

          <div className="recovery-form-grid">

            <div className="recovery-form-group">

              <label>
                Quantity
              </label>

              <input
                type="text"
                value={checkedBy.quantity}
                onChange={(event) =>
                  updateCheckedBy(
                    "quantity",
                    event.target.value
                  )
                }
                placeholder="Enter quantity"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Yield %
              </label>

              <input
                type="text"
                value={checkedBy.yieldPercentage}
                onChange={(event) =>
                  updateCheckedBy(
                    "yieldPercentage",
                    event.target.value
                  )
                }
                placeholder="Enter yield %"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Purity
              </label>

              <input
                type="text"
                value={checkedBy.purity}
                onChange={(event) =>
                  updateCheckedBy(
                    "purity",
                    event.target.value
                  )
                }
                placeholder="Enter purity"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Production In Charge
              </label>

              <input
                type="text"
                value={checkedBy.productionInCharge}
                onChange={(event) =>
                  updateCheckedBy(
                    "productionInCharge",
                    event.target.value
                  )
                }
                placeholder="Enter name"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Signature
              </label>

              <input
                type="text"
                value={checkedBy.signature}
                onChange={(event) =>
                  updateCheckedBy(
                    "signature",
                    event.target.value
                  )
                }
                placeholder="Enter signature"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Date
              </label>

              <input
                type="date"
                value={checkedBy.date}
                onChange={(event) =>
                  updateCheckedBy(
                    "date",
                    event.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* ==================================================
            APPROVED BY
        ================================================== */}

        <div className="recovery-card">

          <div className="recovery-card-title">
            Approved By
          </div>

          <p className="recovery-approval-info">
            This section will be automatically populated
            after QA/QC completes the review.
          </p>

          <div className="recovery-form-grid">

            <div className="recovery-form-group">

              <label>
                Quantity
              </label>

              <input
                type="text"
                value={approvedBy.quantity}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Yield %
              </label>

              <input
                type="text"
                value={approvedBy.yieldPercentage}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Purity
              </label>

              <input
                type="text"
                value={approvedBy.purity}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                QA In Charge
              </label>

              <input
                type="text"
                value={approvedBy.qaInCharge}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Signature
              </label>

              <input
                type="text"
                value={approvedBy.signature}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="recovery-form-group">

              <label>
                Date
              </label>

              <input
                type="date"
                value={approvedBy.date}
                readOnly
                disabled
              />

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <div className="recovery-bottom-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate("/production/generate-lot", {
              state,
            })
          }
        >
          Back
        </button>

        <button
          type="button"
          className="review-submit-button"
          onClick={handleReviewSubmit}
        >
          Review &amp; Submit
        </button>

      </div>

      {/* ==================================================
          SUBMIT POPUP
      ================================================== */}

      {showSubmitConfirmation && (

        <div
          className="submit-modal-overlay"
          onClick={handleCancelSubmit}
        >

          <div
            className="submit-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="submit-modal-icon">
              !
            </div>

            <h2>
              Submit Recovery Sheet?
            </h2>

            <p>
              Are you sure you want to submit this
              Recovery sheet?
            </p>

            <p className="submit-modal-warning">
              Once submitted, the sheet cannot be edited.
            </p>

            <div className="submit-modal-actions">

              <button
                type="button"
                className="submit-cancel-button"
                onClick={handleCancelSubmit}
              >
                Cancel
              </button>

              <button
                type="button"
                className="submit-confirm-button"
                onClick={handleConfirmSubmit}
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

export default RecoveryForm;