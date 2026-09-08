import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PackingForm.css";

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
  quantity: string;
  operatorSign: string;
  qcQaSign: string;
  remarks: string;
}

interface PackingRow {
  id: number;
  description: string;
  stdQty: string;
  reqQty: string;
  nos: string;
  totalQty: string;
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

interface PackingLocationState {
  productionDetails: ProductionDetails | null;
  stageId: string;
  stageName: string;
  lotNumber: string;

  /*
   * These values can be passed automatically
   * from the previous stages.
   */
  distillationLotNo?: string;
  reactionLotNo?: string;
  blendingLotNo?: string;
}

/* ==================================================
   PROCESS ACTIVITIES
================================================== */

const initialActivities: ActivityRow[] = [
  {
    id: 1,
    activity: "Cleanliness of the packing material checked by:",
    time: "",
    quantity: "",
    operatorSign: "",
    qcQaSign: "",
    remarks: "",
  },
  {
    id: 2,
    activity: "FG Packing started by:",
    time: "",
    quantity: "",
    operatorSign: "",
    qcQaSign: "",
    remarks: "",
  },
  {
    id: 3,
    activity: "FG Packing completed by:",
    time: "",
    quantity: "",
    operatorSign: "",
    qcQaSign: "",
    remarks: "",
  },
  {
    id: 4,
    activity: "FG sample given by:",
    time: "",
    quantity: "",
    operatorSign: "",
    qcQaSign: "",
    remarks: "",
  },
  {
    id: 5,
    activity: "FG sample accepted by:",
    time: "",
    quantity: "",
    operatorSign: "",
    qcQaSign: "",
    remarks: "",
  },
  {
    id: 6,
    activity: "Total time taken.",
    time: "",
    quantity: "",
    operatorSign: "",
    qcQaSign: "",
    remarks: "",
  },
  {
    id: 7,
    activity: "Total FG Qty.",
    time: "",
    quantity: "",
    operatorSign: "",
    qcQaSign: "",
    remarks: "",
  },
  {
    id: 8,
    activity: "Total FG leftover any:",
    time: "",
    quantity: "",
    operatorSign: "",
    qcQaSign: "",
    remarks: "",
  },
];

/* ==================================================
   PACKING DESCRIPTION
================================================== */

const initialPackingRows: PackingRow[] = [
  {
    id: 1,
    description: "HDPE/MS Barrels",
    stdQty: "",
    reqQty: "",
    nos: "",
    totalQty: "",
  },
  {
    id: 2,
    description: "iron drums/Galvanium/Aluminium cans",
    stdQty: "",
    reqQty: "",
    nos: "",
    totalQty: "",
  },
  {
    id: 3,
    description: "Aluminium/Carboy cots",
    stdQty: "",
    reqQty: "",
    nos: "",
    totalQty: "",
  },
  {
    id: 4,
    description: "Aluminium/Carboy bottle",
    stdQty: "",
    reqQty: "",
    nos: "",
    totalQty: "",
  },
];

/* ==================================================
   CHECKED BY
================================================== */

const emptyCheckedBy: CheckedBy = {
  quantity: "",
  yieldPercentage: "",
  purity: "",
  productionInCharge: "",
  signature: "",
  date: "",
};

/* ==================================================
   APPROVED BY
================================================== */

const emptyApprovedBy: ApprovedBy = {
  quantity: "",
  yieldPercentage: "",
  purity: "",
  qaInCharge: "",
  signature: "",
  date: "",
};

/* ==================================================
   COMPONENT
================================================== */

const PackingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    (location.state as PackingLocationState | null) ?? null;

  const productionDetails = state?.productionDetails;

  const lotNumber = state?.lotNumber ?? "";

  /* ==================================================
     BASIC DETAILS
  ================================================== */

  const [productName] = useState(
    productionDetails?.productName || ""
  );

  const [prodCode] = useState(
    productionDetails?.productCode || ""
  );

  const [packingLotNo] = useState(lotNumber);

  /*
   * Format No. and Operator are automatically
   * carried from Start New Production.
   *
   * They are read-only on this form.
   */
  const formatNo = productionDetails?.formatNo || "";

  const operatorName = productionDetails?.operatorName || "";

  const operatorEmpId =
    productionDetails?.operatorEmpId || "";

  const [packingDate, setPackingDate] = useState(
    productionDetails?.date || ""
  );

  /*
   * Previous-stage lot numbers are automatically taken
   * from navigation state.
   */
  const [distillationLotNo] = useState(
    state?.distillationLotNo || ""
  );

  const [reactionLotNo] = useState(
    state?.reactionLotNo || ""
  );

  const [blendingLotNo] = useState(
    state?.blendingLotNo || ""
  );

  const [qtyCharged, setQtyCharged] = useState("");

  const [taPdBl, setTaPdBl] = useState("");

  /* ==================================================
     ACTIVITIES
  ================================================== */

  const [activities, setActivities] =
    useState<ActivityRow[]>(initialActivities);

  /* ==================================================
     PACKING DESCRIPTION
  ================================================== */

  const [packingRows, setPackingRows] =
    useState<PackingRow[]>(initialPackingRows);

  /*
   * IMPORTANT:
   * Total is manually editable.
   * It is NOT calculated automatically.
   */
  const [totalPackingQty, setTotalPackingQty] =
    useState("");

  /* ==================================================
     DEVIATIONS
  ================================================== */

  const [deviationsRemarks, setDeviationsRemarks] =
    useState("");

  /* ==================================================
     CHECKED / APPROVED
  ================================================== */

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
     UPDATE PACKING ROW
  ================================================== */

  const updatePackingRow = (
    id: number,
    field: keyof Omit<PackingRow, "id" | "description">,
    value: string
  ) => {
    setPackingRows((current) =>
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
      <div className="packing-page">

        <div className="packing-card invalid-session-card">

          <h2>
            Invalid Packing Session
          </h2>

          <p>
            Please select Packing from Stage Selection
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
    <div className="packing-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="packing-header">

        <div>
          <h1>
            Packing Log Sheet
          </h1>

          <p>
            Complete the Packing stage details for
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
          PACKING DETAILS
      ================================================== */}

      <div className="packing-card production-details-card">

        <div className="production-details-title">
          Packing Details
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

          {/* DISTILLATION LOT NO. */}

          <div className="production-detail-item">

            <label>
              Distillation Lot No.
            </label>

            <div className="production-detail-value lot-number">
              {distillationLotNo || "—"}
            </div>

          </div>

          {/* REACTION LOT NO. */}

          <div className="production-detail-item">

            <label>
              Reaction Lot No.
            </label>

            <div className="production-detail-value lot-number">
              {reactionLotNo || "—"}
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

          {/* PACKING LOT NO. */}

          <div className="production-detail-item">

            <label>
              Packing Lot No.
            </label>

            <div className="production-detail-value lot-number">
              {packingLotNo || "—"}
            </div>

          </div>

          {/* QTY CHARGED */}

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
                setQtyCharged(event.target.value)
              }
              placeholder="Enter quantity"
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
              className="readonly-field"
              placeholder="Automatically populated"
            />

          </div>

          {/* OPERATOR */}

          <div className="production-detail-item">

            <label>
              Operator Name
            </label>

            <input
              type="text"
              value={`${operatorName}${operatorEmpId ? ` - ${operatorEmpId}` : ""}`}
              readOnly
              disabled
              className="readonly-field"
              placeholder="Automatically populated"
            />

          </div>

          {/* DATE */}

          <div className="production-detail-item">

            <label>
              Date
            </label>

