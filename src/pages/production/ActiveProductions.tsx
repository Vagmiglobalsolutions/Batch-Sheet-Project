import "./ActiveProductions.css";

interface ActiveProduction {
  id: number;
  product: string;
  currentStage: string;
  currentStageLotNo: string;
  operator: string;
  status: "In Progress" | "Pending QA";
  lastUpdated: string;
}

const ActiveProductions = () => {
  const activeProductions: ActiveProduction[] = [
    {
      id: 1,
      product: "Product A",
      currentStage: "Reaction",
      currentStageLotNo: "RL-000001",
      operator: "Operator 01",
      status: "In Progress",
      lastUpdated: "06/09/2026 10:42 AM",
    },
    {
      id: 2,
      product: "Product B",
      currentStage: "Washing",
      currentStageLotNo: "WL-000002",
      operator: "Operator 02",
      status: "Pending QA",
      lastUpdated: "06/09/2026 11:18 AM",
    },
    {
      id: 3,
      product: "Product C",
      currentStage: "Distillation",
      currentStageLotNo: "DL-000003",
      operator: "Operator 03",
      status: "In Progress",
      lastUpdated: "06/09/2026 12:05 PM",
    },
  ];

  return (
    <div className="active-productions-page">
      <div className="page-header">
        <div>
          <h1>Active Productions</h1>
          <p>
            View currently active production activities and their stages.
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Active Production List</h2>
            <p>
              Current production activities and their latest status.
            </p>
          </div>
        </div>

        <div className="production-table-wrapper">
          {activeProductions.length === 0 ? (
            <div className="notification-empty">
              No active productions available.
            </div>
          ) : (
            <table className="production-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stage</th>
                  <th>Current Stage Lot No.</th>
                  <th>Operator</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>

              <tbody>
                {activeProductions.map((production) => (
                  <tr key={production.id}>
                    <td>{production.product}</td>

                    <td>{production.currentStage}</td>

                    <td>{production.currentStageLotNo}</td>

                    <td>{production.operator}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          production.status === "Pending QA"
                            ? "status-qa"
                            : "status-progress"
                        }`}
                      >
                        {production.status}
                      </span>
                    </td>

                    <td>{production.lastUpdated}</td>
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

export default ActiveProductions;