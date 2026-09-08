import "./ProductionDrafts.css";
import { useNavigate } from "react-router-dom";

interface ProductionDraft {
  id: number;
  product: string;
  currentStage: string;
  lotNumber: string;
  operator: string;
  lastUpdated: string;
}

const ProductionDrafts = () => {
  const navigate = useNavigate();

  const drafts: ProductionDraft[] = [
    {
      id: 1,
      product: "Product D",
      currentStage: "Reaction",
      lotNumber: "RL-000004",
      operator: "Operator 04",
      lastUpdated: "06/09/2026 09:35 AM",
    },
    {
      id: 2,
      product: "Product E",
      currentStage: "Distillation",
      lotNumber: "DL-000005",
      operator: "Operator 05",
      lastUpdated: "06/09/2026 10:15 AM",
    },
  ];

  const handleResume = (draft: ProductionDraft) => {
    navigate("/production/stage-form", {
      state: {
        productionDetails: {
          productCode: "",
          productName: draft.product,
          machineCode: "",
          operatorName: draft.operator,
          formatNo: "",
          date: "",
        },
        stageId: draft.currentStage.toUpperCase(),
        stageName: draft.currentStage,
        lotNumber: draft.lotNumber,
        fromDraft: true,
        draftId: draft.id,
      },
    });
  };

  return (
    <div className="production-drafts-page">
      <div className="page-header">
        <div>
          <h1>Drafts</h1>
          <p>
            View production activities that have been saved as drafts.
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Production Drafts</h2>
            <p>
              Draft production forms that can be continued later.
            </p>
          </div>
        </div>

        <div className="production-table-wrapper">
          {drafts.length === 0 ? (
            <div className="notification-empty">
              No production drafts available.
            </div>
          ) : (
            <table className="production-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stage</th>
                  <th>Lot No.</th>
                  <th>Operator</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {drafts.map((draft) => (
                  <tr key={draft.id}>
                    <td>{draft.product}</td>

                    <td>{draft.currentStage}</td>

                    <td>{draft.lotNumber}</td>

                    <td>{draft.operator}</td>

                    <td>{draft.lastUpdated}</td>

                    <td>
                      <button
                        type="button"
                        className="resume-button"
                        onClick={() => handleResume(draft)}
                      >
                        Resume
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionDrafts;