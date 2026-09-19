import { useMemo, useState } from "react";
import "./AdminAuditLogs.css";
import { useProductData } from "../../context/ProductContext";
import type { Product } from "../../data/technicalData";

type AuditAction =
  | "Production Submitted for QA Inspection"
  | "QA Approved"
  | "QA Rejected";

interface AuditLog {
  id: string;
  productName: string;
  productCode: string;
  stage: string;
  lotNumber: string;
  action: AuditAction;
  date: string;
  time: string;
  performedByName: string;
  performedByEmployeeId: string;
}

const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    productName: "Product A",
    productCode: "PROD001",
    stage: "Reaction",
    lotNumber: "LOT-REA-0001",
    action: "Production Submitted for QA Inspection",
    date: "2026-09-17",
    time: "09:42 AM",
    performedByName: "Rahul",
    performedByEmployeeId: "EMP001",
  },
  {
    id: "AUD-002",
    productName: "Product A",
    productCode: "PROD001",
    stage: "Reaction",
    lotNumber: "LOT-REA-0001",
    action: "QA Approved",
    date: "2026-09-17",
    time: "10:18 AM",
    performedByName: "Priya",
    performedByEmployeeId: "EMP002",
  },
  {
    id: "AUD-003",
    productName: "Product A",
    productCode: "PROD001",
    stage: "Washing",
    lotNumber: "LOT-WAS-0001",
    action: "Production Submitted for QA Inspection",
    date: "2026-09-17",
    time: "11:35 AM",
    performedByName: "Rahul",
    performedByEmployeeId: "EMP001",
  },
  {
    id: "AUD-004",
    productName: "Product A",
    productCode: "PROD001",
    stage: "Washing",
    lotNumber: "LOT-WAS-0001",
    action: "QA Rejected",
    date: "2026-09-17",
    time: "12:06 PM",
    performedByName: "Priya",
    performedByEmployeeId: "EMP002",
  },
  {
    id: "AUD-005",
    productName: "Product B",
    productCode: "PROD002",
    stage: "Recovery",
    lotNumber: "LOT-REC-0001",
    action: "Production Submitted for QA Inspection",
    date: "2026-09-17",
    time: "12:45 PM",
    performedByName: "Arun",
    performedByEmployeeId: "EMP003",
  },
  {
    id: "AUD-006",
    productName: "Product B",
    productCode: "PROD002",
    stage: "Recovery",
    lotNumber: "LOT-REC-0001",
    action: "QA Approved",
    date: "2026-09-17",
    time: "01:20 PM",
    performedByName: "Priya",
    performedByEmployeeId: "EMP002",
  },
  {
    id: "AUD-007",
    productName: "Product B",
    productCode: "PROD002",
    stage: "Distillation",
    lotNumber: "LOT-DIS-0001",
    action: "Production Submitted for QA Inspection",
    date: "2026-09-17",
    time: "02:15 PM",
    performedByName: "Arun",
    performedByEmployeeId: "EMP003",
  },
  {
    id: "AUD-008",
    productName: "Product B",
    productCode: "PROD002",
    stage: "Distillation",
    lotNumber: "LOT-DIS-0001",
    action: "QA Approved",
    date: "2026-09-17",
    time: "03:02 PM",
    performedByName: "Priya",
    performedByEmployeeId: "EMP002",
  },
  {
    id: "AUD-009",
    productName: "Product A",
    productCode: "PROD001",
    stage: "Blending",
    lotNumber: "LOT-BLE-0001",
    action: "Production Submitted for QA Inspection",
    date: "2026-09-17",
    time: "03:40 PM",
    performedByName: "Rahul",
    performedByEmployeeId: "EMP001",
  },
  {
    id: "AUD-010",
    productName: "Product A",
    productCode: "PROD001",
    stage: "Blending",
    lotNumber: "LOT-BLE-0001",
    action: "QA Approved",
    date: "2026-09-17",
    time: "04:12 PM",
    performedByName: "Priya",
    performedByEmployeeId: "EMP002",
  },
  {
    id: "AUD-011",
    productName: "Product C",
    productCode: "PROD003",
    stage: "Packaging",
    lotNumber: "LOT-PKG-0001",
    action: "Production Submitted for QA Inspection",
    date: "2026-09-17",
    time: "04:35 PM",
    performedByName: "Arun",
    performedByEmployeeId: "EMP003",
  },
  {
    id: "AUD-012",
    productName: "Product C",
    productCode: "PROD003",
    stage: "Packaging",
    lotNumber: "LOT-PKG-0001",
    action: "QA Rejected",
    date: "2026-09-17",
    time: "05:02 PM",
    performedByName: "Priya",
    performedByEmployeeId: "EMP002",
  },
  {
    id: "AUD-013",
    productName: "Product C",
    productCode: "PROD003",
    stage: "Centrifuge",
    lotNumber: "LOT-CEN-0001",
    action: "Production Submitted for QA Inspection",
    date: "2026-09-17",
    time: "05:25 PM",
    performedByName: "Arun",
    performedByEmployeeId: "EMP003",
  },
  {
    id: "AUD-014",
    productName: "Product C",
    productCode: "PROD003",
    stage: "Centrifuge",
    lotNumber: "LOT-CEN-0001",
    action: "QA Approved",
    date: "2026-09-17",
    time: "05:58 PM",
    performedByName: "Priya",
    performedByEmployeeId: "EMP002",
  },
  {
    id: "AUD-015",
    productName: "Product D",
    productCode: "PROD004",
    stage: "FBD",
    lotNumber: "LOT-FBD-0001",
    action: "Production Submitted for QA Inspection",
    date: "2026-09-17",
    time: "06:20 PM",
    performedByName: "Rahul",
    performedByEmployeeId: "EMP001",
  },
  {
    id: "AUD-016",
    productName: "Product D",
    productCode: "PROD004",
    stage: "FBD",
    lotNumber: "LOT-FBD-0001",
    action: "QA Approved",
    date: "2026-09-17",
    time: "06:55 PM",
    performedByName: "Priya",
    performedByEmployeeId: "EMP002",
  },
];

