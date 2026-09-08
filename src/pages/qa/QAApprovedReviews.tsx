import "./QAApprovedReviews.css";

interface ApprovedReview {
  id: number;
  product: string;
  currentStage: string;
  currentStageLotNo: string;
  reviewedBy: string;
  approvedDate: string;
  status: "Approved";
}

const QAApprovedReviews = () => {
  const approvedReviews: ApprovedReview[] = [
    {
      id: 1,
      product: "Product A",
      currentStage: "Reaction",
      currentStageLotNo: "RL-000001",
      reviewedBy: "QA Analyst 01",
      approvedDate: "06/09/2026 01:10 PM",
      status: "Approved",
    },
    {
      id: 2,
      product: "Product C",
      currentStage: "Distillation",
      currentStageLotNo: "DL-000003",
      reviewedBy: "QA Analyst 01",
      approvedDate: "06/09/2026 02:05 PM",
      status: "Approved",
    },
  ];

  return (
    <div className="qa-approved-page">

      <div className="qa-page-header">
        <div>
          <h1>Approved Reviews</h1>
          <p>
            View production stages that have been approved by QA/QC.
          </p>
        </div>
      </div>

      <div className="qa-content-card">

        <div className="qa-content-card-header">
          <div>
            <h2>Approved QA/QC Reviews</h2>
            <p>
              Approved review records are available in view-only mode.
            </p>
          </div>
        </div>

        <div className="qa-table-wrapper">

          {approvedReviews.length === 0 ? (
            <div className="qa-empty-state">
              No approved reviews available.
            </div>
          ) : (
            <table className="qa-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stage</th>
                  <th>Current Stage Lot No.</th>
                  <th>Reviewed By</th>
                  <th>Approved Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {approvedReviews.map((review) => (
                  <tr key={review.id}>

                    <td>{review.product}</td>

                    <td>{review.currentStage}</td>

                    <td>{review.currentStageLotNo}</td>

                    <td>{review.reviewedBy}</td>

                    <td>{review.approvedDate}</td>

                    <td>
                      <span className="qa-status-badge qa-status-approved">
                        {review.status}
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

export default QAApprovedReviews;