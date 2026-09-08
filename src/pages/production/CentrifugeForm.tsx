import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CentrifugeForm.css";

interface ProductionDetails {
  productCode: string;
  productName: string;
  machineCode: string;
  operatorName: string;
  operatorEmpId: string;
  formatNo: string;
  date: string;
}

interface StageLots {
  [stageId: string]: string | undefined;
}

interface CentrifugeFormProps {
  productionDetails: ProductionDetails | null;
  stageId: string;
  stageName: string;
  lotNumber: string;
  stageLots?: StageLots;
}

interface ActivityRow {
  activity: string;
  time: string;
  qty: string;
  operatorSign: string;
  qcQaSign: string;
  remarks: string;
}

const CentrifugeForm: React.FC<CentrifugeFormProps> = ({
  productionDetails,
  lotNumber,
  stageLots = {},
}) => {
  const navigate = useNavigate();

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [formData, setFormData] = useState({
    /* ==================================================
       PRODUCT INFORMATION
    ================================================== */

    productName: productionDetails?.productName ?? "",
    productCode: productionDetails?.productCode ?? "",

    // Automatically taken from Start New Production
    date: productionDetails?.date ?? "",
    operator: productionDetails?.operatorName ?? "",
    operatorEmpId: productionDetails?.operatorEmpId ?? "",
    formatNo: productionDetails?.formatNo ?? "",

    // Editable
    taPdCf: "",

    // Automatic
    reactionLotNo: stageLots["REACTION"] ?? "",
    centrifugeLotNo: lotNumber,

    // Editable
    qtyLoaded: "",

    deviationsRemarks: "",

    /* ==================================================
       CHECKED BY
    ================================================== */

    checkedQuantity: "",
    checkedYield: "",
    checkedPurity: "",
    productionInCharge: "",
    checkedSignature: "",
    checkedDate: "",

    /* ==================================================
       APPROVED BY
    ================================================== */

    approvedQuantity: "",
    approvedYield: "",
    approvedPurity: "",
    qaInCharge: "",
    approvedSignature: "",
    approvedDate: "",
  });

  const [activities, setActivities] = useState<ActivityRow[]>([
    {
      activity: "Cleanliness of the Centrifuge unit checked by",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Centrifugation started by",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Centrifugation completed by",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Water wash given by",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Acid/Alkali wash given by",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Solvent wash given by",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Centrifuged sample given by",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Centrifuged sample accepted by",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Total time taken",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Total Wet cake Qty.",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
  ]);

  /* ==================================================
     HANDLE FORM CHANGE
  ================================================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==================================================
     HANDLE ACTIVITY CHANGE
  ================================================== */

  const handleActivityChange = (
    index: number,
    field: keyof ActivityRow,
    value: string
  ) => {
    setActivities((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  /* ==================================================
     BACK
  ================================================== */

  const handleBack = () => {
    navigate("/production/generate-lot", {
      state: {
        productionDetails,
        stageId: "CENTRIFUGE",
        stageName: "Centrifuge",
        fromNextStages: true,
        stageLots,
      },
    });
  };

  /* ==================================================
     SUBMIT
  ================================================== */

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    console.log("Centrifuge Form Submitted:", {
      formData,
      activities,
      stageLots,
    });

    setShowSubmitModal(false);

    navigate("/production");
  };

  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
  };

  return (
    <div className="centrifuge-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="centrifuge-header">

        <div>
          <h1>Centrifuge Log Sheet</h1>

          <p>
            Complete the Centrifuge stage details for this production.
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
          PRODUCT INFORMATION
      ================================================== */}

      <div className="centrifuge-card">

        <div className="centrifuge-card-title">
          Product Information
        </div>

        <div className="centrifuge-form-grid">

          {/* PRODUCT NAME / CODE */}

          <div className="centrifuge-form-group">

            <label>
              Name of the Product
            </label>

            <input
              type="text"
              value={
                formData.productName
                  ? `${formData.productName}${
                      formData.productCode
                        ? ` / ${formData.productCode}`
                        : ""
                    }`
                  : formData.productCode || "—"
              }
              readOnly
              className="centrifuge-readonly"
            />

          </div>


          {/* DATE */}

          <div className="centrifuge-form-group">

            <label>
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

          </div>


          {/* FORMAT NO. */}

          <div className="centrifuge-form-group">

            <label>
              Format No.
            </label>

            <input
              type="text"
              value={formData.formatNo}
              readOnly
              disabled
              className="centrifuge-readonly"
              placeholder="Automatically populated"
            />

          </div>


          {/* TA / PD / CF */}

          <div className="centrifuge-form-group">

            <label>
              TA/PD/CF-
            </label>

            <input
              type="text"
              name="taPdCf"
              value={formData.taPdCf}
              onChange={handleChange}
              placeholder="Enter TA/PD/CF-"
            />

          </div>


          {/* REACTION LOT NO. */}

          <div className="centrifuge-form-group">

            <label>
              Reaction Lot No.
            </label>

            <input
              type="text"
              value={formData.reactionLotNo}
              readOnly
              className="centrifuge-readonly"
              placeholder=""
            />

          </div>


          {/* CENTRIFUGE LOT NO. */}

          <div className="centrifuge-form-group">

            <label>
              Centrifuge Lot No.
            </label>

            <input
              type="text"
              value={formData.centrifugeLotNo}
              readOnly
              className="centrifuge-readonly"
            />

          </div>


          {/* QTY LOADED */}

          <div className="centrifuge-form-group">

            <label>
              Qty. in Kgs Loaded
            </label>

            <input
              type="text"
              name="qtyLoaded"
              value={formData.qtyLoaded}
              onChange={handleChange}
              placeholder="Enter quantity"
            />

          </div>


          {/* OPERATOR */}

          <div className="centrifuge-form-group">

            <label>
              Operator
            </label>

            <input
              type="text"
              value={`${formData.operator}${
                formData.operatorEmpId
                  ? ` - ${formData.operatorEmpId}`
                  : ""
              }`}
              readOnly
              disabled
              className="centrifuge-readonly"
              placeholder="Automatically populated"
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          ACTIVITY
      ================================================== */}

      <div className="centrifuge-card">

        <div className="centrifuge-card-title">
          Activity
        </div>

        <div className="centrifuge-table-wrapper">

          <table className="centrifuge-table">

            <thead>

              <tr>
                <th>No.</th>
                <th>Activity</th>
                <th>Time</th>
                <th>Qty</th>
                <th>Operator Sign</th>
                <th>QC/QA Sign</th>
                <th>Remarks</th>
              </tr>

            </thead>

            <tbody>

              {activities.map((row, index) => (

                <tr key={index}>

                  <td className="centrifuge-serial-cell">
                    {index + 1}
                  </td>

                  <td className="centrifuge-activity-cell">
                    {row.activity}
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.time}
                      onChange={(e) =>
                        handleActivityChange(
                          index,
                          "time",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.qty}
                      onChange={(e) =>
                        handleActivityChange(
                          index,
                          "qty",
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
                        handleActivityChange(
                          index,
                          "operatorSign",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.qcQaSign}
                      onChange={(e) =>
                        handleActivityChange(
                          index,
                          "qcQaSign",
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
                        handleActivityChange(
                          index,
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

      <div className="centrifuge-card">

        <div className="centrifuge-card-title">
          Deviations / Remarks
        </div>

        <div className="centrifuge-form-grid">

          <div className="centrifuge-form-group full-width">

            <textarea
              name="deviationsRemarks"
              value={formData.deviationsRemarks}
              onChange={handleChange}
              placeholder="Enter deviations or remarks"
              rows={5}
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          CHECKED BY / APPROVED BY
      ================================================== */}

      <div className="centrifuge-card">

        <div className="centrifuge-approval-grid">

          {/* ==================================================
              CHECKED BY
          ================================================== */}

          <div className="centrifuge-approval-section">

            <div className="centrifuge-approval-heading">
              Checked By
            </div>

            <div className="centrifuge-approval-row">

              <label>
                Quantity
              </label>

              <input
                type="text"
                name="checkedQuantity"
                value={formData.checkedQuantity}
                onChange={handleChange}
                placeholder="Enter quantity"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Yield %
              </label>

              <input
                type="text"
                name="checkedYield"
                value={formData.checkedYield}
                onChange={handleChange}
                placeholder="Enter yield %"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Purity
              </label>

              <input
                type="text"
                name="checkedPurity"
                value={formData.checkedPurity}
                onChange={handleChange}
                placeholder="Enter purity"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Production In Charge
              </label>

              <input
                type="text"
                name="productionInCharge"
                value={formData.productionInCharge}
                onChange={handleChange}
                placeholder="Enter name"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Signature
              </label>

              <input
                type="text"
                name="checkedSignature"
                value={formData.checkedSignature}
                onChange={handleChange}
                placeholder="Enter signature"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Date
              </label>

              <input
                type="date"
                name="checkedDate"
                value={formData.checkedDate}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* ==================================================
              APPROVED BY
          ================================================== */}

          <div className="centrifuge-approval-section">

            <div className="centrifuge-approval-heading">
              Approved By
            </div>

            <p className="approval-info">
              This section will be automatically populated after QA/QC completes the review.
            </p>

            <div className="centrifuge-approval-row">

              <label>
                Quantity
              </label>

              <input
                type="text"
                value={formData.approvedQuantity}
                readOnly
                className="centrifuge-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Yield %
              </label>

              <input
                type="text"
                value={formData.approvedYield}
                readOnly
                className="centrifuge-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Purity
              </label>

              <input
                type="text"
                value={formData.approvedPurity}
                readOnly
                className="centrifuge-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                QA In Charge
              </label>

              <input
                type="text"
                value={formData.qaInCharge}
                readOnly
                className="centrifuge-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Signature
              </label>

              <input
                type="text"
                value={formData.approvedSignature}
                readOnly
                className="centrifuge-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="centrifuge-approval-row">

              <label>
                Date
              </label>

              <input
                type="date"
                value={formData.approvedDate}
                readOnly
                className="centrifuge-readonly"
              />

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <div className="centrifuge-bottom-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={handleBack}
        >
          Back
        </button>

        <button
          type="button"
          className="review-submit-button"
          onClick={handleSubmitClick}
        >
          Review &amp; Submit
        </button>

      </div>


      {/* ==================================================
          CONFIRMATION POPUP
      ================================================== */}

      {showSubmitModal && (

        <div
          className="submit-modal-overlay"
          onClick={handleCancelSubmit}
        >

          <div
            className="submit-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="submit-modal-icon">
              !
            </div>

            <h2>
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

export default CentrifugeForm;