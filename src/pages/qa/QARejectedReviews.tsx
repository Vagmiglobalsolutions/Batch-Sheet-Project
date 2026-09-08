import "./QARejectedReviews.css";

interface RejectedReview {
  id: number;
  product: string;
  currentStage: string;
  currentStageLotNo: string;
  reviewedBy: string;
  rejectedDate: string;
  rejectionReason: string;
  status: "Rejected";
}

const QARejectedReviews = () => {
  const rejectedReviews: RejectedReview[] = [
    {
      id: 1,
      product: "Product L",
      currentStage: "Reaction",
      currentStageLotNo: "RL-000012",
      reviewedBy: "QA Analyst 01",
      rejectedDate: "06/09/2026 03:20 PM",
      rejectionReason:
        "Purity test did not meet the required specification.",
      status: "Rejected",
    },
    {
      id: 2,
      product: "Product M",
      currentStage: "Distillation",
      currentStageLotNo: "DL-000013",
      reviewedBy: "QA Analyst 02",
      rejectedDate: "06/09/2026 03:45 PM",
      rejectionReason:
        "Quality parameter was outside the specified limit.",
      status: "Rejected",
    },
  ];

  return (
    <div className="qa-rejected-page">

      <div className="qa-page-header">
        <div>
          <h1>Rejected Reviews</h1>
          <p>
            View production stages that have been rejected by QA/QC.
          </p>
        </div>
      </div>

      <div className="qa-content-card">

        <div className="qa-content-card-header">
          <div>
            <h2>Rejected QA/QC Reviews</h2>
            <p>
              Rejected production stages and their recorded rejection reasons.
            </p>
          </div>
        </div>

        <div className="qa-table-wrapper">

          {rejectedReviews.length === 0 ? (
            <div className="qa-empty-state">
              No rejected reviews available.
            </div>
          ) : (
            <table className="qa-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stage</th>
                  <th>Current Stage Lot No.</th>
                  <th>Reviewed By</th>
                  <th>Rejected Date</th>
                  <th>Rejection Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {rejectedReviews.map((review) => (
                  <tr key={review.id}>

                    <td>{review.product}</td>

                    <td>{review.currentStage}</td>

                    <td>{review.currentStageLotNo}</td>

                    <td>{review.reviewedBy}</td>

                    <td>{review.rejectedDate}</td>

                    <td className="qa-rejection-reason">
                      {review.rejectionReason}
                    </td>

                    <td>
                      <span className="qa-status-badge qa-status-rejected">
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

export default QARejectedReviews;