import { NavLink } from "react-router-dom";
import "./Sidebar.css";

interface SidebarItem {
  label: string;
  path: string;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({
  items,
  title = "Production",
  isOpen = false,
  onClose,
}: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-title">
            {title}
          </div>

          <button
            type="button"
            className="sidebar-close-button"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-navigation">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;