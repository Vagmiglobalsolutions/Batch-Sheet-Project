import "./QANotifications.css";

interface QANotificationItem {
  id: number;
  lotNumber: string;
  productName: string;
  processStage: string;
  message: string;
  time: string;
  isNew: boolean;
}

const notifications: QANotificationItem[] = [
  {
    id: 1,
    lotNumber: "RL-000001",
    productName: "PRD-002 - Product 2",
    processStage: "Reaction",
    message:
      "This lot has been submitted for QA/QC inspection and is ready for review.",
    time: "10 minutes ago",
    isNew: true,
  },
  {
    id: 2,
    lotNumber: "RL-000002",
    productName: "PRD-003 - Product 3",
    processStage: "Washing",
    message:
      "This lot has been submitted for QA/QC inspection and is ready for review.",
    time: "25 minutes ago",
    isNew: true,
  },
  {
    id: 3,
    lotNumber: "RL-000003",
    productName: "PRD-004 - Product 4",
    processStage: "Distillation",
    message:
      "This lot is awaiting QA/QC review.",
    time: "1 hour ago",
    isNew: false,
  },
];

const QANotifications = () => {
  return (
    <div className="qa-notifications-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="qa-notifications-page-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Production lots awaiting QA/QC review.
          </p>
        </div>

        <div className="qa-notification-count">
          {notifications.filter(
            (notification) => notification.isNew
          ).length}{" "}
          New
        </div>

      </div>


      {/* =========================================
          NOTIFICATION LIST
      ========================================= */}

      <div className="qa-notifications-card">

        {notifications.map((notification) => (

          <div
            className={`qa-notification-item ${
              notification.isNew ? "qa-notification-new-item" : ""
            }`}
            key={notification.id}
          >

            {/* -----------------------------------------
                ICON
            ----------------------------------------- */}

            <div className="qa-notification-icon">
              !
            </div>


            {/* -----------------------------------------
                CONTENT
            ----------------------------------------- */}

            <div className="qa-notification-content">

              <div className="qa-notification-title-row">

                <h2>
                  Lot {notification.lotNumber} Ready for QA/QC Review
                </h2>

                {notification.isNew && (
                  <span className="qa-notification-new">
                    New
                  </span>
                )}

              </div>


              <p className="qa-notification-message">
                {notification.message}
              </p>


              <div className="qa-notification-details">

                <span>
                  <strong>Product:</strong>{" "}
                  {notification.productName}
                </span>

                <span>
                  <strong>Stage:</strong>{" "}
                  {notification.processStage}
                </span>

              </div>


              <span className="qa-notification-time">
                {notification.time}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default QANotifications;