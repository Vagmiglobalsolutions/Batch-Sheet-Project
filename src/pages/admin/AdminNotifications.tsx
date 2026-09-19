import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNotifications.css";

type NotificationType = "FINAL_BATCH_READY" | "EDIT_REQUEST" | "QA_REJECTION" | "BATCH_UPDATED";
type NotificationStatus = "Unread" | "Read";

interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  productName: string;
  productCode: string;
  lotNumber: string;
  stage: string;
  date: string;
  time: string;
  status: NotificationStatus;
}

const initialNotifications: AdminNotification[] = [
  { id: "NOT-001", type: "FINAL_BATCH_READY", title: "Final Batch Sheet Ready", message: "Lot LOT-2026-0001 is ready for final Admin review and batch-sheet generation.", productName: "Product A", productCode: "PROD001", lotNumber: "LOT-2026-0001", stage: "FBD", date: "2026-09-18", time: "09:42 AM", status: "Unread" },
  { id: "NOT-002", type: "QA_REJECTION", title: "QA Rejection Submitted", message: "QA has rejected the Washing stage for lot LOT-2026-0002. Review the rejected stage.", productName: "Product B", productCode: "PROD002", lotNumber: "LOT-2026-0002", stage: "Washing", date: "2026-09-18", time: "09:18 AM", status: "Unread" },
  { id: "NOT-003", type: "EDIT_REQUEST", title: "Edit Request Received", message: "Production has requested edit access for a submitted stage of lot LOT-2026-0003.", productName: "Product C", productCode: "PROD003", lotNumber: "LOT-2026-0003", stage: "Distillation", date: "2026-09-18", time: "08:56 AM", status: "Unread" },
  { id: "NOT-004", type: "BATCH_UPDATED", title: "Batch Updated After Edit", message: "An approved edit has been completed and the updated stage has been resubmitted.", productName: "Product A", productCode: "PROD001", lotNumber: "LOT-2026-0004", stage: "Reaction", date: "2026-09-17", time: "05:36 PM", status: "Read" },
  { id: "NOT-005", type: "FINAL_BATCH_READY", title: "Final Batch Sheet Ready", message: "Lot LOT-2026-0005 has completed its selected stages and is ready for Admin.", productName: "Product D", productCode: "PROD004", lotNumber: "LOT-2026-0005", stage: "Centrifuge", date: "2026-09-17", time: "04:48 PM", status: "Read" },
  { id: "NOT-006", type: "QA_REJECTION", title: "QA Rejection Submitted", message: "QA has rejected the Packaging stage for lot LOT-2026-0006. Review the rejected record.", productName: "Product C", productCode: "PROD003", lotNumber: "LOT-2026-0006", stage: "Packaging", date: "2026-09-17", time: "03:27 PM", status: "Read" },
  { id: "NOT-007", type: "EDIT_REQUEST", title: "Edit Request Received", message: "Production has submitted an edit request for a locked Recovery stage.", productName: "Product B", productCode: "PROD002", lotNumber: "LOT-2026-0007", stage: "Recovery", date: "2026-09-17", time: "02:14 PM", status: "Read" },
  { id: "NOT-008", type: "BATCH_UPDATED", title: "Batch Updated After Edit", message: "The requested correction for the submitted batch has been completed and recorded.", productName: "Product D", productCode: "PROD004", lotNumber: "LOT-2026-0008", stage: "Blending", date: "2026-09-17", time: "12:52 PM", status: "Read" },
];

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"All" | "Unread" | "Read">("All");
  const [search, setSearch] = useState("");

  const unreadCount = useMemo(() => notifications.filter(n => n.status === "Unread").length, [notifications]);

  const filteredNotifications = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notifications.filter(n => {
      const matchesStatus = filter === "All" || n.status === filter;
      const text = [n.title, n.message, n.productName, n.productCode, n.lotNumber, n.stage].join(" ").toLowerCase();
      return matchesStatus && (!q || text.includes(q));
    });
  }, [notifications, filter, search]);

  const markAsRead = (id: string) => setNotifications(current => current.map(n => n.id === id ? { ...n, status: "Read" } : n));
  const markAllAsRead = () => setNotifications(current => current.map(n => ({ ...n, status: "Read" })));

  const openNotification = (n: AdminNotification) => {
    markAsRead(n.id);
    if (n.type === "QA_REJECTION") navigate("/admin/rejected-batch-sheets");
    else navigate("/admin/batch-sheets");
  };

  const notificationClass = (type: NotificationType) => {
    if (type === "QA_REJECTION") return "rejection";
    if (type === "EDIT_REQUEST") return "edit";
    if (type === "BATCH_UPDATED") return "updated";
    return "ready";
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="admin-notifications-page">
      <div className="admin-notifications-header">
        <div>
          <div className="admin-notifications-title-row">
            <h1>Notifications</h1>
            {unreadCount > 0 && <span className="admin-notifications-count-badge">{unreadCount} Unread</span>}
          </div>
          <p>Review Admin notifications and actions requiring attention.</p>
        </div>
        {unreadCount > 0 && <button type="button" className="admin-notifications-mark-all" onClick={markAllAsRead}>Mark All as Read</button>}
      </div>

      <section className="admin-notifications-filter-card">
        <div className="admin-notifications-filter-row">
          <div className="admin-notifications-search-field">
            <label htmlFor="admin-notification-search">Search</label>
            <input id="admin-notification-search" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lot number, product, stage..." />
          </div>
          <div className="admin-notifications-filter-field">
            <label htmlFor="admin-notification-status">Status</label>
            <select id="admin-notification-status" value={filter} onChange={e => setFilter(e.target.value as "All" | "Unread" | "Read")}>
              <option value="All">All Notifications</option><option value="Unread">Unread</option><option value="Read">Read</option>
            </select>
          </div>
          <div className="admin-notifications-filter-actions">
            {(["All", "Unread", "Read"] as const).map(value => <button key={value} type="button" className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value}</button>)}
          </div>
        </div>
      </section>

      <section className="admin-notifications-list-card">
        <div className="admin-notifications-list-header"><div><h2>Notification Center</h2><span>{filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}</span></div></div>
        <div className="admin-notifications-list">
          {filteredNotifications.length ? filteredNotifications.map(n => (
            <article key={n.id} className={`admin-notification-item ${n.status.toLowerCase()}`} onClick={() => openNotification(n)}>
              <div className={`admin-notification-icon ${notificationClass(n.type)}`} aria-hidden="true">{n.type === "QA_REJECTION" ? "!" : n.type === "EDIT_REQUEST" ? "E" : n.type === "BATCH_UPDATED" ? "✓" : "B"}</div>
              <div className="admin-notification-content">
                <div className="admin-notification-main">
                  <div className="admin-notification-title-row"><h3>{n.title}</h3>{n.status === "Unread" && <span className="admin-notification-unread-dot" />}</div>
                  <p>{n.message}</p>
                  <div className="admin-notification-meta">
                    <span><strong>Product:</strong> {n.productName} / {n.productCode}</span>
                    <span><strong>Lot:</strong> {n.lotNumber}</span>
                    <span><strong>Stage:</strong> {n.stage}</span>
                  </div>
                </div>
                <div className="admin-notification-side">
                  <span className="admin-notification-date">{formatDate(n.date)}</span><span className="admin-notification-time">{n.time}</span>
                  {n.status === "Unread" && <button type="button" className="admin-notification-read-button" onClick={e => { e.stopPropagation(); markAsRead(n.id); }}>Mark as Read</button>}
                </div>
              </div>
            </article>
          )) : <div className="admin-notifications-empty"><div className="admin-notifications-empty-icon">✓</div><h3>No notifications found</h3><p>There are no notifications matching the current filters.</p></div>}
        </div>
      </section>
    </div>
  );
};

export default AdminNotifications;