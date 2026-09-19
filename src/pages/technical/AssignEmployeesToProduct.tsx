import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTechnicalData } from "../../context/TechnicalDataContext";
import "./AssignEmployeesToProduct.css";

const AssignEmployeesToProduct = () => {
  const navigate = useNavigate();

  const {
    products,
    employees,
    productEmployeeAssignments,
    updateProductEmployeeAssignment,
  } = useTechnicalData();

  const [selectedProductCode, setSelectedProductCode] =
    useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState("");

  const [searchTerm, setSearchTerm] = useState("");

  /* ==================================================
     ACTIVE PRODUCTS
  ================================================== */

  const activeProducts = useMemo(
    () =>
      products.filter(
        (product) => product.status === "Active"
      ),
    [products]
  );

  /* ==================================================
     CURRENT PRODUCT ASSIGNMENT
  ================================================== */

  const currentAssignment = useMemo(
    () =>
      productEmployeeAssignments.find(
        (assignment) =>
          assignment.productCode === selectedProductCode
      ),
    [
      productEmployeeAssignments,
      selectedProductCode,
    ]
  );

  const assignedEmployeeIds =
    currentAssignment?.employeeIds ?? [];

  /* ==================================================
     ASSIGNED EMPLOYEES
  ================================================== */

  const assignedEmployees = useMemo(
    () =>
      employees.filter((employee) =>
        assignedEmployeeIds.includes(
          employee.employeeId
        )
      ),
    [employees, assignedEmployeeIds]
  );

  /* ==================================================
     AVAILABLE EMPLOYEES
     
     Only active employees who are not already
     assigned to the selected product.
  ================================================== */

  const availableEmployees = useMemo(
    () =>
      employees.filter(
        (employee) =>
          employee.status === "Active" &&
          !assignedEmployeeIds.includes(
            employee.employeeId
          )
      ),
    [employees, assignedEmployeeIds]
  );

  /* ==================================================
     SEARCH ASSIGNED EMPLOYEES
  ================================================== */

  const filteredAssignedEmployees = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return assignedEmployees;
    }

    return assignedEmployees.filter((employee) => {
      return (
        employee.employeeName
          .toLowerCase()
          .includes(search) ||
        employee.employeeId
          .toLowerCase()
          .includes(search)
      );
    });
  }, [assignedEmployees, searchTerm]);

  /* ==================================================
     PRODUCT CHANGE
  ================================================== */

  const handleProductChange = (
    productCode: string
  ) => {
    setSelectedProductCode(productCode);
    setSelectedEmployeeId("");
    setSearchTerm("");
  };

  /* ==================================================
     ADD EMPLOYEE
  ================================================== */

  const handleAddEmployee = () => {
    if (
      !selectedProductCode ||
      !selectedEmployeeId
    ) {
      return;
    }

    if (
      assignedEmployeeIds.includes(
        selectedEmployeeId
      )
    ) {
      return;
    }

    updateProductEmployeeAssignment(
      selectedProductCode,
      [
        ...assignedEmployeeIds,
        selectedEmployeeId,
      ]
    );

    setSelectedEmployeeId("");
  };

  /* ==================================================
     REMOVE EMPLOYEE
     
     This removes the assignment only.
     It does NOT delete the employee from the
     Admin employee master.
  ================================================== */

  const handleRemoveEmployee = (
    employeeId: string
  ) => {
    if (!selectedProductCode) {
      return;
    }

    const updatedEmployeeIds =
      assignedEmployeeIds.filter(
        (id) => id !== employeeId
      );

    updateProductEmployeeAssignment(
      selectedProductCode,
      updatedEmployeeIds
    );
  };

  return (
    <div className="assign-employees-page">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="assign-employees-header">
        <div>
          <h1>Assign Employees to Product</h1>

          <p>
            Assign active employees to a product.
            Employees are managed by Admin.
          </p>
        </div>

        <button
          type="button"
          className="assign-employees-back-button"
          onClick={() => navigate("/technical")}
        >
          Back
        </button>
      </div>

      {/* ==================================================
          TWO COLUMN SECTION
      ================================================== */}

      <div className="assign-employees-layout">
        {/* ==================================================
            ASSIGN EMPLOYEE CARD
        ================================================== */}

        <section className="assign-employees-card assign-card">
          <div className="assign-employees-card-title">
            <div>
              <h2>Assign Employee</h2>

              <p>
                Select a product and assign an existing
                employee from the Admin employee master.
              </p>
            </div>
          </div>

          <div className="assign-employees-card-body">
            {/* Product */}

            <div className="assign-employees-field">
              <label htmlFor="product-select">
                Select Product
              </label>

              <select
                id="product-select"
                value={selectedProductCode}
                onChange={(event) =>
                  handleProductChange(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select a product
                </option>

                {activeProducts.map((product) => (
                  <option
                    key={product.productCode}
                    value={product.productCode}
                  >
                    {product.productCode} -{" "}
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee */}

            <div className="assign-employees-field">
              <label htmlFor="employee-select">
                Select Employee
              </label>

              <select
                id="employee-select"
                value={selectedEmployeeId}
                onChange={(event) =>
                  setSelectedEmployeeId(
                    event.target.value
                  )
                }
                disabled={!selectedProductCode}
              >
                <option value="">
                  Select an employee
                </option>

                {availableEmployees.map(
                  (employee) => (
                    <option
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
                      {employee.employeeName} -{" "}
                      {employee.employeeId}
                    </option>
                  )
                )}
              </select>
            </div>

            <p className="assignment-info">
              Only active employees who are not already
              assigned to this product are available.
            </p>

            {/* Add Button */}

            <button
              type="button"
              className="add-employee-button"
              onClick={handleAddEmployee}
              disabled={
                !selectedProductCode ||
                !selectedEmployeeId
              }
            >
              <span className="add-employee-icon">
                +
              </span>

              <span>Add Employee</span>
            </button>
          </div>
        </section>

        {/* ==================================================
            ASSIGNED EMPLOYEES CARD
        ================================================== */}

        <section className="assign-employees-card assigned-card">
          <div className="assign-employees-card-title assigned-card-header">
            <div>
              <h2>Assigned Employees</h2>

              <p>
                View and manage employees assigned to
                the selected product.
              </p>
            </div>

            <span className="employee-count">
              {assignedEmployees.length}{" "}
              {assignedEmployees.length === 1
                ? "Employee"
                : "Employees"}
            </span>
          </div>

          <div className="assign-employees-card-body">
            {!selectedProductCode ? (
              <div className="assigned-empty-state">
                <h3>Select a Product</h3>

                <p>
                  Select a product from the Assign
                  Employee section to view its assigned
                  employees.
                </p>
              </div>
            ) : (
              <>
                {/* Search */}

                {assignedEmployees.length > 0 && (
                  <div className="assign-employees-field employee-search-field">
                    <label htmlFor="employee-search">
                      Search Employee
                    </label>

                    <input
                      id="employee-search"
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(
                          event.target.value
                        )
                      }
                      placeholder="Search by Employee Name or Employee ID"
                    />
                  </div>
                )}

                {/* Table */}

                {assignedEmployees.length > 0 ? (
                  <div className="employee-table-wrapper">
                    <table className="employee-table">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Employee Name</th>
                          <th>Designation</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredAssignedEmployees.length >
                        0 ? (
                          filteredAssignedEmployees.map(
                            (employee) => (
                              <tr
                                key={
                                  employee.employeeId
                                }
                              >
                                <td>
                                  {employee.employeeId}
                                </td>

                                <td>
                                  {employee.employeeName}
                                </td>

                                <td>
                                  {employee.designation}
                                </td>

                                <td>
                                  <button
                                    type="button"
                                    className="remove-employee-button"
                                    onClick={() =>
                                      handleRemoveEmployee(
                                        employee.employeeId
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="empty-search-row"
                            >
                              No assigned employees
                              match your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="assigned-empty-state">
                    <h3>No Employees Assigned</h3>

                    <p>
                      Select an employee from the
                      Assign Employee section to assign
                      them to this product.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AssignEmployeesToProduct;