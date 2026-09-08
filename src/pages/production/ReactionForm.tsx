import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReactionForm.css";

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

interface ApprovedBy {
  quantity: string;
  yieldPercentage: string;
  purity: string;
  qaInCharge: string;
  signature: string;
  date: string;
}

interface CheckedBy {
  quantity: string;
  yieldPercentage: string;
  purity: string;
  productionInCharge: string;
  signature: string;
  date: string;
}

interface ReactionLocationState {
  productionDetails: ProductionDetails | null;
  stageId: string;
  stageName: string;
  lotNumber: string;

  viewOnly?: boolean;

  approvedBy?: ApprovedBy;
}

interface RawMaterial {
  id: number;
  materialName: string;
  quantity: string;
  rmBatchNo: string;
}

interface Utilities {
  chb: string;
  ctw: string;
  steam: string;
  others: string;
}

const emptyApprovedBy: ApprovedBy = {
  quantity: "",
  yieldPercentage: "",
  purity: "",
  qaInCharge: "",
  signature: "",
  date: "",
};

const ReactionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    (location.state as ReactionLocationState | null) ?? null;

  const productionDetails = state?.productionDetails;
  const lotNumber = state?.lotNumber ?? "";

  const isViewOnly = state?.viewOnly === true;

  const [showSubmitPopup, setShowSubmitPopup] = useState(false);

  // ==================================================
  // PRODUCTION DETAILS
  // ==================================================

  const operatorName = productionDetails?.operatorName ?? "";

  const operatorEmpId =
    productionDetails?.operatorEmpId ?? "";

  // Format No. is automatically populated and non-editable.
  const formatNo = productionDetails?.formatNo ?? "";

  const [date, setDate] = useState(
    productionDetails?.date ?? ""
  );

  const [taPdR, setTaPdR] = useState("");

  // ==================================================
  // RAW MATERIALS
  // ==================================================

  const [rawMaterials, setRawMaterials] =
    useState<RawMaterial[]>([
      {
        id: Date.now(),
        materialName: "",
        quantity: "",
        rmBatchNo: "",
      },
    ]);

  // ==================================================
  // UTILITIES
  // ==================================================

  const [utilities, setUtilities] =
    useState<Utilities>({
      chb: "",
      ctw: "",
      steam: "",
      others: "",
    });

  // ==================================================
  // REACTION DETAILS
  // ==================================================

  const [additionCompletedAt, setAdditionCompletedAt] =
    useState("");

  const [sampleGivenToQC, setSampleGivenToQC] =
    useState("");

  const [sampleGivenToGC, setSampleGivenToGC] =
    useState("");

  const [reactionCompletedAt, setReactionCompletedAt] =
    useState("");

  const [totalReactionHours, setTotalReactionHours] =
    useState("");

  const [report, setReport] = useState("");

  const [shiftWiseTimings, setShiftWiseTimings] =
    useState("");

  const [deviationsRemarks, setDeviationsRemarks] =
    useState("");

  // ==================================================
  // CHECKED BY
  // ==================================================

  const [checkedBy, setCheckedBy] =
    useState<CheckedBy>({
      quantity: "",
      yieldPercentage: "",
      purity: "",
      productionInCharge: "",
      signature: "",
      date: "",
    });

  // ==================================================
  // APPROVED BY
  // ==================================================

  const [approvedBy] =
    useState<ApprovedBy>(
      state?.approvedBy ?? emptyApprovedBy
    );

  // ==================================================
  // RAW MATERIAL FUNCTIONS
  // ==================================================

  const addRawMaterial = () => {
    if (isViewOnly) return;

    setRawMaterials((currentMaterials) => [
      ...currentMaterials,
      {
        id: Date.now() + Math.random(),
        materialName: "",
        quantity: "",
        rmBatchNo: "",
      },
    ]);
  };

  const removeRawMaterial = (id: number) => {
    if (isViewOnly) return;

    setRawMaterials((currentMaterials) =>
      currentMaterials.filter(
        (material) => material.id !== id
      )
    );
  };

  const updateRawMaterial = (
    id: number,
    field: keyof RawMaterial,
    value: string
  ) => {
    if (isViewOnly) return;

    setRawMaterials((currentMaterials) =>
      currentMaterials.map((material) =>
        material.id === id
          ? {
              ...material,
              [field]: value,
            }
          : material
      )
    );
  };

  // ==================================================
  // UTILITY FUNCTION
  // ==================================================

  const updateUtility = (
    utility: keyof Utilities,
    value: string
  ) => {
    if (isViewOnly) return;

    setUtilities((currentUtilities) => ({
      ...currentUtilities,
      [utility]: value,
    }));
  };

  // ==================================================
  // CHECKED BY FUNCTION
  // ==================================================

  const updateCheckedBy = (
    field: keyof CheckedBy,
    value: string
  ) => {
    if (isViewOnly) return;

    setCheckedBy((currentCheckedBy) => ({
      ...currentCheckedBy,
      [field]: value,
    }));
  };

  // ==================================================
  // UPDATED PRODUCTION DETAILS
  // ==================================================

  const getUpdatedProductionDetails =
    (): ProductionDetails | null => {
      if (!productionDetails) {
        return null;
      }

      return {
        ...productionDetails,
        operatorName,
        operatorEmpId,
        formatNo,
        date,
      };
    };

  // ==================================================
  // BACK
  // ==================================================

  const handleBack = () => {
    navigate("/production/generate-lot", {
      state: {
        ...state,
        productionDetails:
          getUpdatedProductionDetails(),
      },
    });
  };

  // ==================================================
  // OPEN SUBMIT POPUP
  // ==================================================

  const handleReviewSubmit = () => {
    if (isViewOnly) return;

    setShowSubmitPopup(true);
  };

  // ==================================================
  // CANCEL SUBMISSION
  // ==================================================

  const handleCancelSubmit = () => {
    setShowSubmitPopup(false);
  };

  // ==================================================
  // CONFIRM SUBMISSION
  // ==================================================

  const handleConfirmSubmit = async () => {
    if (isViewOnly) return;

    /*
     * Backend will be connected here later.
     *
     * The backend will save:
     *
     * - Product Code
     * - Product Name
     * - Reaction Lot Number
     * - Operator
     * - Employee ID
     * - Format No.
     * - Date
     * - TA/PD/R-
     * - Raw materials
     * - Utilities
     * - Reaction details
     * - Checked By
     *
     * and mark the stage as PENDING_QA.
     */

    setShowSubmitPopup(false);

    navigate("/production", {
      replace: true,
    });
  };

  return (
    <div className="reaction-page">

      {/* ==================================================
          VIEW ONLY NOTICE
      ================================================== */}

      {isViewOnly && (
        <div className="view-only-banner">

          <strong>
            View Only
          </strong>

          <span>
            This form has been submitted and cannot be
            edited. Edit access can only be granted by Admin.
          </span>

        </div>
      )}

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="reaction-header">

        <div>

          <h1>
            Reaction Log Sheet
          </h1>

          <p>
            {isViewOnly
              ? "View the submitted Reaction stage details."
              : "Complete the Reaction stage details for this production."}
          </p>

        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={handleBack}
        >
          Back
        </button>

      </div>

      {/* ==================================================
          PRODUCTION DETAILS
      ================================================== */}

      <div className="reaction-card">

        <div className="reaction-card-title">
          Production Details
        </div>

        <div className="reaction-form-grid">

          {/* ==================================================
              PRODUCT NAME / CODE
              AUTOMATIC
          ================================================== */}

          <div className="reaction-form-group">

            <label htmlFor="productNameCode">
              Product Name / Code
            </label>

            <input
              id="productNameCode"
              type="text"
              value={
                productionDetails
                  ? `${productionDetails.productCode || ""}${
                      productionDetails.productName
                        ? ` - ${productionDetails.productName}`
                        : ""
                    }`
                  : ""
              }
              readOnly
              className="readonly-field"
            />

          </div>

          {/* ==================================================
              REACTION LOT NO.
              AUTOMATIC
          ================================================== */}

          <div className="reaction-form-group">

            <label htmlFor="reactionLotNo">
              Reaction Lot No.
            </label>

            <input
              id="reactionLotNo"
              type="text"
              value={lotNumber}
              readOnly
              className="readonly-field"
            />

          </div>

          {/* ==================================================
              OPERATOR NAME / EMP ID
              AUTOMATIC
          ================================================== */}

          <div className="reaction-form-group">

            <label htmlFor="operatorName">
              Operator Name
            </label>

            <input
              id="operatorName"
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
              className="readonly-field"
              placeholder="Automatically populated"
            />

          </div>

          {/* ==================================================
              FORMAT NO.
              AUTOMATIC / NON-EDITABLE
          ================================================== */}

          <div className="reaction-form-group">

            <label htmlFor="formatNo">
              Format No.
            </label>

            <input
              id="formatNo"
              type="text"
              value={formatNo}
              readOnly
              disabled
              placeholder="Automatically populated"
              className="readonly-field"
            />

          </div>

          {/* ==================================================
              DATE
              EDITABLE
          ================================================== */}

          <div className="reaction-form-group">

            <label htmlFor="reactionDate">
              Date
            </label>

            <input
              id="reactionDate"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              readOnly={isViewOnly}
            />

          </div>

          {/* ==================================================
              TA/PD/R-
              EDITABLE
          ================================================== */}

          <div className="reaction-form-group">

            <label htmlFor="taPdR">
              TA/PD/R-
            </label>

            <input
              id="taPdR"
              type="text"
              value={taPdR}
              onChange={(event) =>
                setTaPdR(event.target.value)
              }
              placeholder="Enter TA/PD/R-"
              readOnly={isViewOnly}
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          RAW MATERIAL USED
      ================================================== */}

      <div className="reaction-card">

        <div className="reaction-card-heading">

          <div>

            <h2>
              Raw Material Used
            </h2>

            <p>
              Enter the raw materials used during the
              reaction.
            </p>

          </div>

          {!isViewOnly && (
            <button
              type="button"
              className="add-material-button"
              onClick={addRawMaterial}
            >
              + Add Material
            </button>
          )}

        </div>

        <div className="raw-material-table-wrapper">

          <table className="raw-material-table">

            <thead>

              <tr>

                <th>
                  SL.NO
                </th>

                <th>
                  RAW MATERIAL USED
                </th>

                <th>
                  QTY
                </th>

                <th>
                  RM BATCH NO.
                </th>

                {!isViewOnly && (
                  <th>
                    Action
                  </th>
                )}

              </tr>

            </thead>

            <tbody>

              {rawMaterials.map(
                (material, index) => (

                  <tr key={material.id}>

                    <td className="serial-cell">
                      {index + 1}
                    </td>

                    <td>

                      <input
                        type="text"
                        value={material.materialName}
                        onChange={(event) =>
                          updateRawMaterial(
                            material.id,
                            "materialName",
                            event.target.value
                          )
                        }
                        placeholder="Enter raw material"
                        readOnly={isViewOnly}
                      />

                    </td>

                    <td>

                      <input
                        type="text"
                        value={material.quantity}
                        onChange={(event) =>
                          updateRawMaterial(
                            material.id,
                            "quantity",
                            event.target.value
                          )
                        }
                        placeholder="Qty"
                        readOnly={isViewOnly}
                      />

                    </td>

                    <td>

                      <input
                        type="text"
                        value={material.rmBatchNo}
                        onChange={(event) =>
                          updateRawMaterial(
                            material.id,
                            "rmBatchNo",
                            event.target.value
                          )
                        }
                        placeholder="RM Batch No."
                        readOnly={isViewOnly}
                      />

                    </td>

                    {!isViewOnly && (
                      <td className="action-cell">

                        <button
                          type="button"
                          className="remove-material-button"
                          onClick={() =>
                            removeRawMaterial(
                              material.id
                            )
                          }
                          title="Remove material"
                        >
                          ×
                        </button>

                      </td>
                    )}

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==================================================
          UTILITIES
      ================================================== */}

      <div className="reaction-card">

        <div className="reaction-card-title">
          Utilities
        </div>

        <div className="utilities-grid">

          <div className="utility-row">

            <label htmlFor="chb">
              CHB
            </label>

            <input
              id="chb"
              type="text"
              value={utilities.chb}
              onChange={(event) =>
                updateUtility(
                  "chb",
                  event.target.value
                )
              }
              placeholder="Enter details"
              readOnly={isViewOnly}
            />

          </div>

          <div className="utility-row">

            <label htmlFor="ctw">
              CTW
            </label>

            <input
              id="ctw"
              type="text"
              value={utilities.ctw}
              onChange={(event) =>
                updateUtility(
                  "ctw",
                  event.target.value
                )
              }
              placeholder="Enter details"
              readOnly={isViewOnly}
            />

          </div>

          <div className="utility-row">

            <label htmlFor="steam">
              STEAM
            </label>

            <input
              id="steam"
              type="text"
              value={utilities.steam}
              onChange={(event) =>
                updateUtility(
                  "steam",
                  event.target.value
                )
              }
              placeholder="Enter details"
              readOnly={isViewOnly}
            />

          </div>

          <div className="utility-row">

            <label htmlFor="others">
              OTHERS
            </label>

            <input
              id="others"
              type="text"
              value={utilities.others}
              onChange={(event) =>
                updateUtility(
                  "others",
                  event.target.value
                )
              }
              placeholder="Enter details"
              readOnly={isViewOnly}
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          REACTION DETAILS
      ================================================== */}

      <div className="reaction-card">

        <div className="reaction-card-title">
          Reaction Details
        </div>

        <div className="reaction-form-grid">

          <div className="reaction-form-group">

            <label htmlFor="additionCompleted">
              Addition Completed at
            </label>

            <input
              id="additionCompleted"
              type="datetime-local"
              value={additionCompletedAt}
              onChange={(event) =>
                setAdditionCompletedAt(
                  event.target.value
                )
              }
              readOnly={isViewOnly}
            />

          </div>

          <div className="reaction-form-group">

            <label htmlFor="sampleQC">
              Sample Given to QC
            </label>

            <input
              id="sampleQC"
              type="text"
              value={sampleGivenToQC}
              onChange={(event) =>
                setSampleGivenToQC(
                  event.target.value
                )
              }
              placeholder="Enter details"
              readOnly={isViewOnly}
            />

          </div>

          <div className="reaction-form-group">

            <label htmlFor="sampleGC">
              Sample Given to GC
            </label>

            <input
              id="sampleGC"
              type="text"
              value={sampleGivenToGC}
              onChange={(event) =>
                setSampleGivenToGC(
                  event.target.value
                )
              }
              placeholder="Enter details"
              readOnly={isViewOnly}
            />

          </div>

          <div className="reaction-form-group">

            <label htmlFor="reactionCompleted">
              Reaction Completed at
            </label>

            <input
              id="reactionCompleted"
              type="datetime-local"
              value={reactionCompletedAt}
              onChange={(event) =>
                setReactionCompletedAt(
                  event.target.value
                )
              }
              readOnly={isViewOnly}
            />

          </div>

          <div className="reaction-form-group">

            <label htmlFor="reactionHours">
              Total No. of Reaction Hours
            </label>

            <input
              id="reactionHours"
              type="text"
              value={totalReactionHours}
              onChange={(event) =>
                setTotalReactionHours(
                  event.target.value
                )
              }
              placeholder="Enter total hours"
              readOnly={isViewOnly}
            />

          </div>

          <div className="reaction-form-group">

            <label htmlFor="report">
              Report
            </label>

            <input
              id="report"
              type="text"
              value={report}
              onChange={(event) =>
                setReport(event.target.value
                )
              }
              placeholder="Enter report"
              readOnly={isViewOnly}
            />

          </div>

          <div className="reaction-form-group full-width">

            <label htmlFor="shiftTimings">
              Shift Wise Timings
            </label>

            <textarea
              id="shiftTimings"
              value={shiftWiseTimings}
              onChange={(event) =>
                setShiftWiseTimings(
                  event.target.value
                )
              }
              placeholder="Enter shift wise timings"
              rows={4}
              readOnly={isViewOnly}
            />

          </div>

          <div className="reaction-form-group full-width">

            <label htmlFor="deviations">
              Deviations / Remarks
            </label>

            <textarea
              id="deviations"
              value={deviationsRemarks}
              onChange={(event) =>
                setDeviationsRemarks(
                  event.target.value
                )
              }
              placeholder="Enter deviations or remarks"
              rows={4}
              readOnly={isViewOnly}
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          CHECKED BY + APPROVED BY
      ================================================== */}

      <div className="reaction-approval-grid">

        {/* ==================================================
            CHECKED BY
        ================================================== */}

        <div className="reaction-card approval-card">

          <div className="reaction-card-title">
            Checked By
          </div>

          <div className="reaction-form-grid">

            <div className="reaction-form-group">

              <label htmlFor="checkedQuantity">
                Quantity
              </label>

              <input
                id="checkedQuantity"
                type="text"
                value={checkedBy.quantity}
                onChange={(event) =>
                  updateCheckedBy(
                    "quantity",
                    event.target.value
                  )
                }
                placeholder="Enter quantity"
                readOnly={isViewOnly}
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="checkedYield">
                Yield %
              </label>

              <input
                id="checkedYield"
                type="text"
                value={checkedBy.yieldPercentage}
                onChange={(event) =>
                  updateCheckedBy(
                    "yieldPercentage",
                    event.target.value
                  )
                }
                placeholder="Enter yield %"
                readOnly={isViewOnly}
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="checkedPurity">
                Purity
              </label>

              <input
                id="checkedPurity"
                type="text"
                value={checkedBy.purity}
                onChange={(event) =>
                  updateCheckedBy(
                    "purity",
                    event.target.value
                  )
                }
                placeholder="Enter purity"
                readOnly={isViewOnly}
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="productionInCharge">
                Production In Charge
              </label>

              <input
                id="productionInCharge"
                type="text"
                value={checkedBy.productionInCharge}
                onChange={(event) =>
                  updateCheckedBy(
                    "productionInCharge",
                    event.target.value
                  )
                }
                placeholder="Enter name"
                readOnly={isViewOnly}
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="checkedSignature">
                Signature
              </label>

              <input
                id="checkedSignature"
                type="text"
                value={checkedBy.signature}
                onChange={(event) =>
                  updateCheckedBy(
                    "signature",
                    event.target.value
                  )
                }
                placeholder="Enter signature"
                readOnly={isViewOnly}
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="checkedDate">
                Date
              </label>

              <input
                id="checkedDate"
                type="date"
                value={checkedBy.date}
                onChange={(event) =>
                  updateCheckedBy(
                    "date",
                    event.target.value
                  )
                }
                placeholder="dd-mm-yyyy"
                readOnly={isViewOnly}
              />

            </div>

          </div>

        </div>

        {/* ==================================================
            APPROVED BY
            QA/QC POPULATES THIS LATER
        ================================================== */}

        <div className="reaction-card approval-card">

          <div className="reaction-card-title">
            Approved By
          </div>

          <p className="approval-info">
            This section will be automatically populated
            after QA/QC completes the review.
          </p>

          <div className="reaction-form-grid">

            <div className="reaction-form-group">

              <label htmlFor="approvedQuantity">
                Quantity
              </label>

              <input
                id="approvedQuantity"
                type="text"
                value={approvedBy.quantity}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="approvedYield">
                Yield %
              </label>

              <input
                id="approvedYield"
                type="text"
                value={approvedBy.yieldPercentage}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="approvedPurity">
                Purity
              </label>

              <input
                id="approvedPurity"
                type="text"
                value={approvedBy.purity}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="qaInCharge">
                QA In Charge
              </label>

              <input
                id="qaInCharge"
                type="text"
                value={approvedBy.qaInCharge}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="approvedSignature">
                Signature
              </label>

              <input
                id="approvedSignature"
                type="text"
                value={approvedBy.signature}
                readOnly
                disabled
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="reaction-form-group">

              <label htmlFor="approvedDate">
                Date
              </label>

              <input
                id="approvedDate"
                type="date"
                value={approvedBy.date}
                readOnly
                disabled
                placeholder="dd-mm-yyyy"
              />

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <div className="reaction-bottom-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={handleBack}
        >
          Back
        </button>

        {!isViewOnly && (
          <button
            type="button"
            className="review-submit-button"
            onClick={handleReviewSubmit}
          >
            Review &amp; Submit
          </button>
        )}

      </div>

      {/* ==================================================
          SUBMIT CONFIRMATION POPUP
      ================================================== */}

      {showSubmitPopup && (

        <div
          className="submit-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-modal-title"
        >

          <div className="submit-modal">

            <div className="submit-modal-icon">
              !
            </div>

            <h2 id="submit-modal-title">
              Confirm Submission
            </h2>

            <p>
              Are you sure you want to submit this form?
            </p>

            <p className="submit-modal-warning">
              Once submitted, the form cannot be edited.
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

export default ReactionForm;