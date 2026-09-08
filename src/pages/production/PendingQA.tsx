import "./PendingQA.css";

interface PendingQAProduction {
  id: number;
  product: string;
  currentStage: string;
  currentStageLotNo: string;
  submittedDate: string;
  status: "Pending QA";
}

const PendingQA = () => {
  const pendingQA: PendingQAProduction[] = [
    {
      id: 1,
      product: "Product B",
      currentStage: "Washing",
      currentStageLotNo: "WL-000002",
      submittedDate: "06/09/2026 11:18 AM",
      status: "Pending QA",
    },
    {
      id: 2,
      product: "Product F",
      currentStage: "Reaction",
      currentStageLotNo: "RL-000006",
      submittedDate: "06/09/2026 12:20 PM",
      status: "Pending QA",
    },
  ];

  return (
    <div className="pending-qa-page">
      <div className="page-header">
        <div>
          <h1>Pending QA/QC</h1>
          <p>
            Production stages submitted and currently waiting for QA/QC review.
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Pending QA/QC Review</h2>
            <p>
              Production stages awaiting QA/QC decision.
            </p>
          </div>
        </div>

        <div className="production-table-wrapper">
          {pendingQA.length === 0 ? (
            <div className="notification-empty">
              No production stages are currently pending QA/QC.
            </div>
          ) : (
            <table className="production-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stage</th>
                  <th>Current Stage Lot No.</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {pendingQA.map((production) => (
                  <tr key={production.id}>
                    <td>{production.product}</td>

                    <td>{production.currentStage}</td>

                    <td>{production.currentStageLotNo}</td>

                    <td>{production.submittedDate}</td>

                    <td>
                      <span className="status-badge status-qa">
                        {production.status}
                      </span>
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

export default PendingQA;