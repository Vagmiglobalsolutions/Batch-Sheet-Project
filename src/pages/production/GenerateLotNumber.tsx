import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./GenerateLotNumber.css";

interface ProductionDetails {
  productCode: string;
  productName: string;
  machineCode: string;
  operatorName: string;
  formatNo: string;
  date: string;
}

interface StageLots {
  [stageId: string]: string | undefined;
}

interface StageLocationState {
  productionDetails: ProductionDetails | null;

  stageId: string;
  stageName: string;

  /*
   * Indicates that Production reached this page
   * through the "Next Stages" workflow.
   */
  fromNextStages?: boolean;

  /*
   * Existing lot-number history.
   *
   * This is kept internally and passed to the next
   * stage, but is NOT displayed on this page.
   */
  stageLots?: StageLots;
}

const GenerateLotNumber = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [lotNumber, setLotNumber] = useState("");

  const state =
    (location.state as StageLocationState | null) ?? null;

  const productionDetails =
    state?.productionDetails ?? null;

  const stageId = state?.stageId ?? "";
  const stageName = state?.stageName ?? "";

  /*
   * Keep the complete lot-number history internally.
   *
   * It is NOT displayed on this page.
   * It will be passed to StageForm after generating
   * the current stage lot number.
   */
  const stageLots: StageLots = {
    ...(state?.stageLots ?? {}),
  };

  // --------------------------------------------------
  // GENERATE LOT NUMBER
  // --------------------------------------------------

  const generateLotNumber = () => {
    if (!stageId) {
      return;
    }

    const prefixMap: Record<string, string> = {
      REACTION: "RL",
      WASHING: "WL",
      RECOVERY: "RCV",
      DISTILLATION: "DL",
      BLENDING: "BL",
      PACKAGING: "PL",
      CENTRIFUGE: "CF",
      FBD: "FBD",
    };

    const prefix = prefixMap[stageId] ?? "LOT";

    const year = new Date().getFullYear();

    const randomNumber = Math.floor(
      10000 + Math.random() * 90000
    );

    const generatedLotNumber =
      `${prefix}-${year}-${randomNumber}`;

    setLotNumber(generatedLotNumber);
  };

  // --------------------------------------------------
  // START SELECTED STAGE
  // --------------------------------------------------

  const handleStartStage = () => {
    if (!lotNumber || !state) {
      return;
    }

    /*
     * Add the newly generated lot number to the
     * complete stage history.
     *
     * Example:
     *
     * Before:
     * {
     *   REACTION: "RL-2026-12345"
     * }
     *
     * After selecting Centrifuge:
     * {
     *   REACTION: "RL-2026-12345",
     *   CENTRIFUGE: "CF-2026-67890"
     * }
     */
    const updatedStageLots: StageLots = {
      ...stageLots,
      [stageId]: lotNumber,
    };

    navigate("/production/stage-form", {
      state: {
        productionDetails,

        stageId,
        stageName,

        // Current stage lot number
        lotNumber,

        // Complete lot-number history
        stageLots: updatedStageLots,

        // Continue-production information
        fromNextStages:
          state.fromNextStages === true,
      },
    });
  };

  // --------------------------------------------------
  // BACK
  // --------------------------------------------------

  const handleBack = () => {
    navigate("/production/select-stage", {
      state: {
        productionDetails,

        fromNextStages:
          state?.fromNextStages === true,

        /*
         * Preserve the complete stage history when
         * going back.
         */
        stageLots,
      },
    });
  };

  return (
    <div className="generate-lot-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="generate-lot-header">

        <div>
          <h1>Generate Lot Number</h1>

          <p>
            A new lot number will be generated for the
            selected production stage.
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

      <div className="lot-card">

        <div className="lot-section-title">
          Production Details
        </div>

        <div className="production-summary-grid">

          <div className="summary-item">

            <span>Product</span>

            <strong>
              {productionDetails?.productCode || "—"}

              {productionDetails?.productName
                ? ` - ${productionDetails.productName}`
                : ""}
            </strong>

          </div>


          <div className="summary-item">

            <span>Reactor Machine</span>

            <strong>
              {productionDetails?.machineCode || "—"}
            </strong>

          </div>


          <div className="summary-item">

            <span>Operator</span>

            <strong>
              {productionDetails?.operatorName || "—"}
            </strong>

          </div>


          <div className="summary-item">

            <span>Format No.</span>

            <strong>
              {productionDetails?.formatNo || "—"}
            </strong>

          </div>


          <div className="summary-item">

            <span>Date</span>

            <strong>
              {productionDetails?.date || "—"}
            </strong>

          </div>

        </div>

      </div>


      {/* ==================================================
          LOT GENERATION
      ================================================== */}

      <div className="lot-generation-card">

        <div className="selected-stage">

          <span className="selected-stage-label">
            Selected Stage
          </span>

          <h2>
            {stageName || "Stage Not Selected"}
          </h2>

        </div>


        {!lotNumber ? (

          <div className="lot-generation-area">

            <div className="lot-icon">
              #
            </div>

            <h3>
              Generate {stageName} Lot Number
            </h3>

            <p>
              A unique lot number will be created for
              this stage.
            </p>

            <button
              type="button"
              className="generate-lot-button"
              onClick={generateLotNumber}
              disabled={!stageId}
            >
              Generate Lot Number
            </button>

          </div>

        ) : (

          <div className="lot-generated-area">

            <div className="success-icon">
              ✓
            </div>

            <span className="generated-label">
              {stageName} Lot Number
            </span>

            <div className="lot-number">
              {lotNumber}
            </div>

            <p className="lot-success-message">
              Lot number generated successfully.
            </p>

            <button
              type="button"
              className="start-stage-button"
              onClick={handleStartStage}
            >
              Start {stageName} Stage
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default GenerateLotNumber;