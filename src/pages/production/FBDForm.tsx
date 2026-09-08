import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FBDForm.css";

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

interface FBDFormProps {
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

const FBDForm: React.FC<FBDFormProps> = ({
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
    // but still editable
    date: productionDetails?.date ?? "",

    // Automatically populated
    operator: productionDetails?.operatorName ?? "",
    operatorEmpId: productionDetails?.operatorEmpId ?? "",

    // Automatically populated
    formatNo: productionDetails?.formatNo ?? "",

    // Editable
    taPdFbd: "",

    // Automatic
    reactionLotNo: stageLots["REACTION"] ?? "",
    centrifugeLotNo: stageLots["CENTRIFUGE"] ?? "",
    fbdLotNo: lotNumber,

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
      activity: "Cleanliness of the FBD unit checked by:",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "FBD started by:",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "FBD completed by:",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "FBD sample given by:",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "FBD sample accepted by:",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Total time taken:",
      time: "",
      qty: "",
      operatorSign: "",
      qcQaSign: "",
      remarks: "",
    },
    {
      activity: "Total Dry cake Qty.:",
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
        stageId: "FBD",
        stageName: "FBD",
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
    console.log("FBD Form Submitted:", {
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
    <div className="fbd-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="fbd-header">

        <div>

          <h1>
            FBD Log Sheet
          </h1>

          <p>
            Complete the FBD stage details for this production.
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

      <div className="fbd-card">

        <div className="fbd-card-title">
          Product Information
        </div>

        <div className="fbd-form-grid">

          {/* PRODUCT NAME / CODE */}

          <div className="fbd-form-group">

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
                  : formData.productCode
              }
              readOnly
              className="fbd-readonly"
            />

          </div>


          {/* DATE */}

          <div className="fbd-form-group">

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

          <div className="fbd-form-group">

            <label>
              Format No.
            </label>

            <input
              type="text"
              value={formData.formatNo}
              readOnly
              disabled
              className="fbd-readonly"
              placeholder="Automatically populated"
            />

          </div>


          {/* TA / PD / FBD */}

          <div className="fbd-form-group">

            <label>
              TA/PD/FBD-
            </label>

            <input
              type="text"
              name="taPdFbd"
              value={formData.taPdFbd}
              onChange={handleChange}
              placeholder="Enter TA/PD/FBD-"
            />

          </div>


          {/* REACTION LOT */}

          <div className="fbd-form-group">

            <label>
              Reaction Lot No.
            </label>

            <input
              type="text"
              value={formData.reactionLotNo}
              readOnly
              className="fbd-readonly"
            />

          </div>


          {/* CENTRIFUGE LOT */}

          <div className="fbd-form-group">

            <label>
              Centrifuge Lot No.
            </label>

            <input
              type="text"
              value={formData.centrifugeLotNo}
              readOnly
              className="fbd-readonly"
            />

          </div>


          {/* FBD LOT */}

          <div className="fbd-form-group">

            <label>
              FBD Lot No.
            </label>

            <input
              type="text"
              value={formData.fbdLotNo}
              readOnly
              className="fbd-readonly"
            />

          </div>


          {/* QTY LOADED */}

          <div className="fbd-form-group">

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

          <div className="fbd-form-group">

            <label>
              Operator
            </label>

            <input
              type="text"
              value={
                formData.operator
                  ? `${formData.operator}${
                      formData.operatorEmpId
                        ? ` - ${formData.operatorEmpId}`
                        : ""
                    }`
                  : formData.operatorEmpId
              }
              readOnly
              disabled
              className="fbd-readonly"
              placeholder="Automatically populated"
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          ACTIVITY
      ================================================== */}

      <div className="fbd-card">

        <div className="fbd-card-title">
          Activity
        </div>

        <div className="fbd-table-wrapper">

          <table className="fbd-table">

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

                  <td className="fbd-serial-cell">
                    {index + 1}
                  </td>

                  <td className="fbd-activity-cell">
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

      <div className="fbd-card">

        <div className="fbd-card-title">
          Deviations/Remarks
        </div>

        <div className="fbd-form-grid">

          <div className="fbd-form-group full-width">

            <textarea
              name="deviationsRemarks"
              value={formData.deviationsRemarks}
              onChange={handleChange}
              rows={5}
            />

          </div>

        </div>

      </div>


      {/* ==================================================
          CHECKED BY / APPROVED BY
      ================================================== */}

      <div className="fbd-card">

        <div className="fbd-approval-grid">

          {/* ==================================================
              CHECKED BY
          ================================================== */}

          <div className="fbd-approval-section">

            <div className="fbd-approval-heading">
              Checked By
            </div>

            <div className="fbd-approval-row">

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

            <div className="fbd-approval-row">

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

            <div className="fbd-approval-row">

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

            <div className="fbd-approval-row">

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

            <div className="fbd-approval-row">

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

            <div className="fbd-approval-row">

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

          <div className="fbd-approval-section">

            <div className="fbd-approval-heading">
              Approved By
            </div>

            <p className="approval-info">
              This section will be automatically populated after
              QA/QC completes the review.
            </p>

            <div className="fbd-approval-row">

              <label>
                Quantity
              </label>

              <input
                type="text"
                value={formData.approvedQuantity}
                readOnly
                className="fbd-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="fbd-approval-row">

              <label>
                Yield %
              </label>

              <input
                type="text"
                value={formData.approvedYield}
                readOnly
                className="fbd-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="fbd-approval-row">

              <label>
                Purity
              </label>

              <input
                type="text"
                value={formData.approvedPurity}
                readOnly
                className="fbd-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="fbd-approval-row">

              <label>
                QA In Charge
              </label>

              <input
                type="text"
                value={formData.qaInCharge}
                readOnly
                className="fbd-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="fbd-approval-row">

              <label>
                Signature
              </label>

              <input
                type="text"
                value={formData.approvedSignature}
                readOnly
                className="fbd-readonly"
                placeholder="To be populated by QA/QC"
              />

            </div>

            <div className="fbd-approval-row">

              <label>
                Date
              </label>

              <input
                type="date"
                value={formData.approvedDate}
                readOnly
                className="fbd-readonly"
              />

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <div className="fbd-bottom-actions">

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
          SUBMIT CONFIRMATION POPUP
      ================================================== */}

      {showSubmitModal && (

        <div className="submit-modal-overlay">

          <div className="submit-modal">

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

export default FBDForm;