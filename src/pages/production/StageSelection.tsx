import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./StageSelection.css";

interface ProductionDetails {
  productCode: string;
  productName: string;
  machineCode: string;
  operatorName: string;
  operatorEmpId: string;
  formatNo: string;
  date: string;
}

interface Stage {
  id: string;
  name: string;
  description: string;
}

interface StageLots {
  [stageId: string]: string | undefined;
}

type StageStatus =
  | "LOCKED"
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "APPROVED"
  | "REJECTED";

interface StageStatusData {
  stageId: string;
  status: StageStatus;

  /*
   * These fields identify the exact production flow.
   *
   * Employee A and Employee B can work on the same product
   * without their stage approvals getting mixed.
   */
  employeeId?: string;
  productCode?: string;
  lotNumber?: string;
}

interface StageSelectionLocationState {
  productionDetails?: ProductionDetails | null;
  fromNextStages?: boolean;
  stageLots?: StageLots;

  /*
   * This will eventually come from the backend.
   *
   * The backend should calculate these statuses using:
   *
   * Employee ID + Product Code + Stage + Lot Number
   *
   * together with the Technical Team's configured
   * product-specific stage sequence.
   */
  stageStatuses?: StageStatusData[];

  /*
   * This value is only a frontend/backend-ready indication
   * that all configured stages have been completed and
   * approved by QA/QC.
   *
   * The backend must perform the final verification before
   * allowing final batch-sheet generation.
   */
  allStagesCompleted?: boolean;
}

const stages: Stage[] = [
  {
    id: "REACTION",
    name: "Reaction",
    description: "Start the reaction process.",
  },
  {
    id: "WASHING",
    name: "Washing",
    description: "Start the washing process.",
  },
  {
    id: "RECOVERY",
    name: "Recovery",
    description: "Start the recovery process.",
  },
  {
    id: "DISTILLATION",
    name: "Distillation",
    description: "Start the distillation process.",
  },
  {
    id: "BLENDING",
    name: "Blending",
    description: "Start the blending process.",
  },
  {
    id: "PACKAGING",
    name: "Packaging",
    description: "Start the packaging process.",
  },
  {
    id: "CENTRIFUGE",
    name: "Centrifuge",
    description: "Start the centrifuge process.",
  },
  {
    id: "FBD",
    name: "FBD",
    description: "Start the FBD process.",
  },
];

const StageSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showFinalBatchConfirmation, setShowFinalBatchConfirmation] =
    useState(false);

  const [isGeneratingFinalBatch, setIsGeneratingFinalBatch] =
    useState(false);

  const state =
    (location.state as StageSelectionLocationState | null) ?? null;

  const productionDetails = state?.productionDetails ?? null;

  const isContinuingProduction = state?.fromNextStages === true;

  const stageLots: StageLots = {
    ...(state?.stageLots ?? {}),
  };

  const stageStatuses = state?.stageStatuses ?? [];

  /*
   * ---------------------------------------------------------
   * STAGE STATUS
   * ---------------------------------------------------------
   *
   * Temporary frontend behavior:
   *
   * - Reaction is available.
   * - All other stages are locked.
   *
   * The real stage status will eventually come from
   * the backend.
   */
  const getStageStatus = (stageId: string): StageStatus => {
    const backendStage = stageStatuses.find(
      (stage) => stage.stageId === stageId
    );

    if (backendStage) {
      return backendStage.status;
    }

    if (stageId === "REACTION") {
      return "AVAILABLE";
    }

    return "LOCKED";
  };

  /*
   * Only AVAILABLE stages can be selected.
   *
   * APPROVED stages represent already completed stages
   * and should not be started again through normal
   * progression.
   */
  const isStageSelectable = (stageId: string): boolean => {
    return getStageStatus(stageId) === "AVAILABLE";
  };

  const handleStageSelect = (stage: Stage) => {
    /*
     * Frontend protection.
     *
     * The backend must perform the same validation when
     * the backend is connected.
     */
    if (!isStageSelectable(stage.id)) {
      return;
    }

    navigate("/production/generate-lot", {
      state: {
        productionDetails,
        stageId: stage.id,
        stageName: stage.name,
        fromNextStages: isContinuingProduction,
        stageLots,
        stageStatuses,
      },
    });
  };

  const getStatusLabel = (status: StageStatus): string => {
    switch (status) {
      case "AVAILABLE":
        return "Available";

      case "IN_PROGRESS":
        return "In Progress";

      case "APPROVED":
        return "Approved";

      case "REJECTED":
        return "Rejected";

      case "LOCKED":
      default:
        return "Locked";
    }
  };

  const getStatusClass = (status: StageStatus): string => {
    switch (status) {
      case "AVAILABLE":
        return "stage-status available";

      case "IN_PROGRESS":
        return "stage-status in-progress";

      case "APPROVED":
        return "stage-status approved";

      case "REJECTED":
        return "stage-status rejected";

      case "LOCKED":
      default:
        return "stage-status locked";
    }
  };

  const getStatusIcon = (status: StageStatus): string => {
    switch (status) {
      case "AVAILABLE":
        return "→";

      case "IN_PROGRESS":
        return "⏳";

      case "APPROVED":
        return "✓";

      case "REJECTED":
        return "✕";

      case "LOCKED":
      default:
        return "🔒";
    }
  };

  /*
   * ---------------------------------------------------------
   * FINAL BATCH SHEET
   * ---------------------------------------------------------
   *
   * For now this is controlled by the frontend state.
   *
   * Later the backend will determine this by checking:
   *
   * - Technical Team configured stages
   * - Required stages
   * - Completed stages
   * - QA/QC approvals
   *
   * IMPORTANT:
   * Generate Final Batch Sheet for Admin is NOT treated
   * as a normal production process stage.
   *
   * It is the final action after the production stages.
   */

  const hasExplicitCompletionStatus =
    typeof state?.allStagesCompleted === "boolean";

  const allStagesCompleted = hasExplicitCompletionStatus
    ? state?.allStagesCompleted === true
    : stageStatuses.length > 0 &&
      stageStatuses.every(
        (stageStatus) => stageStatus.status === "APPROVED"
      );

  /*
   * The final batch-sheet action can only be used after
   * all configured production stages are completed and
   * QA/QC approved.
   */
  const canGenerateFinalBatch = allStagesCompleted;

  const handleGenerateFinalBatchSheet = () => {
    if (!canGenerateFinalBatch || isGeneratingFinalBatch) {
      return;
    }

    setShowFinalBatchConfirmation(true);
  };

  const handleCancelFinalBatchConfirmation = () => {
    if (isGeneratingFinalBatch) {
      return;
    }

    setShowFinalBatchConfirmation(false);
  };

  const handleConfirmFinalBatchGeneration = async () => {
    if (!canGenerateFinalBatch) {
      return;
    }

    setIsGeneratingFinalBatch(true);

    /*
     * FRONTEND DEMO ONLY
     *
     * Later this will become the backend API request.
     *
     * Backend must:
     *
     * 1. Verify the selected product.
     * 2. Get the Technical Team configured stages.
     * 3. Verify every required/configured stage is completed.
     * 4. Verify every required/configured stage has QA approval.
     * 5. Verify the correct production flow and lot numbers.
     * 6. Generate the final Batch Number.
     * 7. Consolidate the complete batch history.
     * 8. Preserve repeated stages.
     * 9. Preserve optional-stage decisions.
     * 10. Make the final Batch Sheet available to Admin.
     * 11. Create the Admin "Final Batch Sheet Ready"
     *     notification.
     *
     * Production does NOT enter or create the Batch Number.
     */

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsGeneratingFinalBatch(false);
    setShowFinalBatchConfirmation(false);

    /*
     * Frontend demonstration:
     * return to Production Dashboard.
     */
    navigate("/production");
  };

  return (
    <div className="stage-selection-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="stage-selection-header">
        <div>
          <h1>Select Process Stage</h1>

          <p>
            Select the next available process stage for the selected product.
          </p>
        </div>

        <button
          type="button"
          className="stage-back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      {/* =========================
          PRODUCTION DETAILS
      ========================= */}

      {productionDetails && (
        <div className="production-summary-card">
          <div className="production-summary-title">
            Production Details
          </div>

          <div className="production-summary-grid">
            <div className="summary-item">
              <span>Product</span>

              <strong>
                {productionDetails.productCode} -{" "}
                {productionDetails.productName}
              </strong>
            </div>

            <div className="summary-item">
              <span>Reactor Machine</span>

              <strong>{productionDetails.machineCode}</strong>
            </div>

            <div className="summary-item">
              <span>Operator</span>

              <strong>{productionDetails.operatorName}</strong>
            </div>

            <div className="summary-item">
              <span>Format No.</span>

              <strong>{productionDetails.formatNo}</strong>
            </div>

            <div className="summary-item">
              <span>Date</span>

              <strong>{productionDetails.date}</strong>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          PROCESS STAGES
      ========================= */}

      <div className="stage-selection-card">
        <div className="stage-selection-card-title">
          Process Stages
        </div>

        <div className="stage-selection-info">
          Stages are enabled according to the product-specific workflow
          configured by the Technical Team. The next stage becomes available
          only after the previous stage for this production flow is approved
          by QA/QC.
        </div>

        <div className="stage-grid">
          {stages.map((stage) => {
            const status = getStageStatus(stage.id);
            const selectable = isStageSelectable(stage.id);

            return (
              <button
                key={stage.id}
                type="button"
                className={`stage-card ${
                  selectable ? "selectable" : "disabled"
                }`}
                onClick={() => handleStageSelect(stage)}
                disabled={!selectable}
              >
                {/* =========================
                    CARD TOP
                ========================= */}

                <div className="stage-card-top">
                  <div className="stage-card-number">
                    {stages.findIndex((item) => item.id === stage.id) + 1}
                  </div>

                  <div className={getStatusClass(status)}>
                    <span className="stage-status-icon">
                      {getStatusIcon(status)}
                    </span>

                    {getStatusLabel(status)}
                  </div>
                </div>

                {/* =========================
                    CARD CONTENT
                ========================= */}

                <div className="stage-card-content">
                  <h3>{stage.name}</h3>

                  <p>{stage.description}</p>
                </div>

                {/* =========================
                    CARD ACTION
                ========================= */}

                {status === "AVAILABLE" && (
                  <div className="stage-card-action">
                    Start Stage →
                  </div>
                )}

                {status === "LOCKED" && (
                  <div className="stage-card-action locked-action">
                    This Stage unlocks after previous stage is Approved.
                  </div>
                )}

                {status === "IN_PROGRESS" && (
                  <div className="stage-card-action">
                    Stage in progress
                  </div>
                )}

                {status === "APPROVED" && (
                  <div className="stage-card-action">
                    Stage completed
                  </div>
                )}

                {status === "REJECTED" && (
                  <div className="stage-card-action">
                    Stage rejected
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* =========================
            FINAL BATCH SHEET FOR ADMIN
        ========================= */}

        <div
          className={`final-batch-section ${
            allStagesCompleted
              ? "final-batch-available"
              : "final-batch-locked"
          }`}
        >
          <div className="final-batch-icon">
            {allStagesCompleted ? "✓" : "🔒"}
          </div>

          <div className="final-batch-content">
            <h2>Generate Final Batch Sheet for Admin</h2>

            {allStagesCompleted ? (
              <>
                <p>
                  All configured production stages have been completed and
                  approved by QA/QC.
                </p>

                <p className="final-batch-note">
                  Generate the Final Batch Sheet to complete this production
                  process and make the completed batch sheet available to
                  Admin.
                </p>

                <button
                  type="button"
                  className="generate-final-batch-button"
                  onClick={handleGenerateFinalBatchSheet}
                  disabled={isGeneratingFinalBatch}
                >
                  {isGeneratingFinalBatch
                    ? "Generating Final Batch Sheet..."
                    : "Generate Final Batch Sheet for Admin"}
                </button>
              </>
            ) : (
              <>
                <p>
                  This final action will become available after all configured
                  production stages are completed and approved by QA/QC.
                </p>

                <p className="final-batch-note">
                  The Final Batch Sheet cannot be generated while any required
                  stage is still pending.
                </p>

                <button
                  type="button"
                  className="generate-final-batch-button locked"
                  disabled
                >
                  Locked — Complete All Stages First
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          FINAL BATCH CONFIRMATION
      ========================= */}

      {showFinalBatchConfirmation && (
        <div className="stage-confirmation-overlay">
          <div className="stage-confirmation-modal">
            <h2>Generate Final Batch Sheet for Admin</h2>

            <p>
              All configured production stages have been completed and
              approved by QA/QC.
            </p>

            <p className="stage-confirmation-warning">
              Once the Final Batch Sheet is generated, this production
              process cannot be edited through normal stage progression.
            </p>

            <div className="stage-confirmation-actions">
              <button
                type="button"
                className="stage-confirmation-cancel"
                onClick={handleCancelFinalBatchConfirmation}
                disabled={isGeneratingFinalBatch}
              >
                Cancel
              </button>

              <button
                type="button"
                className="stage-confirmation-submit"
                onClick={handleConfirmFinalBatchGeneration}
                disabled={isGeneratingFinalBatch}
              >
                {isGeneratingFinalBatch ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageSelection;