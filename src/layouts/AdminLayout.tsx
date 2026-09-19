import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/common/AppHeader";
import Sidebar from "../components/common/Sidebar";
import "./AdminLayout.css";

const adminMenu = [
  { label: "Dashboard", path: "/admin" },
  { label: "Employee Management", path: "/admin/employees" },
  { label: "Add Products", path: "/admin/products" },
  { label: "Batch Sheets", path: "/admin/batch-sheets" },
  { label: "Rejected Batch Sheets", path: "/admin/rejected-batch-sheets" },
  { label: "Pending Stock", path: "/admin/pending-stock" },
  { label: "Edit Requests", path: "/admin/edit-requests" },
  { label: "Audit Logs", path: "/admin/audit-logs" },
  { label: "Notifications", path: "/admin/notifications" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AppHeader onMenuClick={() => setSidebarOpen((open) => !open)} />
      <div className="admin-body">
        <Sidebar
          items={adminMenu}
          title="Admin"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;