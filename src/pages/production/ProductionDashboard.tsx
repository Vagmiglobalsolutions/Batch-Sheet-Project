import "./ProductionDashboard.css";
import { useNavigate } from "react-router-dom";

type NotificationType = "APPROVED" | "HOLD" | "REJECTED";

interface ProductionNotification {
  id: number;
  lotNumber: string;
  type: NotificationType;
  title: string;
  message: string;
  reason?: string;
  time: string;
  read: boolean;
}

const ProductionDashboard = () => {
  const navigate = useNavigate();

  /*
   * Temporary frontend notifications.
   *
   * Later these will come from Firestore through the backend.
   */
  const notifications: ProductionNotification[] = [
    {
      id: 1,
      lotNumber: "RL-000001",
      type: "APPROVED",
      title: "Lot RL-000001 Approved",
      message:
        "QA/QC has approved this lot. It can move to the next production stage.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      lotNumber: "RL-000002",
      type: "HOLD",
      title: "Lot RL-000002 On Hold",
      message:
        "QA/QC has placed this lot on hold. Further action is required before proceeding.",
      time: "25 minutes ago",
      read: false,
    },
    {
      id: 3,
      lotNumber: "RL-000003",
      type: "REJECTED",
      title: "Lot RL-000003 Rejected",
      message:
        "QA/QC has rejected this lot.",
      reason:
        "Purity test did not meet the required specification.",
      time: "1 hour ago",
      read: true,
    },
  ];

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="dashboard-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="page-header">

        <div>
          <h1>Production Dashboard</h1>

          <p>
            Manage production activities and batch sheet processes.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/production/start")}
        >
          + Start New Production
        </button>

      </div>


      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <span className="stat-label">
            Active Productions
          </span>

          <strong className="stat-value">
            04
          </strong>
        </div>


        <div className="stat-card">
          <span className="stat-label">
            Drafts
          </span>

          <strong className="stat-value">
            02
          </strong>
        </div>


        <div className="stat-card">
          <span className="stat-label">
            Pending QA/QC
          </span>

          <strong className="stat-value">
            03
          </strong>
        </div>


        <div className="stat-card">
          <span className="stat-label">
            Completed Today
          </span>

          <strong className="stat-value">
            08
          </strong>
        </div>

      </div>


      {/* ==================================================
          NOTIFICATIONS
      ================================================== */}

      <div className="notification-section">

        <div className="notification-section-header">

          <div>
            <h2>
              Notifications
            </h2>

            <p>
              QA/QC decisions and production updates.
            </p>
          </div>

          {unreadNotifications > 0 && (
            <span className="notification-count">
              {unreadNotifications} New
            </span>
          )}

        </div>


        <div className="notification-list">

          {notifications.length === 0 ? (

            <div className="notification-empty">
              No notifications available.
            </div>

          ) : (

            notifications.map((notification) => (

              <div
                key={notification.id}
                className={`notification-item notification-${notification.type.toLowerCase()} ${
                  !notification.read
                    ? "notification-unread"
                    : ""
                }`}
              >

                <div className="notification-indicator">
                  {notification.type === "APPROVED" && "✓"}

                  {notification.type === "HOLD" && "!"}

                  {notification.type === "REJECTED" && "×"}
                </div>


                <div className="notification-content">

                  <div className="notification-title-row">

                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="notification-new">
                        New
                      </span>
                    )}

                  </div>


                  <p className="notification-message">
                    {notification.message}
                  </p>


                  {notification.reason && (
                    <p className="notification-reason">
                      <strong>
                        Reason:
                      </strong>{" "}
                      {notification.reason}
                    </p>
                  )}


                  <span className="notification-time">
                    {notification.time}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>


      {/* ==================================================
          ACTIVE PRODUCTIONS
      ================================================== */}

      <div className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>
              Active Productions
            </h2>

            <p>
              Current production activities and their stages.
            </p>
          </div>

        </div>


        <div className="production-table-wrapper">

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

              <tr>
                <td>Product A</td>
                <td>Reaction</td>
                <td>RL-000001</td>
                <td>Operator 01</td>

                <td>
                  <span className="status-badge status-progress">
                    In Progress
                  </span>
                </td>

                <td>
                  06/09/2026 10:42 AM
                </td>
              </tr>


              <tr>
                <td>Product B</td>
                <td>Washing</td>
                <td>WL-000002</td>
                <td>Operator 02</td>

                <td>
                  <span className="status-badge status-qa">
                    Pending QA
                  </span>
                </td>

                <td>
                  06/09/2026 11:18 AM
                </td>
              </tr>


              <tr>
                <td>Product C</td>
                <td>Distillation</td>
                <td>DL-000003</td>
                <td>Operator 03</td>

                <td>
                  <span className="status-badge status-progress">
                    In Progress
                  </span>
                </td>

                <td>
                  06/09/2026 12:05 PM
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ProductionDashboard;