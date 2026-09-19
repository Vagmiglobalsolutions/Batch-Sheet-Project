import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppHeader from "../components/common/AppHeader";
import Sidebar from "../components/common/Sidebar";

import { TechnicalDataProvider } from "../context/TechnicalDataContext";

import "./TechnicalLayout.css";

const technicalMenu = [
  { label: "Dashboard", path: "/technical" },
  { label: "Products", path: "/technical/products" },
  { label: "Reactor Machines", path: "/technical/reactor-machines" },
  { label: "Assign Employees to Products", path: "/technical/assign-employees" },
  {
    label: "Process / Stage Configuration",
    path: "/technical/stage-configuration",
  },
  { label: "Forms Configuration", path: "/technical/forms" },
  //{ label: "Notifications", path: "/technical/notifications" },
];

const TechnicalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="technical-layout">
      <AppHeader onMenuClick={handleMenuClick} />

      <div className="technical-body">
        <Sidebar
          items={technicalMenu}
          title="Technical"
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />

        <main className="technical-content">
          <TechnicalDataProvider>
            <Outlet />
          </TechnicalDataProvider>
        </main>
      </div>
    </div>
  );
};

export default TechnicalLayout;