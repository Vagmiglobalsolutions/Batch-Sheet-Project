import { useNavigate } from "react-router-dom";
import "./QAOnHoldReviews.css";

interface OnHoldReview {
  id: number;
  product: string;
  currentStage: string;
  currentStageLotNo: string;
  reviewedBy: string;
  holdDate: string;
  reason: string;
  status: "On Hold";
}

const QAOnHoldReviews = () => {
  const navigate = useNavigate();

  const onHoldReviews: OnHoldReview[] = [
    {
      id: 1,
      product: "Product J",
      currentStage: "Blending",
      currentStageLotNo: "BL-000010",
      reviewedBy: "QA Analyst 01",
      holdDate: "06/09/2026 02:25 PM",
      reason: "Additional quality verification required.",
      status: "On Hold",
    },
    {
      id: 2,
      product: "Product K",
      currentStage: "Centrifuge",
      currentStageLotNo: "CF-000011",
      reviewedBy: "QA Analyst 02",
      holdDate: "06/09/2026 03:05 PM",
      reason: "QC observation requires further review.",
      status: "On Hold",
    },
  ];

  const handleReview = (lotNumber: string) => {
    navigate(`/qa/review/${lotNumber}`);
  };

  return (
    <div className="qa-hold-page">

      <div className="qa-page-header">
        <div>
          <h1>On Hold Reviews</h1>
          <p>
            View production stages that are currently on hold.
          </p>
        </div>
      </div>

      <div className="qa-content-card">

        <div className="qa-content-card-header">
          <div>
            <h2>On Hold QA/QC Reviews</h2>
            <p>
              Production stages placed on hold pending further action.
            </p>
          </div>
        </div>

        <div className="qa-table-wrapper">

          {onHoldReviews.length === 0 ? (
            <div className="qa-empty-state">
              No production stages are currently on hold.
            </div>
          ) : (
            <table className="qa-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stage</th>
                  <th>Current Stage Lot No.</th>
                  <th>Reviewed By</th>
                  <th>Hold Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {onHoldReviews.map((review) => (
                  <tr key={review.id}>

                    <td>{review.product}</td>

                    <td>{review.currentStage}</td>

                    <td>{review.currentStageLotNo}</td>

                    <td>{review.reviewedBy}</td>

                    <td>{review.holdDate}</td>

                    <td className="qa-reason-cell">
                      {review.reason}
                    </td>

                    <td>
                      <span className="qa-status-badge qa-status-hold">
                        {review.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="qa-review-button"
                        onClick={() =>
                          handleReview(review.currentStageLotNo)
                        }
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

export default QAOnHoldReviews;