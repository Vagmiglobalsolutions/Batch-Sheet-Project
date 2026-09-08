import { useLocation, Navigate } from "react-router-dom";

import ReactionForm from "./ReactionForm";
import WashingForm from "./WashingForm";
import RecoveryForm from "./RecoveryForm";
import DistillationForm from "./DistillationForm";
import BlendingForm from "./BlendingForm";
import PackingForm from "./PackingForm";
import CentrifugeForm from "./CentrifugeForm";
import FBDForm from "./FBDForm";

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

interface StageFormLocationState {
  productionDetails: ProductionDetails | null;

  stageId: string;
  stageName: string;

  // Lot number generated for the currently selected stage
  lotNumber: string;

  // Indicates continuation through Next Stages
  fromNextStages?: boolean;

  /*
   * Complete lot-number history of the production.
   *
   * Example:
   *
   * {
   *   REACTION: "RL-2026-12345",
   *   DISTILLATION: "DL-2026-45678",
   *   CENTRIFUGE: "CF-2026-78901"
   * }
   */
  stageLots?: StageLots;
}

const StageForm = () => {
  const location = useLocation();

  const state =
    (location.state as StageFormLocationState | null) ?? null;

  /*
   * If somebody opens /production/stage-form directly
   * without selecting a stage first, send them back
   * to Stage Selection.
   */
  if (!state || !state.stageId || !state.lotNumber) {
    return (
      <Navigate
        to="/production/select-stage"
        replace
        state={{
          productionDetails:
            state?.productionDetails ?? null,

          fromNextStages:
            state?.fromNextStages === true,

          stageLots:
            state?.stageLots ?? {},
        }}
      />
    );
  }

  /*
   * Always keep a valid stageLots object available.
   *
   * This prevents individual forms from having to
   * repeatedly check whether stageLots exists.
   */
  const stageLots: StageLots = {
    ...(state.stageLots ?? {}),
  };

  /*
   * Common props passed to Production stage forms.
   *
   * Every form can access:
   *
   * - Production details
   * - Current stage
   * - Current stage lot number
   * - Complete stage lot history
   */
  const commonStageProps = {
    productionDetails: state.productionDetails,
    stageId: state.stageId,
    stageName: state.stageName,
    lotNumber: state.lotNumber,
    stageLots,
  };

  /*
   * Open the correct Production form
   * according to the selected stage.
   */
  switch (state.stageId) {
    case "REACTION":
      return <ReactionForm />;

    case "WASHING":
      return <WashingForm />;

    case "RECOVERY":
      return <RecoveryForm />;

    case "DISTILLATION":
      return <DistillationForm />;

    case "BLENDING":
      return <BlendingForm />;

    case "PACKAGING":
      return <PackingForm />;

    case "CENTRIFUGE":
      return (
        <CentrifugeForm
          {...commonStageProps}
        />
      );

    case "FBD":
      return (
        <FBDForm
          {...commonStageProps}
        />
      );

    default:
      return (
        <Navigate
          to="/production/select-stage"
          replace
        />
      );
  }
};

export default StageForm;