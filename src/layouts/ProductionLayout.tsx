import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppHeader from "../components/common/AppHeader";
import Sidebar from "../components/common/Sidebar";

import "./ProductionLayout.css";

const productionMenu = [
  {
    label: "Dashboard",
    path: "/production",
  },
  {
    label: "Start New Production",
    path: "/production/start",
  },
  {
    label: "Active Productions",
    path: "/production/active",
  },
  {
    label: "Pending QA/QC",
    path: "/production/pending",
  },
  {
    label: "Next Stages",
    path: "/production/select-stage",
  },
  {
    label: "Completed Productions",
    path: "/production/completed",
  },
   {
    label: "Stock Left",
    path: "/production/stock-left",
  },
  {
    label: "Request Edit",
    path: "/production/request-edit",
  },
  {
    label: "Notifications",
    path: "/production/notifications",
  },
];

const ProductionLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="production-layout">

      <AppHeader onMenuClick={handleMenuClick} />

      <div className="production-body">

        <Sidebar
          items={productionMenu}
          title="Production"
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />

        <main className="production-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default ProductionLayout;