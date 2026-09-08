import "./ProductionNotifications.css";

interface NotificationItem {
  id: number;
  type: "APPROVED" | "HOLD" | "REJECTED";
  lotNumber: string;
  message: string;
  reason?: string;
  time: string;
  isNew: boolean;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    type: "APPROVED",
    lotNumber: "RL-000001",
    message:
      "QA/QC has approved this lot. It can move to the next production stage.",
    time: "10 minutes ago",
    isNew: true,
  },
  {
    id: 2,
    type: "HOLD",
    lotNumber: "RL-000002",
    message:
      "QA/QC has placed this lot on hold. Further action is required before proceeding.",
    time: "25 minutes ago",
    isNew: true,
  },
  {
    id: 3,
    type: "REJECTED",
    lotNumber: "RL-000003",
    message: "QA/QC has rejected this lot.",
    reason: "Purity test did not meet the required specification.",
    time: "1 hour ago",
    isNew: false,
  },
];

const getNotificationTitle = (
  type: NotificationItem["type"],
  lotNumber: string
) => {
  switch (type) {
    case "APPROVED":
      return `Lot ${lotNumber} Approved`;

    case "HOLD":
      return `Lot ${lotNumber} On Hold`;

    case "REJECTED":
      return `Lot ${lotNumber} Rejected`;

    default:
      return `Lot ${lotNumber}`;
  }
};

const ProductionNotifications = () => {
  return (
    <div className="production-notifications-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="notifications-page-header">
        <div>
          <h1>Notifications</h1>

          <p>
            QA/QC decisions and production updates.
          </p>
        </div>

        <div className="notification-count">
          {notifications.filter(
            (notification) => notification.isNew
          ).length}{" "}
          New
        </div>
      </div>


      {/* =========================================
          NOTIFICATION LIST
      ========================================= */}

      <div className="notifications-card">

        {notifications.map((notification) => (

          <div
            className={`notification-item notification-${notification.type.toLowerCase()}`}
            key={notification.id}
          >

            {/* -----------------------------------------
                ICON
            ----------------------------------------- */}

            <div className="notification-icon">

              {notification.type === "APPROVED" && "✓"}

              {notification.type === "HOLD" && "!"}

              {notification.type === "REJECTED" && "×"}

            </div>


            {/* -----------------------------------------
                CONTENT
            ----------------------------------------- */}

            <div className="notification-content">

              <div className="notification-title-row">

                <h2>
                  {getNotificationTitle(
                    notification.type,
                    notification.lotNumber
                  )}
                </h2>

                {notification.isNew && (
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
                  <strong>Reason:</strong>{" "}
                  {notification.reason}
                </p>
              )}


              <span className="notification-time">
                {notification.time}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ProductionNotifications;