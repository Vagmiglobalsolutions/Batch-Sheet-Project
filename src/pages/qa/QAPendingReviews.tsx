import { useNavigate } from "react-router-dom";
import "./QAPendingReviews.css";

interface PendingReview {
  id: number;
  product: string;
  currentStage: string;
  currentStageLotNo: string;
  submittedBy: string;
  submittedDate: string;
  status: "Pending QA";
}

const QAPendingReviews = () => {
  const navigate = useNavigate();

  const pendingReviews: PendingReview[] = [
    {
      id: 1,
      product: "Product B",
      currentStage: "Washing",
      currentStageLotNo: "WL-000002",
      submittedBy: "Operator 02",
      submittedDate: "06/09/2026 11:18 AM",
      status: "Pending QA",
    },
    {
      id: 2,
      product: "Product F",
      currentStage: "Reaction",
      currentStageLotNo: "RL-000006",
      submittedBy: "Operator 06",
      submittedDate: "06/09/2026 12:20 PM",
      status: "Pending QA",
    },
  ];

  const handleReview = (review: PendingReview) => {
    navigate(`/qa/review/${review.currentStageLotNo}`);
  };

  return (
    <div className="qa-pending-page">

      <div className="qa-page-header">
        <div>
          <h1>Pending Reviews</h1>
          <p>
            Production stages currently waiting for QA/QC review.
          </p>
        </div>
      </div>

      <div className="qa-content-card">

        <div className="qa-content-card-header">
          <div>
            <h2>Pending QA/QC Reviews</h2>
            <p>
              Review the submitted production stages and record the final QC decision.
            </p>
          </div>
        </div>

        <div className="qa-table-wrapper">

          {pendingReviews.length === 0 ? (
            <div className="qa-empty-state">
              No production stages are currently pending QA/QC review.
            </div>
          ) : (
            <table className="qa-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stage</th>
                  <th>Current Stage Lot No.</th>
                  <th>Submitted By</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {pendingReviews.map((review) => (
                  <tr key={review.id}>

                    <td>{review.product}</td>

                    <td>{review.currentStage}</td>

                    <td>{review.currentStageLotNo}</td>

                    <td>{review.submittedBy}</td>

                    <td>{review.submittedDate}</td>

                    <td>
                      <span className="qa-status-badge qa-status-pending">
                        {review.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="qa-review-button"
                        onClick={() => handleReview(review)}
                      >
                        Review
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

export default QAPendingReviews;