import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BlendingForm.css";

interface ProductionDetails {
  productCode: string;
  productName: string;
  machineCode?: string;
  operatorName?: string;
  operatorEmpId?: string;
  formatNo?: string;
  date?: string;
  pageNo?: string;
}

interface ActivityRow {
  id: number;
  activity: string;
  time: string;
  operatorSign: string;
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

interface BlendingLocationState {
  productionDetails: ProductionDetails | null;
  stageId: string;
  stageName: string;
  lotNumber: string;

  // Automatically carried from previous stages
  reactionLotNo?: string;
  distillationLotNo?: string;
}

/* ==================================================
   ACTIVITY TABLE
================================================== */

const initialActivities: ActivityRow[] = [
  {
    id: 1,
    activity: "Cleanliness of the blending unit checked by:",
    time: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 2,
    activity: "MF charging started by:",
    time: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 3,
    activity: "Any old material FG blended:",
    time: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 4,
    activity: "MF charging completed by:",
    time: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 5,
    activity: "Sample drawn by:",
    time: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 6,
    activity: "Sample accepted by:",
    time: "",
    operatorSign: "",
    remarks: "",
  },
];

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

const BlendingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    (location.state as BlendingLocationState | null) ?? null;

  const productionDetails = state?.productionDetails;
  const lotNumber = state?.lotNumber ?? "";

  /* ==================================================
     PRODUCTION DETAILS
  ================================================== */

  const [productName] = useState(
    productionDetails?.productName || ""
  );

  const [prodCode] = useState(
    productionDetails?.productCode || ""
  );

  const [blendingLotNo] = useState(lotNumber);

  /*
   * These lot numbers are automatically received
   * from the previous production stages.
   *
   * They are intentionally NOT editable here.
   */
  const reactionLotNo =
    state?.reactionLotNo ?? "";

  const distillationLotNo =
    state?.distillationLotNo ?? "";

  const [lotQty, setLotQty] =
    useState("");

  const [qtyCharged, setQtyCharged] =
    useState("");

  const [totalQtyCharged, setTotalQtyCharged] =
    useState("");

  /* ==================================================
     OPERATOR / DATE / FORMAT
     Operator and Format No. are automatically received
     from Start New Production and are NOT editable.
     Date remains editable.
  ================================================== */

  const operatorName =
    productionDetails?.operatorName || "";

  const operatorEmpId =
    productionDetails?.operatorEmpId || "";

  const operatorDisplay =
    operatorEmpId
      ? `${operatorName} - ${operatorEmpId}`
      : operatorName;

  const [blendingDate, setBlendingDate] =
    useState(
      productionDetails?.date || ""
    );

  const formatNo =
    productionDetails?.formatNo || "";

  /* ==================================================
     TA / PD / BL
  ================================================== */

  const [taPdBl, setTaPdBl] =
    useState("");

  /* ==================================================
     FORM STATES
  ================================================== */

  const [activities, setActivities] =
    useState<ActivityRow[]>(initialActivities);

  const [deviationsRemarks, setDeviationsRemarks] =
    useState("");

  const [checkedBy, setCheckedBy] =
    useState<CheckedBy>(emptyCheckedBy);

  const [approvedBy] =
    useState<ApprovedBy>(emptyApprovedBy);

  /* ==================================================
     SUBMIT POPUP
  ================================================== */

  const [showSubmitConfirmation, setShowSubmitConfirmation] =
    useState(false);

  /* ==================================================
     UPDATE ACTIVITY
  ================================================== */

  const updateActivity = (
    id: number,
    field: keyof Omit<ActivityRow, "id">,
    value: string
  ) => {
    setActivities((current) =>
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

  /* ==================================================
     UPDATE CHECKED BY
  ================================================== */

  const updateCheckedBy = (
    field: keyof CheckedBy,
    value: string
  ) => {
    setCheckedBy((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ==================================================
     SUBMIT
  ================================================== */

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

  /* ==================================================
     BACK
  ================================================== */

  const goBack = () => {
    navigate("/production/generate-lot", {
      state,
    });
  };

  /* ==================================================
     INVALID SESSION
  ================================================== */

  if (!state || !state.stageId || !state.lotNumber) {
    return (
      <div className="blending-page">

        <div className="blending-card invalid-session-card">

          <h2>
            Invalid Blending Session
          </h2>

          <p>
            Please select Blending from Stage Selection
            before opening this form.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate(
                "/production/select-stage",
                {
                  replace: true,
                }
              )
            }
          >
            Go to Stage Selection
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="blending-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="blending-header">

        <div>
          <h1>
            Blending Log Sheet
          </h1>

          <p>
            Complete the Blending stage details for
            this production.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={goBack}
        >
          Back
        </button>

      </div>

      {/* ==================================================
          BLENDING DETAILS
      ================================================== */}

      <div className="blending-card production-details-card">

        <div className="production-details-title">
          Blending Details
        </div>

        <div className="production-details-grid">

          {/* PRODUCT NAME / CODE */}

          <div className="production-detail-item">

            <label>
              Product Name / Code
            </label>

            <div className="production-detail-value">
              {productName || "—"}

              {prodCode && (
                <span className="product-code">
                  {" "} / {prodCode}
                </span>
              )}
            </div>

          </div>

          {/* BLENDING LOT NO. */}

          <div className="production-detail-item">

            <label>
              Blending Lot No.
            </label>

            <div className="production-detail-value lot-number">
              {blendingLotNo || "—"}
            </div>

          </div>

          {/* DISTILLATION LOT NO. - AUTOMATIC */}

          <div className="production-detail-item">

            <label>
              Distillation Lot No.
            </label>

            <div className="production-detail-value lot-number">
              {distillationLotNo || "—"}
            </div>

          </div>

          {/* REACTION LOT NO. - AUTOMATIC */}

          <div className="production-detail-item">

            <label>
              Reaction Lot No.
            </label>

            <div className="production-detail-value lot-number">
              {reactionLotNo || "—"}
            </div>

          </div>

          {/* LOT QTY */}

          <div className="production-detail-item">

            <label>
              Lot Qty
            </label>

            <input
              type="number"
              min="0"
              step="any"
              value={lotQty}
              onChange={(event) =>
                setLotQty(
                  event.target.value
                )
              }
              placeholder="Enter lot quantity"
            />

          </div>

          {/* QTY IN KGS CHARGED */}

          <div className="production-detail-item">

            <label>
              Qty. in Kgs Charged
            </label>

            <input
              type="number"
              min="0"
              step="any"
              value={qtyCharged}
              onChange={(event) =>
                setQtyCharged(
                  event.target.value
                )
              }
              placeholder="Enter quantity"
            />

          </div>

          {/* TOTAL QTY CHARGED */}

          <div className="production-detail-item">

            <label>
              Total Qty Charged in Kgs
            </label>

            <input
              type="number"
              min="0"
              step="any"
              value={totalQtyCharged}
              onChange={(event) =>
                setTotalQtyCharged(
                  event.target.value
                )
              }
              placeholder="Enter total quantity"
            />

          </div>

          {/* OPERATOR */}

          <div className="production-detail-item">

            <label>
              Operator Name
            </label>

            <input
              type="text"
              value={operatorDisplay}
              readOnly
              disabled
              placeholder="Automatically populated"
              className="readonly-field"
            />

          </div>

          {/* FORMAT NO. */}

          <div className="production-detail-item">

            <label>
              Format No.
            </label>

            <input
              type="text"
              value={formatNo}
              readOnly
              disabled
              placeholder="Automatically populated"
              className="readonly-field"
            />

          </div>

          {/* DATE */}

          <div className="production-detail-item">

            <label>
              Date
            </label>

            <input
              type="date"
              value={blendingDate}
              onChange={(event) =>
                setBlendingDate(
                  event.target.value
                )
              }
            />

          </div>

          {/* TA / PD / BL */}

          <div className="production-detail-item">

            <label>
              TA/PD/BL-
            </label>

            <input
              type="text"
              value={taPdBl}
              onChange={(event) =>
                setTaPdBl(
                  event.target.value
                )
              }
              placeholder="Enter TA/PD/BL-"
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          PROCESS ACTIVITY
      ================================================== */}

      <div className="blending-card table-card">

        <div className="form-section-title">
          Process Activity
        </div>

        <div className="blending-table-wrapper">

          <table className="blending-table activity-table">

            <colgroup>
              <col className="activity-sl-col" />
              <col className="activity-name-col" />
              <col className="activity-time-col" />
              <col className="activity-sign-col" />
              <col className="activity-remarks-col" />
            </colgroup>

            <thead>

              <tr>

                <th>
                  SL NO
                </th>

                <th>
                  Activity
                </th>

                <th>
                  TIME
                </th>

                <th>
                  Operator Sign
                </th>

                <th>
                  Remarks
                </th>

              </tr>

            </thead>

            <tbody>

              {activities.map((row, index) => (

                <tr key={row.id}>

                  <td className="serial-cell">
                    {index + 1}
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.activity}
                      onChange={(e) =>
                        updateActivity(
                          row.id,
                          "activity",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="time"
                      value={row.time}
                      onChange={(e) =>
                        updateActivity(
                          row.id,
                          "time",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.operatorSign}
                      onChange={(e) =>
                        updateActivity(
                          row.id,
                          "operatorSign",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(e) =>
                        updateActivity(
                          row.id,
                          "remarks",
                          e.target.value
                        )
                      }
                    />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==================================================
          DEVIATIONS / REMARKS
      ================================================== */}

      <div className="blending-card">

        <div className="form-section-title">
          Deviations / Remarks
        </div>

        <textarea
          className="blending-large-textarea"
          value={deviationsRemarks}
          onChange={(e) =>
            setDeviationsRemarks(
              e.target.value
            )
          }
          placeholder="Enter deviations / remarks"
          rows={5}
        />

      </div>

      {/* ==================================================
          CHECKED / APPROVED
      ================================================== */}

      <div className="blending-card">

        <div className="approval-grid">

          {/* CHECKED BY */}

          <div className="approval-section">

            <div className="approval-title">
              Checked By
            </div>

            <div className="approval-row">

              <label>
                Quantity
              </label>

              <input
                type="text"
                value={checkedBy.quantity}
                onChange={(e) =>
                  updateCheckedBy(
                    "quantity",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="approval-row">

              <label>
                Yield %
              </label>

              <input
                type="text"
                value={checkedBy.yieldPercentage}
                onChange={(e) =>
                  updateCheckedBy(
                    "yieldPercentage",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="approval-row">

              <label>
                Purity
              </label>

              <input
                type="text"
                value={checkedBy.purity}
                onChange={(e) =>
                  updateCheckedBy(
                    "purity",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="approval-row">

              <label>
                Production In Charge
              </label>

              <input
                type="text"
                value={checkedBy.productionInCharge}
                onChange={(e) =>
                  updateCheckedBy(
                    "productionInCharge",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="approval-row">

              <label>
                Signature
              </label>

              <input
                type="text"
                value={checkedBy.signature}
                onChange={(e) =>
                  updateCheckedBy(
                    "signature",
                    e.target.value
                  )
                }
              />

            </div>

            <div className="approval-row">

              <label>
                Date
              </label>

              <input
                type="date"
                value={checkedBy.date}
                onChange={(e) =>
                  updateCheckedBy(
                    "date",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* APPROVED BY */}

          <div className="approval-section">

            <div className="approval-title">
              Approved By
            </div>

            <p className="approval-info">
              This section will be automatically populated
              after QA/QC completes the review.
            </p>

            <div className="approval-fields">

              <div className="approval-row">

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

              <div className="approval-row">

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

              <div className="approval-row">

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

              <div className="approval-row">

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

              <div className="approval-row">

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

              <div className="approval-row">

                <label>
                  Date
                </label>

                <input
                  type="text"
                  value={approvedBy.date}
                  readOnly
                  disabled
                  placeholder="dd-mm-yyyy"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <div className="blending-bottom-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={goBack}
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
          SUBMIT CONFIRMATION
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
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="submit-modal-icon">
              !
            </div>

            <h2>
              Submit Blending Sheet?
            </h2>

            <p>
              Are you sure you want to submit this
              Blending sheet?
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

export default BlendingForm;