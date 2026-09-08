import { useAuth } from "../../context/AuthContext";
import tadimetyLogo from "../../assets/Tadimety-transparent-logo.png";
import "./AppHeader.css";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

const AppHeader = ({ onMenuClick }: AppHeaderProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="app-header">

      <div className="header-left">

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="header-brand">

          <img
            src={tadimetyLogo}
            alt="Tadimety"
            className="header-logo"
          />

          <div className="header-brand-text">

            <div className="header-company">
              TADIMETY AROMATICS PRIVATE LIMITED
            </div>

            <div className="header-system">
              Digital Batch Sheet Management System
            </div>

          </div>

        </div>

      </div>

      <div className="header-user">

        {/* Branch */}
        <div className="header-branch">
          <span className="header-branch-label">
            Branch
          </span>

          <span className="header-branch-name">
            {user?.branch}
          </span>
        </div>

        {/* User Name and Role */}
        <div className="header-user-info">
          <span className="header-username">
            {user?.username}
          </span>

          <span className="header-role">
            {user?.role}
          </span>
        </div>

        <button
          type="button"
          className="header-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default AppHeader;