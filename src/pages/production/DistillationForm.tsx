import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DistillationForm.css";

interface ProductionDetails {
  productCode: string;
  productName: string;
  machineCode?: string;
  operatorName: string;
  operatorEmpId?: string;
  formatNo: string;
  date: string;
  pageNo?: string;
  reactionLotNo?: string;
}

interface ActivityRow {
  id: number;
  activity: string;
  time: string;
  quantity: string;
  operatorSign: string;
  remarks: string;
}

interface TemperatureRow {
  id: number;
  time: string;
  vacuum: string;
  bt: string;
  vt: string;
  remarks: string;
}

interface InputOutputRow {
  id: number;
  inputName: string;
  inputTime: string;
  inputQty: string;
  outputName: string;
  outputTime: string;
  outputQty: string;
}

interface SecondActivityRow {
  id: number;
  activity: string;
  time: string;
  temp: string;
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

interface DistillationLocationState {
  productionDetails: ProductionDetails | null;
  stageId: string;
  stageName: string;
  lotNumber: string;
  reactionLotNumber?: string;
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

/* ==================================================
   FIRST ACTIVITY TABLE
================================================== */

const initialActivities: ActivityRow[] = [
  {
    id: 1,
    activity: "Cleanliness of the distillation unit checked by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 2,
    activity: "Crude charging started by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 3,
    activity: "Crude charging completed by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 4,
    activity: "Rejected fraction charged by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 5,
    activity: "Sample drawn by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 6,
    activity: "CTW circulation given by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 7,
    activity: "Steam/ hot oil given by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 8,
    activity: "WJE vacuum given by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 9,
    activity: "Steam Jet/ High vacuum given by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 10,
    activity: "Tops separation started by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 11,
    activity: "Inside/ Outside sample given by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
  {
    id: 12,
    activity: "MF collection started by:",
    time: "",
    quantity: "",
    operatorSign: "",
    remarks: "",
  },
];

/* ==================================================
   TEMPERATURE / VACUUM TABLE
================================================== */

const initialTemperatureRows: TemperatureRow[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    time: "",
    vacuum: "",
    bt: "",
    vt: "",
    remarks: "",
  })
);

/* ==================================================
   SECOND ACTIVITY TABLE
================================================== */

const initialSecondActivities: SecondActivityRow[] = [
  {
    id: 1,
    activity: "Once the flow stops, cut off steam.",
    time: "",
    temp: "",
    remarks: "",
  },
  {
    id: 2,
    activity: "Drain the residue at required temperature.",
    time: "",
    temp: "",
    remarks: "",
  },
  {
    id: 3,
    activity: "Residue Qty –              Kgs.",
    time: "",
    temp: "",
    remarks: "",
  },
];

/* ==================================================
   INPUT / OUTPUT
================================================== */

const initialInputOutputRows: InputOutputRow[] = [
  {
    id: 1,
    inputName: "Crude",
    inputTime: "",
    inputQty: "",
    outputName: "Distillation started at",
    outputTime: "",
    outputQty: "",
  },
  {
    id: 2,
    inputName: "Tops",
    inputTime: "",
    inputQty: "",
    outputName: "Tops",
    outputTime: "",
    outputQty: "",
  },
  {
    id: 3,
    inputName: "Rejected fractions",
    inputTime: "",
    inputQty: "",
    outputName: "Main Fractions",
    outputTime: "",
    outputQty: "",
  },
  {
    id: 4,
    inputName: "",
    inputTime: "",
    inputQty: "",
    outputName: "Last Fractions",
    outputTime: "",
    outputQty: "",
  },
  {
    id: 5,
    inputName: "",
    inputTime: "",
    inputQty: "",
    outputName: "Residue",
    outputTime: "",
    outputQty: "",
  },
  {
    id: 6,
    inputName: "",
    inputTime: "",
    inputQty: "",
    outputName: "Distillation completed at",
    outputTime: "",
    outputQty: "",
  },
  {
    id: 7,
    inputName: "",
    inputTime: "",
    inputQty: "",
    outputName: "Distillation Loss",
    outputTime: "",
    outputQty: "",
  },
];

const DistillationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    (location.state as DistillationLocationState | null) ?? null;

  const productionDetails = state?.productionDetails;
  const lotNumber = state?.lotNumber ?? "";

  const reactionLotNumber =
    state?.reactionLotNumber ??
    productionDetails?.reactionLotNo ??
    "";

  /* ==================================================
     HEADER DETAILS
  ================================================== */

  const formatNo = productionDetails?.formatNo || "";

  const [prodCode] = useState(
    productionDetails?.productCode || ""
  );

  const [productName] = useState(
    productionDetails?.productName || ""
  );

  const [headerDate, setHeaderDate] = useState(
    productionDetails?.date || ""
  );

  const [taPdD, setTaPdD] = useState("");

  const [distillationLotNo] = useState(lotNumber);

  const [qtyKg, setQtyKg] = useState("");

  const operatorName =
    productionDetails?.operatorName || "";

  const operatorEmpId =
    productionDetails?.operatorEmpId || "";

  /* ==================================================
     SUBMIT POPUP
  ================================================== */

  const [showSubmitConfirmation, setShowSubmitConfirmation] =
    useState(false);

  /* ==================================================
     TABLE STATES
  ================================================== */

  const [activities, setActivities] =
    useState<ActivityRow[]>(initialActivities);

  const [temperatureRows, setTemperatureRows] =
    useState<TemperatureRow[]>(initialTemperatureRows);

  const [secondActivities, setSecondActivities] =
    useState<SecondActivityRow[]>(initialSecondActivities);

  const [inputOutputRows, setInputOutputRows] =
    useState<InputOutputRow[]>(initialInputOutputRows);

  /* ==================================================
     TOTALS
  ================================================== */

  const [totalGcOkMf, setTotalGcOkMf] = useState("");
  const [totalGcRejMf, setTotalGcRejMf] = useState("");
  const [odorRefFractions, setOdorRefFractions] =
    useState("");
  const [totalOutput, setTotalOutput] = useState("");

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
     UPDATE FUNCTIONS
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

  const updateTemperatureRow = (
    id: number,
    field: keyof Omit<TemperatureRow, "id">,
    value: string
  ) => {
    setTemperatureRows((current) =>
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

  const updateSecondActivity = (
    id: number,
    field: keyof Omit<SecondActivityRow, "id">,
    value: string
  ) => {
    setSecondActivities((current) =>
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

  const updateInputOutput = (
    id: number,
    field: keyof Omit<InputOutputRow, "id">,
    value: string
  ) => {
    setInputOutputRows((current) =>
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
     INVALID STATE
  ================================================== */

  if (!state || !state.stageId || !state.lotNumber) {
    return (
      <div className="distillation-page">
        <div className="distillation-card invalid-session-card">
          <h2>Invalid Distillation Session</h2>

          <p>
            Please select Distillation from Stage Selection
            before opening this form.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate("/production/select-stage", {
                replace: true,
              })
            }
          >
            Go to Stage Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="distillation-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="distillation-header">
        <div>
          <h1>Distillation Log Sheet</h1>

          <p>
            Complete the Distillation stage details for
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
          PRODUCTION DETAILS
      ================================================== */}

      <div className="distillation-card production-details-card">

        <div className="production-details-title">
          Distillation Details
        </div>

        <div className="production-details-grid">

          <div className="production-detail-item">
            <label>Product Name / Code</label>

            <div className="production-detail-value">
              {productName || "—"}

              {prodCode && (
                <span className="product-code">
                  {" "} / {prodCode}
                </span>
              )}
            </div>
          </div>

          <div className="production-detail-item">
            <label>Distillation Lot No.</label>

            <div className="production-detail-value lot-number">
              {distillationLotNo || "—"}
            </div>
          </div>

          <div className="production-detail-item">
            <label>Reaction Lot No.</label>

            <div className="production-detail-value lot-number">
              {reactionLotNumber || "—"}
            </div>
          </div>

          {/* ==================================================
              OPERATOR - AUTOMATIC
          ================================================== */}

          <div className="production-detail-item">
            <label>Operator Name</label>

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

          {/* ==================================================
              FORMAT NO. - AUTOMATIC
          ================================================== */}

          <div className="production-detail-item">
            <label>Format No.</label>

            <input
              type="text"
              value={formatNo}
              readOnly
              disabled
              placeholder="Automatically populated"
            />
          </div>

          {/* ==================================================
              DATE - EDITABLE
          ================================================== */}

          <div className="production-detail-item">
            <label>Date</label>

            <input
              type="date"
              value={headerDate}
              onChange={(event) =>
                setHeaderDate(event.target.value)
              }
            />
          </div>

          {/* ==================================================
              TA/PD/D- - EDITABLE
          ================================================== */}

          <div className="production-detail-item">
            <label>TA/PD/D-</label>

            <input
              type="text"
              value={taPdD}
              onChange={(event) =>
                setTaPdD(event.target.value)
              }
              placeholder="Enter TA/PD/D-"
            />
          </div>

          {/* ==================================================
              QUANTITY IN KGS - EDITABLE
          ================================================== */}

          <div className="production-detail-item">
            <label>Quantity in Kgs</label>

            <input
              type="number"
              min="0"
              step="any"
              value={qtyKg}
              onChange={(event) =>
                setQtyKg(event.target.value)
              }
              placeholder="Enter quantity"
            />
          </div>

        </div>

      </div>

      {/* ==================================================
          FIRST ACTIVITY TABLE
      ================================================== */}

      <div className="distillation-card table-card">

        <div className="form-section-title">
          Process Activity
        </div>

        <div className="distillation-table-wrapper">

          <table className="distillation-table activity-table">

            <colgroup>
              <col className="activity-sl-col" />
              <col className="activity-name-col" />
              <col className="activity-time-col" />
              <col className="activity-qty-col" />
              <col className="activity-sign-col" />
              <col className="activity-remarks-col" />
            </colgroup>

            <thead>
              <tr>
                <th>SL NO</th>
                <th>Activity</th>
                <th>TIME</th>
                <th>QUANTITY</th>
                <th>Operator Sign</th>
                <th>Remarks</th>
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
                      inputMode="decimal"
                      value={row.quantity}
                      onChange={(e) =>
                        updateActivity(
                          row.id,
                          "quantity",
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
          TEMPERATURE / VACUUM
      ================================================== */}

      <div className="distillation-card table-card">

        <div className="form-section-title">
          Temperature / Vacuum Monitoring
        </div>

        <div className="distillation-table-wrapper">

          <table className="distillation-table temperature-table">

            <colgroup>
              <col className="temperature-sl-col" />
              <col className="temperature-time-col" />
              <col className="temperature-vacuum-col" />
              <col className="temperature-bt-col" />
              <col className="temperature-vt-col" />
              <col className="temperature-remarks-col" />
            </colgroup>

            <thead>

              <tr>

                <th rowSpan={2}>
                  SI. No.
                </th>

                <th rowSpan={2}>
                  TIME
                </th>

                <th colSpan={3}>
                  TEMP °C
                </th>

                <th rowSpan={2}>
                  REMARKS
                </th>

              </tr>

              <tr>

                <th>VACUUM</th>

                <th>B.T.</th>

                <th>V.T.</th>

              </tr>

            </thead>

            <tbody>

              {temperatureRows.map((row, index) => (

                <tr key={row.id}>

                  <td className="serial-cell">
                    {index + 1}
                  </td>

                  <td>
                    <input
                      type="time"
                      value={row.time}
                      onChange={(e) =>
                        updateTemperatureRow(
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
                      value={row.vacuum}
                      onChange={(e) =>
                        updateTemperatureRow(
                          row.id,
                          "vacuum",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.bt}
                      onChange={(e) =>
                        updateTemperatureRow(
                          row.id,
                          "bt",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.vt}
                      onChange={(e) =>
                        updateTemperatureRow(
                          row.id,
                          "vt",
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
                        updateTemperatureRow(
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
          FINAL PROCESS ACTIVITIES
      ================================================== */}

      <div className="distillation-card table-card">

        <div className="form-section-title">
          Final Process Activities
        </div>

        <div className="distillation-table-wrapper">

          <table className="distillation-table second-activity-table">

            <colgroup>
              <col className="second-sl-col" />
              <col className="second-activity-col" />
              <col className="second-time-col" />
              <col className="second-temp-col" />
              <col className="second-remarks-col" />
            </colgroup>

            <thead>

              <tr>

                <th>SI. No.</th>

                <th>Activity</th>

                <th>TIME</th>

                <th>TEMP</th>

                <th>REMARKS</th>

              </tr>

            </thead>

            <tbody>

              {secondActivities.map((row, index) => (

                <tr key={row.id}>

                  <td className="serial-cell">
                    {index + 1}
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.activity}
                      onChange={(e) =>
                        updateSecondActivity(
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
                        updateSecondActivity(
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
                      value={row.temp}
                      onChange={(e) =>
                        updateSecondActivity(
                          row.id,
                          "temp",
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
                        updateSecondActivity(
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
          INPUT / OUTPUT
      ================================================== */}

      <div className="distillation-card table-card">

        <div className="form-section-title">
          Input / Output
        </div>

        <div className="distillation-table-wrapper">

          <table className="distillation-table io-table">

            <colgroup>
              <col className="io-material-col" />
              <col className="io-time-col" />
              <col className="io-qty-col" />

              <col className="io-material-col" />
              <col className="io-time-col" />
              <col className="io-qty-col" />
            </colgroup>

            <thead>

              <tr>

                <th colSpan={3}>
                  INPUT
                </th>

                <th colSpan={3}>
                  OUTPUT
                </th>

              </tr>

              <tr>

                <th>Material</th>

                <th>TIME</th>

                <th>QTY (Kg)</th>

                <th>Material</th>

                <th>TIME</th>

                <th>QTY (Kg)</th>

              </tr>

            </thead>

            <tbody>

              {inputOutputRows.map((row) => (

                <tr key={row.id}>

                  <td>
                    <input
                      type="text"
                      value={row.inputName}
                      onChange={(e) =>
                        updateInputOutput(
                          row.id,
                          "inputName",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="time"
                      value={row.inputTime}
                      onChange={(e) =>
                        updateInputOutput(
                          row.id,
                          "inputTime",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row.inputQty}
                      onChange={(e) =>
                        updateInputOutput(
                          row.id,
                          "inputQty",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={row.outputName}
                      onChange={(e) =>
                        updateInputOutput(
                          row.id,
                          "outputName",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="time"
                      value={row.outputTime}
                      onChange={(e) =>
                        updateInputOutput(
                          row.id,
                          "outputTime",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row.outputQty}
                      onChange={(e) =>
                        updateInputOutput(
                          row.id,
                          "outputQty",
                          e.target.value
                        )
                      }
                    />
                  </td>

                </tr>

              ))}

              <tr className="io-total-row">

                <td className="total-label">
                  TOTAL (GC OK MF)
                </td>

                <td
                  colSpan={2}
                  className="total-value-cell"
                >
                  <input
                    type="text"
                    inputMode="decimal"
                    value={totalGcOkMf}
                    onChange={(e) =>
                      setTotalGcOkMf(e.target.value)
                    }
                  />
                </td>

                <td colSpan={3}></td>

              </tr>

              <tr className="io-total-row">

                <td className="total-label">
                  TOTAL (GC REJ MF)
                </td>

                <td
                  colSpan={2}
                  className="total-value-cell"
                >
                  <input
                    type="text"
                    inputMode="decimal"
                    value={totalGcRejMf}
                    onChange={(e) =>
                      setTotalGcRejMf(e.target.value)
                    }
                  />
                </td>

                <td className="total-label secondary-total-label">
                  TOTAL
                </td>

                <td
                  colSpan={2}
                  className="total-value-cell"
                >
                  <input
                    type="text"
                    inputMode="decimal"
                    value={totalOutput}
                    onChange={(e) =>
                      setTotalOutput(e.target.value)
                    }
                  />
                </td>

              </tr>

              <tr className="io-total-row">

                <td className="total-label">
                  ODOR REF FRACTIONS
                </td>

                <td
                  colSpan={2}
                  className="total-value-cell"
                >
                  <input
                    type="text"
                    value={odorRefFractions}
                    onChange={(e) =>
                      setOdorRefFractions(
                        e.target.value
                      )
                    }
                  />
                </td>

                <td className="total-label secondary-total-label">
                  TOTAL
                </td>

                <td
                  colSpan={2}
                  className="total-value-cell"
                >
                  <input
                    type="text"
                    readOnly
                    value={totalOutput}
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

      <div className="distillation-card">

        <div className="form-section-title">
          Deviations / Remarks
        </div>

        <textarea
          className="distillation-large-textarea"
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
          CHECKED BY / APPROVED BY
      ================================================== */}

      <div className="distillation-card">

        <div className="approval-grid">

          {/* ==================================================
              CHECKED BY
          ================================================== */}

          <div className="approval-section">

            <div className="approval-title">
              Checked By
            </div>

            <div className="approval-fields">

              <div className="approval-row">
                <label htmlFor="checkedQuantity">
                  Quantity
                </label>

                <input
                  id="checkedQuantity"
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
                <label htmlFor="checkedYield">
                  Yield %
                </label>

                <input
                  id="checkedYield"
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
                <label htmlFor="checkedPurity">
                  Purity
                </label>

                <input
                  id="checkedPurity"
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
                <label htmlFor="productionInCharge">
                  Production In Charge
                </label>

                <input
                  id="productionInCharge"
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
                <label htmlFor="checkedSignature">
                  Signature
                </label>

                <input
                  id="checkedSignature"
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
                <label htmlFor="checkedDate">
                  Date
                </label>

                <input
                  id="checkedDate"
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

          </div>

          {/* ==================================================
              APPROVED BY
          ================================================== */}

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
                <label htmlFor="approvedQuantity">
                  Quantity
                </label>

                <input
                  id="approvedQuantity"
                  type="text"
                  value={approvedBy.quantity}
                  readOnly
                  disabled
                  placeholder="To be populated"
                />
              </div>

              <div className="approval-row">
                <label htmlFor="approvedYield">
                  Yield %
                </label>

                <input
                  id="approvedYield"
                  type="text"
                  value={approvedBy.yieldPercentage}
                  readOnly
                  disabled
                  placeholder="To be populated"
                />
              </div>

              <div className="approval-row">
                <label htmlFor="approvedPurity">
                  Purity
                </label>

                <input
                  id="approvedPurity"
                  type="text"
                  value={approvedBy.purity}
                  readOnly
                  disabled
                  placeholder="To be populated"
                />
              </div>

              <div className="approval-row">
                <label htmlFor="qaInCharge">
                  QA In Charge
                </label>

                <input
                  id="qaInCharge"
                  type="text"
                  value={approvedBy.qaInCharge}
                  readOnly
                  disabled
                  placeholder="To be populated"
                />
              </div>

              <div className="approval-row">
                <label htmlFor="approvedSignature">
                  Signature
                </label>

                <input
                  id="approvedSignature"
                  type="text"
                  value={approvedBy.signature}
                  readOnly
                  disabled
                  placeholder="To be populated"
                />
              </div>

              <div className="approval-row">
                <label htmlFor="approvedDate">
                  Date
                </label>

                <input
                  id="approvedDate"
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

      <div className="distillation-bottom-actions">

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
              Submit Distillation Sheet?
            </h2>

            <p>
              Are you sure you want to submit this
              Distillation sheet?
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

export default DistillationForm;