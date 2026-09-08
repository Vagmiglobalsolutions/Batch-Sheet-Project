import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./WashingForm.css";

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

interface WashingMaterial {
  id: number;
  h2o: string;
  salt: string;
  sodaAsh: string;
  naoh33: string;
  acid: string;
  phMonitoring: string;
  time: string;
  sign: string;
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

interface WashingLocationState {
  productionDetails: ProductionDetails | null;
  stageId: string;
  stageName: string;
  lotNumber: string;
  viewOnly?: boolean;
  approvedBy?: ApprovedBy;
}

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

const createEmptyMaterial = (): WashingMaterial => ({
  id: Date.now() + Math.random(),
  h2o: "",
  salt: "",
  sodaAsh: "",
  naoh33: "",
  acid: "",
  phMonitoring: "",
  time: "",
  sign: "",
  remarks: "",
});

const WashingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    (location.state as WashingLocationState | null) ?? null;

  const productionDetails = state?.productionDetails;
  const lotNumber = state?.lotNumber ?? "";
  const isViewOnly = state?.viewOnly === true;

  // ==================================================
  // PRODUCTION DETAILS
  // Operator Name and Format No. are automatically
  // populated from Start New Production.
  // Date remains editable.
  // ==================================================

  const operatorName =
    productionDetails?.operatorName ?? "";

  const operatorEmpId =
    productionDetails?.operatorEmpId ?? "";

  const formatNo =
    productionDetails?.formatNo ?? "";

  const [washingDate, setWashingDate] = useState(
    productionDetails?.date ?? ""
  );

  // ==================================================
  // SUBMIT POPUP
  // ==================================================

  const [showSubmitConfirmation, setShowSubmitConfirmation] =
    useState(false);

  // ==================================================
  // WASHING MATERIAL DETAILS
  // ==================================================

  const [washingMaterials, setWashingMaterials] = useState<
    WashingMaterial[]
  >([createEmptyMaterial()]);

  // ==================================================
  // TOTAL FIELDS
  // ==================================================

  const [totalH2o, setTotalH2o] = useState("");
  const [totalSalt, setTotalSalt] = useState("");
  const [totalSodaAsh, setTotalSodaAsh] = useState("");
  const [totalNaoh33, setTotalNaoh33] = useState("");
  const [totalAcid, setTotalAcid] = useState("");
  const [totalPhMonitoring, setTotalPhMonitoring] =
    useState("");

  // ==================================================
  // PROCESS OBSERVATIONS
  // ==================================================

  const [productPurity, setProductPurity] = useState("");
  const [rmContent, setRmContent] = useState("");
  const [impurityProfile, setImpurityProfile] = useState("");

  // ==================================================
  // OUTPUT DETAILS
  // ==================================================

  const [crudeQty, setCrudeQty] = useState("");
  const [stdQty, setStdQty] = useState("");

  const [crudeYield, setCrudeYield] = useState("");
  const [stdYield, setStdYield] = useState("");

  const [crudePurity, setCrudePurity] = useState("");
  const [stdPurity, setStdPurity] = useState("");

  // ==================================================
  // DEVIATIONS / REMARKS
  // ==================================================

  const [deviationsRemarks, setDeviationsRemarks] =
    useState("");

  // ==================================================
  // CHECKED BY
  // ==================================================

  const [checkedBy, setCheckedBy] =
    useState<CheckedBy>(emptyCheckedBy);

  // ==================================================
  // APPROVED BY
  // QA/QC WILL POPULATE THIS LATER
  // ==================================================

  const [approvedBy] =
    useState<ApprovedBy>(
      state?.approvedBy ?? emptyApprovedBy
    );

  // ==================================================
  // ADD WASHING ROW
  // ==================================================

  const addWashingRow = () => {
    if (isViewOnly) return;

    setWashingMaterials((current) => [
      ...current,
      createEmptyMaterial(),
    ]);
  };

  // ==================================================
  // REMOVE WASHING ROW
  // ==================================================

  const removeWashingRow = (id: number) => {
    if (isViewOnly) return;

    setWashingMaterials((current) =>
      current.filter((row) => row.id !== id)
    );
  };

  // ==================================================
  // UPDATE WASHING ROW
  // ==================================================

  const updateWashingRow = (
    id: number,
    field: keyof Omit<WashingMaterial, "id">,
    value: string
  ) => {
    if (isViewOnly) return;

    setWashingMaterials((current) =>
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

  // ==================================================
  // UPDATE CHECKED BY
  // ==================================================

  const updateCheckedBy = (
    field: keyof CheckedBy,
    value: string
  ) => {
    if (isViewOnly) return;

    setCheckedBy((current) => ({
      ...current,
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
        date: washingDate,
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

    setShowSubmitConfirmation(true);
  };

  // ==================================================
  // CANCEL SUBMIT
  // ==================================================

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false);
  };

  // ==================================================
  // CONFIRM SUBMIT
  // ==================================================

  const handleConfirmSubmit = () => {
    if (isViewOnly) return;

    /*
     * Backend submission will be connected later.
     */

    setShowSubmitConfirmation(false);

    navigate("/production", {
      replace: true,
    });
  };

  return (
    <div className="washing-page">

      {/* ==================================================
          VIEW ONLY NOTICE
      ================================================== */}

      {isViewOnly && (
        <div className="view-only-banner">
          <strong>View Only</strong>

          <span>
            This form has been submitted and cannot be
            edited. Edit access can only be granted by Admin.
          </span>
        </div>
      )}

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="washing-header">

        <div>
          <h1>Washing Log Sheet</h1>

          <p>
            {isViewOnly
              ? "View the submitted Washing stage details."
              : "Complete the Washing stage details for this production."}
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

      <div className="washing-card">

        <div className="washing-card-title">
          Production Details
        </div>

        <div className="washing-summary-grid">

          {/* Product Name / Code */}

          <div className="washing-summary-item">

            <span>
              Product Name / Code
            </span>

            <strong>
              {productionDetails?.productCode || "—"}

              {productionDetails?.productName
                ? ` - ${productionDetails.productName}`
                : ""}
            </strong>

          </div>

          {/* Washing Lot */}

          <div className="washing-summary-item washing-lot-item">

            <span>
              Washing Lot No.
            </span>

            <strong>
              {lotNumber || "—"}
            </strong>

          </div>

          {/* Operator */}

          <div className="washing-summary-item washing-editable-item">

            <label htmlFor="washingOperatorName">
              Operator Name
            </label>

            <input
              id="washingOperatorName"
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

          {/* Format */}

          <div className="washing-summary-item washing-editable-item">

            <label htmlFor="washingFormatNo">
              Format No.
            </label>

            <input
              id="washingFormatNo"
              type="text"
              value={formatNo}
              readOnly
              disabled
              placeholder="Automatically populated"
            />

          </div>

          {/* Date */}

          <div className="washing-summary-item washing-editable-item">

            <label htmlFor="washingDate">
              Date
            </label>

            <input
              id="washingDate"
              type="date"
              value={washingDate}
              onChange={(event) =>
                setWashingDate(event.target.value)
              }
              readOnly={isViewOnly}
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          WASHING PROCESS
      ================================================== */}

      <div className="washing-card">

        <div className="washing-card-heading">

          <div>

            <h2>
              Washing Process
            </h2>

            <p>
              Enter the materials, process observations and
              washing details.
            </p>

          </div>

          {!isViewOnly && (
            <button
              type="button"
              className="add-washing-button"
              onClick={addWashingRow}
            >
              + Add Row
            </button>
          )}

        </div>

        <div className="washing-table-wrapper">

          <table className="washing-table">

            <thead>

              <tr>
                <th>SL.NO</th>
                <th>H2O</th>
                <th>SALT</th>
                <th>SODA ASH</th>
                <th>NAOH 33%</th>
                <th>ACID</th>
                <th>pH MONITORING</th>
                <th>TIME</th>
                <th>SIGN</th>
                <th>REMARKS</th>

                {!isViewOnly && (
                  <th>ACTION</th>
                )}
              </tr>

            </thead>

            <tbody>

              {washingMaterials.map((row, index) => (

                <tr key={row.id}>

                  <td className="washing-serial-cell">
                    {index + 1}
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.h2o}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "h2o",
                          event.target.value
                        )
                      }
                      placeholder="H2O"
                      readOnly={isViewOnly}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.salt}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "salt",
                          event.target.value
                        )
                      }
                      placeholder="Salt"
                      readOnly={isViewOnly}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.sodaAsh}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "sodaAsh",
                          event.target.value
                        )
                      }
                      placeholder="Soda Ash"
                      readOnly={isViewOnly}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.naoh33}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "naoh33",
                          event.target.value
                        )
                      }
                      placeholder="NaOH"
                      readOnly={isViewOnly}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.acid}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "acid",
                          event.target.value
                        )
                      }
                      placeholder="Acid"
                      readOnly={isViewOnly}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.phMonitoring}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "phMonitoring",
                          event.target.value
                        )
                      }
                      placeholder="pH"
                      readOnly={isViewOnly}
                    />
                  </td>

                  <td>
                    <input
                      type="time"
                      value={row.time}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "time",
                          event.target.value
                        )
                      }
                      readOnly={isViewOnly}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.sign}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "sign",
                          event.target.value
                        )
                      }
                      placeholder="Sign"
                      readOnly={isViewOnly}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(event) =>
                        updateWashingRow(
                          row.id,
                          "remarks",
                          event.target.value
                        )
                      }
                      placeholder="Remarks"
                      readOnly={isViewOnly}
                    />
                  </td>

                  {!isViewOnly && (
                    <td className="washing-action-cell">

                      {washingMaterials.length > 1 && (
                        <button
                          type="button"
                          className="remove-washing-button"
                          onClick={() =>
                            removeWashingRow(row.id)
                          }
                          title="Remove row"
                        >
                          ×
                        </button>
                      )}

                    </td>
                  )}

                </tr>

              ))}

              {/* TOTAL ROW */}

              <tr className="washing-total-row">

                <td className="washing-total-label">
                  TOTAL
                </td>

                <td>
                  <input
                    type="text"
                    value={totalH2o}
                    onChange={(event) =>
                      setTotalH2o(event.target.value)
                    }
                    placeholder="Total"
                    readOnly={isViewOnly}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={totalSalt}
                    onChange={(event) =>
                      setTotalSalt(event.target.value)
                    }
                    placeholder="Total"
                    readOnly={isViewOnly}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={totalSodaAsh}
                    onChange={(event) =>
                      setTotalSodaAsh(event.target.value)
                    }
                    placeholder="Total"
                    readOnly={isViewOnly}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={totalNaoh33}
                    onChange={(event) =>
                      setTotalNaoh33(event.target.value)
                    }
                    placeholder="Total"
                    readOnly={isViewOnly}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={totalAcid}
                    onChange={(event) =>
                      setTotalAcid(event.target.value)
                    }
                    placeholder="Total"
                    readOnly={isViewOnly}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={totalPhMonitoring}
                    onChange={(event) =>
                      setTotalPhMonitoring(
                        event.target.value
                      )
                    }
                    placeholder="Total"
                    readOnly={isViewOnly}
                  />
                </td>

                <td></td>
                <td></td>
                <td></td>

                {!isViewOnly && <td></td>}

              </tr>

            </tbody>

          </table>

        </div>

        {/* INSTRUCTION + OBSERVATION */}

        <div className="washing-instruction-section">

          <p className="washing-instruction-text">
            Unload the crude mass. Check the crude mass for
            acid value, pH, GC purity and remaining
            parameters.
          </p>

          <div className="washing-observation-row">

            <div className="washing-inline-field">

              <label htmlFor="productPurity">
                Product Purity
              </label>

              <input
                id="productPurity"
                type="text"
                value={productPurity}
                onChange={(event) =>
                  setProductPurity(event.target.value)
                }
                readOnly={isViewOnly}
              />

            </div>

            <div className="washing-inline-field">

              <label htmlFor="rmContent">
                RM Content
              </label>

              <input
                id="rmContent"
                type="text"
                value={rmContent}
                onChange={(event) =>
                  setRmContent(event.target.value)
                }
                readOnly={isViewOnly}
              />

            </div>

            <div className="washing-inline-field">

              <label htmlFor="impurityProfile">
                Impurity Profile
              </label>

              <input
                id="impurityProfile"
                type="text"
                value={impurityProfile}
                onChange={(event) =>
                  setImpurityProfile(event.target.value)
                }
                readOnly={isViewOnly}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          OUTPUT DETAILS
      ================================================== */}

      <div className="washing-card">

        <div className="washing-card-title">
          Output Details
        </div>

        <div className="washing-output-grid">

          <div className="washing-output-header">
            Parameter
          </div>

          <div className="washing-output-header">
            Actual
          </div>

          <div className="washing-output-header">
            Standard
          </div>

          <div className="washing-output-label">
            Crude Qty
          </div>

          <div className="washing-output-input">
            <input
              type="text"
              value={crudeQty}
              onChange={(event) =>
                setCrudeQty(event.target.value)
              }
              placeholder="Enter crude qty"
              readOnly={isViewOnly}
            />
          </div>

          <div className="washing-output-input">
            <input
              type="text"
              value={stdQty}
              onChange={(event) =>
                setStdQty(event.target.value)
              }
              placeholder="Enter standard qty"
              readOnly={isViewOnly}
            />
          </div>

          <div className="washing-output-label">
            Crude Yield
          </div>

          <div className="washing-output-input">
            <input
              type="text"
              value={crudeYield}
              onChange={(event) =>
                setCrudeYield(event.target.value)
              }
              placeholder="Enter crude yield"
              readOnly={isViewOnly}
            />
          </div>

          <div className="washing-output-input">
            <input
              type="text"
              value={stdYield}
              onChange={(event) =>
                setStdYield(event.target.value)
              }
              placeholder="Enter standard yield"
              readOnly={isViewOnly}
            />
          </div>

          <div className="washing-output-label">
            Crude Purity
          </div>

          <div className="washing-output-input">
            <input
              type="text"
              value={crudePurity}
              onChange={(event) =>
                setCrudePurity(event.target.value)
              }
              placeholder="Enter crude purity"
              readOnly={isViewOnly}
            />
          </div>

          <div className="washing-output-input">
            <input
              type="text"
              value={stdPurity}
              onChange={(event) =>
                setStdPurity(event.target.value)
              }
              placeholder="Enter standard purity"
              readOnly={isViewOnly}
            />
          </div>

        </div>

      </div>

      {/* ==================================================
          DEVIATIONS / REMARKS
      ================================================== */}

      <div className="washing-card">

        <div className="washing-card-title">
          Deviations / Remarks
        </div>

        <div className="washing-form-grid">

          <div className="washing-form-group full-width">

            <textarea
              value={deviationsRemarks}
              onChange={(event) =>
                setDeviationsRemarks(
                  event.target.value
                )
              }
              placeholder="Enter deviations or remarks"
              rows={5}
              readOnly={isViewOnly}
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          CHECKED BY + APPROVED BY
      ================================================== */}

      <div className="washing-approval-grid">

        {/* ==================================================
            CHECKED BY
        ================================================== */}

        <div className="washing-card approval-card">

          <div className="washing-card-title">
            Checked By
          </div>

          <div className="washing-form-grid">

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

        <div className="washing-card approval-card">

          <div className="washing-card-title">
            Approved By
          </div>

          <p className="washing-approval-info">
            This section will be automatically populated
            after QA/QC completes the review.
          </p>

          <div className="washing-form-grid">

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

            <div className="washing-form-group">

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

      <div className="washing-bottom-actions">

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

      {showSubmitConfirmation && (

        <div
          className="submit-modal-overlay"
          onClick={handleCancelSubmit}
        >

          <div
            className="submit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="washing-submit-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="submit-modal-icon">
              !
            </div>

            <h2 id="washing-submit-title">
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

export default WashingForm;