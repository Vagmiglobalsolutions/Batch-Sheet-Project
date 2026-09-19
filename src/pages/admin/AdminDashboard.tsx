import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Overview of the Digital Batch Sheet Management System.
          </p>
        </div>
      </div>

      <section className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <span className="admin-card-label">Total Employees</span>
          <strong className="admin-card-value">150</strong>
          <span className="admin-card-description">
            Employees registered in the system
          </span>
        </div>

        <div className="admin-dashboard-card">
          <span className="admin-card-label">Total Products</span>
          <strong className="admin-card-value">80</strong>
          <span className="admin-card-description">
            Products available in the Product Master
          </span>
        </div>

        <div className="admin-dashboard-card">
          <span className="admin-card-label">Batch Sheets Ready</span>
          <strong className="admin-card-value">08</strong>
          <span className="admin-card-description">
            Completed batches ready for Admin
          </span>
        </div>

        <div className="admin-dashboard-card">
          <span className="admin-card-label">Rejected Batch Sheets</span>
          <strong className="admin-card-value">02</strong>
          <span className="admin-card-description">
            Batch sheets requiring attention
          </span>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <div className="admin-section-card">
          <div className="admin-section-card-header">
            <h2>Batch Sheet Overview</h2>
            <p>
              Batch sheets generated after completion of the configured
              production stages.
            </p>
          </div>
          <div className="admin-empty-state">
            <h3>No Batch Sheets Available</h3>
            <p>
              Automatically generated Batch Sheets will appear here once
              completed production stages are approved by QA/QC.
            </p>
          </div>
        </div>

        <div className="admin-section-card">
          <div className="admin-section-card-header">
            <h2>Attention Required</h2>
            <p>Items requiring Admin attention will appear here.</p>
          </div>
          <div className="admin-empty-state">
            <h3>No Pending Items</h3>
            <p>
              Rejected Batch Sheets and other Admin-relevant notifications
              will appear here when available.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