const stageOptions = [
  "Reaction",
  "Washing",
  "Recovery",
  "Distillation",
  "Blending",
  "Packaging",
  "Centrifuge",
  "FBD",
];

const AdminAuditLogs = () => {
  const { products } = useProductData();

  const [auditLogs] = useState<AuditLog[]>(
    initialAuditLogs
  );

  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] =
    useState("All");
  const [stageFilter, setStageFilter] =
    useState("All");
  const [actionFilter, setActionFilter] =
    useState("All");
  const [dateFilter, setDateFilter] =
    useState("");

  /*
   * Products come from the shared Product Master.
   *
   * Product uses:
   * productName
   * productCode
   *
   * not:
   * name
   * code
   */
  const productOptions = useMemo(() => {
    const contextProducts = products.map(
    (product: Product) => ({
        productName: product.productName,
        productCode: product.productCode,
    })
    );

    /*
     * Include products from mock audit data as well.
     * This keeps the mock records filterable even if
     * a product has not yet been added to Product Master.
     */
    const logProducts = auditLogs.map(
      (log) => ({
        productName: log.productName,
        productCode: log.productCode,
      })
    );

    const combinedProducts = [
      ...contextProducts,
      ...logProducts,
    ];

    const uniqueProducts = new Map<
      string,
      {
        productName: string;
        productCode: string;
      }
    >();

    combinedProducts.forEach((product) => {
      const key = `${product.productName} / ${product.productCode}`;

      if (!uniqueProducts.has(key)) {
        uniqueProducts.set(key, product);
      }
    });

    return Array.from(uniqueProducts.values());
  }, [products, auditLogs]);

  const filteredLogs = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return auditLogs.filter((log) => {
      const productLabel =
        `${log.productName} / ${log.productCode}`
          .toLowerCase();

      const performedBy =
        `${log.performedByName} ${log.performedByEmployeeId}`
          .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        productLabel.includes(normalizedSearch) ||
        log.stage
          .toLowerCase()
          .includes(normalizedSearch) ||
        log.lotNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        log.action
          .toLowerCase()
          .includes(normalizedSearch) ||
        performedBy.includes(normalizedSearch);

      const matchesProduct =
        productFilter === "All" ||
        `${log.productName} / ${log.productCode}` ===
          productFilter;

      const matchesStage =
        stageFilter === "All" ||
        log.stage === stageFilter;

      const matchesAction =
        actionFilter === "All" ||
        log.action === actionFilter;

      const matchesDate =
        !dateFilter ||
        log.date === dateFilter;

      return (
        matchesSearch &&
        matchesProduct &&
        matchesStage &&
        matchesAction &&
        matchesDate
      );
    });
  }, [
    auditLogs,
    search,
    productFilter,
    stageFilter,
    actionFilter,
    dateFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setProductFilter("All");
    setStageFilter("All");
    setActionFilter("All");
    setDateFilter("");
  };

  const formatDate = (date: string) => {
    if (!date) {
      return "";
    }

    const [year, month, day] =
      date.split("-");

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="admin-audit-page">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-audit-header">
        <div>
          <h1>Audit Logs</h1>

          <p>
            Track Production submissions and QA
            decisions for each batch stage.
          </p>
        </div>
      </div>

      {/* ==================================================
          FILTER CARD
      ================================================== */}

      <section className="admin-audit-filter-card">
        <div className="admin-audit-filter-row">
          {/* Search */}

          <div className="admin-audit-field">
            <label htmlFor="audit-search">
              Search
            </label>

            <input
              id="audit-search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search lot number, product, stage..."
            />
          </div>

          {/* Product */}

          <div className="admin-audit-field">
            <label htmlFor="audit-product">
              Product Name / Code
            </label>

            <select
              id="audit-product"
              value={productFilter}
              onChange={(event) =>
                setProductFilter(event.target.value)
              }
            >
              <option value="All">
                All Products
              </option>

              {productOptions.map((product) => (
                <option
                  key={`${product.productCode}-${product.productName}`}
                  value={`${product.productName} / ${product.productCode}`}
                >
                  {product.productName} /{" "}
                  {product.productCode}
                </option>
              ))}
            </select>
          </div>

          {/* Stage */}

          <div className="admin-audit-field">
            <label htmlFor="audit-stage">
              Stage
            </label>

            <select
              id="audit-stage"
              value={stageFilter}
              onChange={(event) =>
                setStageFilter(event.target.value)
              }
            >
              <option value="All">
                All Stages
              </option>

              {stageOptions.map((stage) => (
                <option
                  key={stage}
                  value={stage}
                >
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {/* Action */}

          <div className="admin-audit-field">
            <label htmlFor="audit-action">
              Action
            </label>

            <select
              id="audit-action"
              value={actionFilter}
              onChange={(event) =>
                setActionFilter(event.target.value)
              }
            >
              <option value="All">
                All Actions
              </option>

              <option value="Production Submitted for QA Inspection">
                Production Submitted for QA Inspection
              </option>

              <option value="QA Approved">
                QA Approved
              </option>

              <option value="QA Rejected">
                QA Rejected
              </option>
            </select>
          </div>

          {/* Date */}

          <div className="admin-audit-field admin-audit-date-field">
            <label htmlFor="audit-date">
              Date
            </label>

            <input
              id="audit-date"
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
            />
          </div>

          {/* Clear */}

          <div className="admin-audit-clear-wrapper">
            <button
              type="button"
              className="admin-audit-clear-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          TABLE
      ================================================== */}

      <section className="admin-audit-table-card">
        <div className="admin-audit-table-wrapper">
          <table className="admin-audit-table">
            <thead>
              <tr>
                <th>
                  Product Name / Code
                </th>

                <th>Stage</th>

                <th>Lot Number</th>

                <th>Action</th>

                <th>Date</th>

                <th>Time</th>

                <th>Performed By</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="admin-audit-product">
                        <strong>
                          {log.productName}
                        </strong>

                        <span>
                          {log.productCode}
                        </span>
                      </div>
                    </td>

                    <td>
                      {log.stage}
                    </td>

                    <td>
                      <span className="admin-audit-lot">
                        {log.lotNumber}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-audit-action ${
                          log.action ===
                          "QA Approved"
                            ? "approved"
                            : log.action ===
                              "QA Rejected"
                            ? "rejected"
                            : "submitted"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td>
                      {formatDate(log.date)}
                    </td>

                    <td>
                      {log.time}
                    </td>

                    <td>
                      <div className="admin-audit-performed-by">
                        <strong>
                          {log.performedByName}
                        </strong>

                        <span>
                          {log.performedByEmployeeId}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="admin-audit-empty"
                  >
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminAuditLogs;