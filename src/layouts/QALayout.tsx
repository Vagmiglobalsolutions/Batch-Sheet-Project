import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppHeader from "../components/common/AppHeader";
import Sidebar from "../components/common/Sidebar";

import "./QALayout.css";

const qaMenu = [
  {
    label: "Dashboard",
    path: "/qa",
  },
  {
    label: "Pending Reviews",
    path: "/qa/pending",
  },
  {
    label: "Approved Reviews",
    path: "/qa/approved",
  },
  {
    label: "On Hold Reviews",
    path: "/qa/on-hold",
  },
  {
    label: "Rejected Reviews",
    path: "/qa/rejected",
  },
  {
    label: "Notifications",
    path: "/qa/notifications",
  },
];

const QALayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="qa-layout">

      <AppHeader onMenuClick={handleMenuClick} />

      <div className="qa-body">

        <Sidebar
          items={qaMenu}
          title="Quality Analyst"
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />

        <main className="qa-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default QALayout;