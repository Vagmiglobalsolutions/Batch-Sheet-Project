import "./CompletedProductions.css";

interface CompletedProduction {
  id: number;
  product: string;
  currentStage: string;
  currentStageLotNo: string;
  completedDate: string;
  status: "Completed";
}

const CompletedProductions = () => {
  const completedProductions: CompletedProduction[] = [
    {
      id: 1,
      product: "Product G",
      currentStage: "FBD",
      currentStageLotNo: "FBD-000007",
      completedDate: "05/09/2026 04:30 PM",
      status: "Completed",
    },
    {
      id: 2,
      product: "Product H",
      currentStage: "Packing",
      currentStageLotNo: "PL-000008",
      completedDate: "05/09/2026 06:15 PM",
      status: "Completed",
    },
    {
      id: 3,
      product: "Product I",
      currentStage: "Centrifuge",
      currentStageLotNo: "CF-000009",
      completedDate: "04/09/2026 03:45 PM",
      status: "Completed",
    },
  ];

  return (
    <div className="completed-productions-page">
      <div className="page-header">
        <div>
          <h1>Completed Productions</h1>
          <p>
            View completed production activities and submitted work.
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Production History</h2>
            <p>
              Completed production records are available in view-only mode.
            </p>
          </div>
        </div>

        <div className="production-table-wrapper">
          {completedProductions.length === 0 ? (
            <div className="notification-empty">
              No completed productions available.
            </div>
          ) : (
            <table className="production-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stage</th>
                  <th>Current Stage Lot No.</th>
                  <th>Completed Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {completedProductions.map((production) => (
                  <tr key={production.id}>
                    <td>{production.product}</td>

                    <td>{production.currentStage}</td>

                    <td>{production.currentStageLotNo}</td>

                    <td>{production.completedDate}</td>

                    <td>
                      <span className="status-badge status-progress">
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

export default CompletedProductions;