            <input
              type="date"
              value={packingDate}
              onChange={(event) =>
                setPackingDate(event.target.value)
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
                setTaPdBl(event.target.value)
              }
              placeholder="Enter TA/PD/BL-"
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          PROCESS ACTIVITY
      ================================================== */}

      <div className="packing-card table-card">

        <div className="form-section-title">
          Process Activity
        </div>

        <div className="packing-table-wrapper">

          <table className="packing-table activity-table">

            <colgroup>
              <col className="activity-sl-col" />
              <col className="activity-name-col" />
              <col className="activity-time-col" />
              <col className="activity-qty-col" />
              <col className="activity-sign-col" />
              <col className="activity-qc-sign-col" />
              <col className="activity-remarks-col" />
            </colgroup>

            <thead>

              <tr>

                <th>
                  SL NO
                </th>

                <th>
                  ACTIVITY
                </th>

                <th>
                  TIME
                </th>

                <th>
                  Qty in Kgs
                </th>

                <th>
                  Operator Sign
                </th>

                <th>
                  QC/QA Sign
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
                      onChange={(event) =>
                        updateActivity(
                          row.id,
                          "activity",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="time"
                      value={row.time}
                      onChange={(event) =>
                        updateActivity(
                          row.id,
                          "time",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={row.quantity}
                      onChange={(event) =>
                        updateActivity(
                          row.id,
                          "quantity",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.operatorSign}
                      onChange={(event) =>
                        updateActivity(
                          row.id,
                          "operatorSign",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.qcQaSign}
                      onChange={(event) =>
                        updateActivity(
                          row.id,
                          "qcQaSign",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(event) =>
                        updateActivity(
                          row.id,
                          "remarks",
                          event.target.value
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
          PACKING DESCRIPTION
      ================================================== */}

      <div className="packing-card table-card">

        <div className="form-section-title">
          Packing Description
        </div>

        <div className="packing-table-wrapper">

          <table className="packing-table description-table">

            <colgroup>
              <col className="description-sl-col" />
              <col className="description-name-col" />
              <col className="description-std-col" />
              <col className="description-req-col" />
              <col className="description-nos-col" />
              <col className="description-total-col" />
            </colgroup>

            <thead>

              <tr>

                <th>
                  Sl. No.
                </th>

                <th>
                  PACKING DESCRIPTION
                </th>

                <th>
                  Std Qty
                </th>

                <th>
                  Req Qty
                </th>

                <th>
                  Nos
                </th>

                <th>
                  Total Qty
                </th>

              </tr>

            </thead>

            <tbody>

              {packingRows.map((row, index) => (

                <tr key={row.id}>

                  <td className="serial-cell">
                    {index + 1}
                  </td>

                  <td className="fixed-description">
                    {row.description}
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.stdQty}
                      onChange={(event) =>
                        updatePackingRow(
                          row.id,
                          "stdQty",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.reqQty}
                      onChange={(event) =>
                        updatePackingRow(
                          row.id,
                          "reqQty",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={row.nos}
                      onChange={(event) =>
                        updatePackingRow(
                          row.id,
                          "nos",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={row.totalQty}
                      onChange={(event) =>
                        updatePackingRow(
                          row.id,
                          "totalQty",
                          event.target.value
                        )
                      }
                    />
                  </td>

                </tr>

              ))}

              {/* MANUAL TOTAL */}

              <tr className="packing-total-row">

                <td
                  colSpan={5}
                  className="total-label-cell"
                >
                  Total
                </td>

                <td>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={totalPackingQty}
                    onChange={(event) =>
                      setTotalPackingQty(
                        event.target.value
                      )
                    }
                    placeholder="Enter total"
                  />
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* ==================================================
          DEVIATIONS / REMARKS
      ================================================== */}

      <div className="packing-card">

        <div className="form-section-title">
          Deviations/Remarks
        </div>

        <textarea
          className="packing-large-textarea"
          value={deviationsRemarks}
          onChange={(event) =>
            setDeviationsRemarks(
              event.target.value
            )
          }
          placeholder="Enter deviations / remarks"
          rows={5}
        />

      </div>

      {/* ==================================================
          CHECKED / APPROVED
      ================================================== */}

      <div className="packing-card">

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
                onChange={(event) =>
                  updateCheckedBy(
                    "quantity",
                    event.target.value
                  )
                }
                placeholder="Enter quantity"
              />

            </div>

            <div className="approval-row">

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

            <div className="approval-row">

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

            <div className="approval-row">

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

            <div className="approval-row">

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

            <div className="approval-row">

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

          {/* APPROVED BY */}

          <div className="approval-section">

            <div className="approval-title">
              Approved By
            </div>

            <p className="approval-info">
              This section will be automatically populated after QA/QC completes the review.
            </p>

            <div className="approval-row">

              <label>
                Quantity
              </label>

              <input
                type="text"
                value={approvedBy.quantity}
                readOnly
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
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="approval-row">

              <label>
                Date
              </label>

              <input
                type="date"
                value={approvedBy.date}
                readOnly
              />

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <div className="packing-bottom-actions">

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
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="submit-modal-icon">
              !
            </div>

            <h2>
              Submit Packing Sheet?
            </h2>

            <p>
              Are you sure you want to submit this
              Packing sheet?
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

export default PackingForm;