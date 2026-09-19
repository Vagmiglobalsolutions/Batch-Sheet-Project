import { useNavigate } from "react-router-dom";
import "./TechnicalDashboard.css";

interface TechnicalStat {
  label: string;
  value: string;
  description: string;
}

interface ProductConfiguration {
  productCode: string;
  productName: string;
  reactorMachine: string;
  employees: number;
  applicableStages: number;
  totalStages: number;
  formsConfigured: number;
  status: "CONFIGURED" | "PARTIALLY CONFIGURED" | "PENDING";
}

const TechnicalDashboard = () => {
  const navigate = useNavigate();

  const stats: TechnicalStat[] = [
    {
      label: "Total Products",
      value: "12",
      description: "Products available in the system",
    },
    {
      label: "Configured Products",
      value: "08",
      description: "Products with complete configuration",
    },
    {
      label: "Pending Configuration",
      value: "04",
      description: "Products requiring configuration",
    },
    {
      label: "Forms Configured",
      value: "64",
      description: "Product-specific stage forms configured",
    },
  ];

  const productConfigurations: ProductConfiguration[] = [
    {
      productCode: "PROD001",
      productName: "Product A",
      reactorMachine: "Reactor-01",
      employees: 6,
      applicableStages: 8,
      totalStages: 8,
      formsConfigured: 8,
      status: "CONFIGURED",
    },
    {
      productCode: "PROD002",
      productName: "Product B",
      reactorMachine: "Reactor-02",
      employees: 4,
      applicableStages: 6,
      totalStages: 8,
      formsConfigured: 5,
      status: "PARTIALLY CONFIGURED",
    },
    {
      productCode: "PROD003",
      productName: "Product C",
      reactorMachine: "Reactor-03",
      employees: 3,
      applicableStages: 5,
      totalStages: 8,
      formsConfigured: 0,
      status: "PENDING",
    },
    {
      productCode: "PROD004",
      productName: "Product D",
      reactorMachine: "Reactor-01",
      employees: 5,
      applicableStages: 7,
      totalStages: 8,
      formsConfigured: 7,
      status: "CONFIGURED",
    },
  ];

  const getStatusLabel = (
    status: ProductConfiguration["status"]
  ): string => {
    switch (status) {
      case "CONFIGURED":
        return "Configured";

      case "PARTIALLY CONFIGURED":
        return "Partially Configured";

      case "PENDING":
      default:
        return "Pending";
    }
  };

  const getStatusClass = (
    status: ProductConfiguration["status"]
  ): string => {
    switch (status) {
      case "CONFIGURED":
        return "technical-status configured";

      case "PARTIALLY CONFIGURED":
        return "technical-status partial";

      case "PENDING":
      default:
        return "technical-status pending";
    }
  };

  return (
    <div className="technical-dashboard-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="technical-dashboard-header">
        <div>
          <h1>Technical Dashboard</h1>

          <p>
            Manage product-specific technical configurations,
            process stages, employees, reactor machines and forms.
          </p>
        </div>
      </div>


      {/* ==================================================
          DASHBOARD STATS
      ================================================== */}

      <div className="technical-dashboard-stats">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="technical-stat-card"
          >
            <span className="technical-stat-label">
              {stat.label}
            </span>

            <strong className="technical-stat-value">
              {stat.value}
            </strong>

            <span className="technical-stat-description">
              {stat.description}
            </span>
          </div>
        ))}

      </div>


      {/* ==================================================
          QUICK ACCESS
      ================================================== */}

      <div className="technical-section technical-quick-access-section">

        <div className="technical-section-header">

          <div>
            <h2>Configuration Management</h2>

            <p>
              Quickly access the technical configuration areas.
            </p>
          </div>

        </div>


        <div className="technical-quick-access-grid">

          <button
            type="button"
            className="technical-quick-card"
            onClick={() => navigate("/technical/products")}
          >
            <div className="technical-quick-number">
              01
            </div>

            <div className="technical-quick-content">
              <h3>Products</h3>

              <p>
                View and manage the products available in the system.
              </p>
            </div>

            <span className="technical-quick-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="technical-quick-card"
            onClick={() =>
              navigate("/technical/reactor-machines")
            }
          >
            <div className="technical-quick-number">
              02
            </div>

            <div className="technical-quick-content">
              <h3>Reactor Machines</h3>

              <p>
                Manage reactor machines assigned to specific products.
              </p>
            </div>

            <span className="technical-quick-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="technical-quick-card"
            onClick={() =>
              navigate("/technical/assign-employees")
            }
          >
            <div className="technical-quick-number">
              03
            </div>

            <div className="technical-quick-content">
              <h3>Assign Employees to Products</h3>

              <p>
                Manage employees associated with specific products.
              </p>
            </div>

            <span className="technical-quick-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="technical-quick-card"
            onClick={() =>
              navigate("/technical/stage-configuration")
            }
          >
            <div className="technical-quick-number">
              04
            </div>

            <div className="technical-quick-content">
              <h3>Process / Stage Configuration</h3>

              <p>
                Configure applicable stages and their process
                sequence for each product.
              </p>
            </div>

            <span className="technical-quick-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="technical-quick-card"
            onClick={() =>
              navigate("/technical/forms")
            }
          >
            <div className="technical-quick-number">
              05
            </div>

            <div className="technical-quick-content">
              <h3>Forms</h3>

              <p>
                Manage product-specific forms for applicable
                process stages.
              </p>
            </div>

            <span className="technical-quick-arrow">
              →
            </span>
          </button>


         {/* <button
            type="button"
            className="technical-quick-card"
            onClick={() =>
              navigate("/technical/notifications")
            }
          >
            <div className="technical-quick-number">
              06
            </div>

            <div className="technical-quick-content">
              <h3>Notifications</h3>

              <p>
                View technical configuration updates and
                notifications.
              </p>
            </div>

            <span className="technical-quick-arrow">
              →
            </span>
          </button> */}

        </div>

      </div> 


      {/* ==================================================
          PRODUCT CONFIGURATION STATUS
      ================================================== */}

      <div className="technical-section">

        <div className="technical-section-header">

          <div>
            <h2>Product Configuration Status</h2>

            <p>
              Overview of the current technical configuration
              for products.
            </p>
          </div>

          <button
            type="button"
            className="technical-view-all-button"
            onClick={() =>
              navigate("/technical/products")
            }
          >
            View All Products
          </button>

        </div>


        <div className="technical-table-wrapper">

          <table className="technical-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Reactor Machine</th>
                <th>Employees</th>
                <th>Applicable Stages</th>
                <th>Forms</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {productConfigurations.map((product) => (
                <tr key={product.productCode}>

                  <td>
                    <div className="technical-product-cell">

                      <strong>
                        {product.productCode}
                      </strong>

                      <span>
                        {product.productName}
                      </span>

                    </div>
                  </td>

                  <td>
                    {product.reactorMachine}
                  </td>

                  <td>
                    {product.employees}
                  </td>

                  <td>
                    {product.applicableStages} /{" "}
                    {product.totalStages}
                  </td>

                  <td>
                    {product.formsConfigured} /{" "}
                    {product.applicableStages}
                  </td>

                  <td>
                    <span
                      className={getStatusClass(
                        product.status
                      )}
                    >
                      {getStatusLabel(
                        product.status
                      )}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default TechnicalDashboard;