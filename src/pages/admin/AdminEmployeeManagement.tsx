import { useMemo, useState } from "react";
import "./AdminEmployeeManagement.css";

type EmployeeRole = "PRODUCTION" | "QA" | "TECHNICAL" | "ADMIN";
type EmployeeStatus = "ACTIVE" | "INACTIVE";

interface Employee {
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: EmployeeRole;
  branch: string;
  deviceId: string;
  designation: string;
  status: EmployeeStatus;
  password: string;
}

interface FormErrors {
  employeeId?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  deviceId?: string;
  password?: string;
  confirmPassword?: string;
}

const initialEmployees: Employee[] = [
  {
    employeeId: "EMP001",
    fullName: "Rahul",
    email: "rahul@tadimety.com",
    phoneNumber: "9876543210",
    role: "PRODUCTION",
    branch: "Bangalore",
    deviceId: "DEV001",
    designation: "Production Executive",
    status: "ACTIVE",
    password: "password",
  },
  {
    employeeId: "EMP002",
    fullName: "Rahul",
    email: "rahul.qa@tadimety.com",
    phoneNumber: "9876543211",
    role: "QA",
    branch: "Bangalore",
    deviceId: "DEV002",
    designation: "QA Executive",
    status: "ACTIVE",
    password: "password",
  },
];

const branches = ["Bangalore", "Hyderabad", "Tumkuru"];

const emptyForm = {
  employeeId: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  role: "" as EmployeeRole | "",
  branch: "",
  deviceId: "",
  designation: "",
  password: "",
  confirmPassword: "",
  status: "ACTIVE" as EmployeeStatus,
};

const roleLabels: Record<EmployeeRole, string> = {
  PRODUCTION: "Production",
  QA: "QA/QC",
  TECHNICAL: "Technical",
  ADMIN: "Admin",
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6 0 9.5 7 9.5 7a18 18 0 0 1-3.1 3.8" />
      <path d="M6.1 6.1C3.5 8.1 2.5 12 2.5 12a18 18 0 0 0 3.7 4.2A10.5 10.5 0 0 0 12 19c1.4 0 2.7-.3 3.9-.8" />
    </svg>
  );
}

function AdminEmployeeManagement() {
  const [employees, setEmployees] =
    useState<Employee[]>(initialEmployees);

  const [showForm, setShowForm] = useState(false);

  const [editingEmployeeId, setEditingEmployeeId] =
    useState<string | null>(null);

  const [formData, setFormData] = useState(emptyForm);

  const [formErrors, setFormErrors] =
    useState<FormErrors>({});

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | EmployeeStatus>("ALL");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const openAddForm = () => {
    setEditingEmployeeId(null);
    setFormData({ ...emptyForm });
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowForm(true);
  };

  const openEditForm = (employee: Employee) => {
    setEditingEmployeeId(employee.employeeId);

    setFormData({
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      role: employee.role,
      branch: employee.branch,
      deviceId: employee.deviceId,
      designation: employee.designation,
      password: employee.password,
      confirmPassword: employee.password,
      status: employee.status,
    });

    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowForm(true);
  };

  const closeForm = () => {
    if (isSaving) {
      return;
    }

    setShowForm(false);
    setEditingEmployeeId(null);
    setFormData({ ...emptyForm });
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    const employeeId = formData.employeeId.trim();
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phoneNumber = formData.phoneNumber.trim();
    const deviceId = formData.deviceId.trim();

    /* Employee ID */
    if (!employeeId) {
      errors.employeeId = "Employee ID is required.";
    } else {
      const duplicateEmployee = employees.find(
        (employee) =>
          employee.employeeId.toLowerCase() ===
            employeeId.toLowerCase() &&
          employee.employeeId !== editingEmployeeId
      );

      if (duplicateEmployee) {
        errors.employeeId =
          "Employee ID already exists.";
      }
    }

    /* Full Name */
    if (!fullName) {
      errors.fullName = "Full Name is required.";
    }

    /* Email */
    if (!email) {
      errors.email = "Email is required.";
    }

    /* Phone Number */
    if (!phoneNumber) {
      errors.phoneNumber =
        "Phone Number is required.";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      errors.phoneNumber =
        "Enter a valid 10-digit phone number.";
    }

    /*
     * Role is REQUIRED because it determines
     * which dashboard the employee can access.
     */
    if (!formData.role) {
      errors.role = "Please select a role.";
    }

    /*
     * Device ID is REQUIRED.
     * Each employee has one fixed Device ID.
     */
    if (!deviceId) {
      errors.deviceId = "Device ID is required.";
    }

    /*
     * Branch and Designation are OPTIONAL.
     */

    /* Password */
    if (!formData.password) {
      errors.password = "Password is required.";
    }

    /* Confirm Password */
    if (!formData.confirmPassword) {
      errors.confirmPassword =
        "Confirm Password is required.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      errors.confirmPassword =
        "Password and Confirm Password do not match.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsSaving(true);

    /*
     * Temporary frontend delay.
     * This will later be replaced by the backend API call.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    const employee: Employee = {
      employeeId: formData.employeeId
        .trim()
        .toUpperCase(),

      fullName: formData.fullName.trim(),

      email: formData.email.trim(),

      phoneNumber: formData.phoneNumber.trim(),

      role: formData.role as EmployeeRole,

      branch: formData.branch,

      deviceId: formData.deviceId.trim(),

      designation: formData.designation.trim(),

      status: formData.status,

      /*
       * Frontend demo only.
       * Backend must hash passwords before storage.
       */
      password: formData.password,
    };

    if (editingEmployeeId) {
      setEmployees((previous) =>
        previous.map((existingEmployee) =>
          existingEmployee.employeeId ===
          editingEmployeeId
            ? employee
            : existingEmployee
        )
      );
    } else {
      setEmployees((previous) => [
        ...previous,
        employee,
      ]);
    }

    setIsSaving(false);

    closeForm();
  };

  const filteredEmployees = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !search ||
        employee.employeeId
          .toLowerCase()
          .includes(search) ||
        employee.fullName
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    employees,
    searchTerm,
    statusFilter,
  ]);

  return (
    <div className="admin-employees-page">
      {!showForm ? (
        <>
          {/* PAGE HEADER */}

          <div className="admin-page-header">
            <div>
              <h1>
                Employee Management
              </h1>

              <p>
                Manage employee accounts, roles and
                access.
              </p>
            </div>

            <button
              type="button"
              className="admin-primary-button"
              onClick={openAddForm}
            >
              Add Employee
            </button>
          </div>

          {/* EMPLOYEE LIST */}

          <section className="employee-list-card">
            <div className="employee-list-header">
              <div>
                <h2>Employees</h2>

                <p>
                  {filteredEmployees.length} employee
                  {filteredEmployees.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>

            {/* SEARCH / FILTER */}

            <div className="employee-toolbar">
              <div className="employee-search">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  placeholder="Search Employee ID or Name"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="employee-status-filter">
                <label htmlFor="employee-status-filter">
                  Status
                </label>

                <select
                  id="employee-status-filter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as
                        | "ALL"
                        | EmployeeStatus
                    )
                  }
                >
                  <option value="ALL">
                    All
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* TABLE */}

            {filteredEmployees.length > 0 ? (
              <div className="employee-table-wrapper">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Role</th>
                      <th>Branch</th>
                      <th>Device ID</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.map(
                      (employee) => (
                        <tr
                          key={
                            employee.employeeId
                          }
                        >
                          <td className="employee-id-cell">
                            {employee.employeeId}
                          </td>

                          <td>
                            {employee.fullName}
                          </td>

                          <td>
                            {employee.email}
                          </td>

                          <td>
                            <span className="phone-table-value">
                              +91{" "}
                              {employee.phoneNumber}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`role-badge role-${employee.role.toLowerCase()}`}
                            >
                              {
                                roleLabels[
                                  employee.role
                                ]
                              }
                            </span>
                          </td>

                          <td>
                            {employee.branch ||
                              "—"}
                          </td>

                          <td className="employee-device-id-cell">
                            {employee.deviceId}
                          </td>

                          <td>
                            {employee.designation ||
                              "—"}
                          </td>

                          <td>
                            <span
                              className={`status-badge status-${employee.status.toLowerCase()}`}
                            >
                              {employee.status ===
                              "ACTIVE"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="employee-edit-button"
                              onClick={() =>
                                openEditForm(
                                  employee
                                )
                              }
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="employee-empty-state">
                <h3>
                  No employees found
                </h3>

                <p>
                  Try changing your search or
                  status filter.
                </p>
              </div>
            )}
          </section>
        </>
      ) : (
        /* ADD / EDIT FORM */

        <div className="employee-form-page">
          <div className="admin-page-header">
            <div>
              <h1>
                {editingEmployeeId
                  ? "Edit Employee"
                  : "Add Employee"}
              </h1>

              <p>
                {editingEmployeeId
                  ? "Update employee account details and access."
                  : "Create a new employee account."}
              </p>
            </div>
          </div>

          <section className="employee-form-card">
            <div className="employee-form-header">
              <div>
                <h2>Employee Details</h2>

                <p>
                  Enter the employee information
                  below.
                </p>
              </div>
            </div>

            <div className="employee-form-grid">
              {/* Employee ID */}

              <div className="form-field">
                <label htmlFor="employee-id">
                  Employee ID <span>*</span>
                </label>

                <input
                  id="employee-id"
                  type="text"
                  value={formData.employeeId}
                  disabled={Boolean(
                    editingEmployeeId
                  )}
                  className={
                    formErrors.employeeId
                      ? "field-error"
                      : ""
                  }
                  placeholder="Enter Employee ID"
                  onChange={(event) =>
                    handleChange(
                      "employeeId",
                      event.target.value
                    )
                  }
                />

                {formErrors.employeeId && (
                  <span className="field-error-message">
                    {formErrors.employeeId}
                  </span>
                )}
              </div>

              {/* Full Name */}

              <div className="form-field">
                <label htmlFor="full-name">
                  Full Name <span>*</span>
                </label>

                <input
                  id="full-name"
                  type="text"
                  value={formData.fullName}
                  className={
                    formErrors.fullName
                      ? "field-error"
                      : ""
                  }
                  placeholder="Enter Full Name"
                  onChange={(event) =>
                    handleChange(
                      "fullName",
                      event.target.value
                    )
                  }
                />

                {formErrors.fullName && (
                  <span className="field-error-message">
                    {formErrors.fullName}
                  </span>
                )}
              </div>

              {/* Email */}

              <div className="form-field">
                <label htmlFor="employee-email">
                  Email <span>*</span>
                </label>

                <input
                  id="employee-email"
                  type="email"
                  value={formData.email}
                  className={
                    formErrors.email
                      ? "field-error"
                      : ""
                  }
                  placeholder="Enter Email"
                  onChange={(event) =>
                    handleChange(
                      "email",
                      event.target.value
                    )
                  }
                />

                {formErrors.email && (
                  <span className="field-error-message">
                    {formErrors.email}
                  </span>
                )}
              </div>

              {/* Phone Number */}

              <div className="form-field">
                <label htmlFor="employee-phone">
                  Phone Number <span>*</span>
                </label>

                <div
                  className={`phone-input-wrapper ${
                    formErrors.phoneNumber
                      ? "field-error-wrapper"
                      : ""
                  }`}
                >
                  <div className="phone-country-code">
                    +91
                  </div>

                  <input
                    id="employee-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={
                      formData.phoneNumber
                    }
                    placeholder="Enter 10-digit number"
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      handleChange(
                        "phoneNumber",
                        value
                      );
                    }}
                  />
                </div>

                {formErrors.phoneNumber && (
                  <span className="field-error-message">
                    {formErrors.phoneNumber}
                  </span>
                )}
              </div>

              {/* Role - Required */}

              <div className="form-field">
                <label htmlFor="employee-role">
                  Role <span>*</span>
                </label>

                <select
                  id="employee-role"
                  value={formData.role}
                  className={
                    formErrors.role
                      ? "field-error"
                      : ""
                  }
                  onChange={(event) =>
                    handleChange(
                      "role",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select Role
                  </option>

                  <option value="PRODUCTION">
                    Production
                  </option>

                  <option value="QA">
                    QA/QC
                  </option>

                  <option value="TECHNICAL">
                    Technical
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>
                </select>

                {formErrors.role && (
                  <span className="field-error-message">
                    {formErrors.role}
                  </span>
                )}
              </div>

              {/* Branch - Optional */}

              <div className="form-field">
                <label htmlFor="employee-branch">
                  Branch
                </label>

                <select
                  id="employee-branch"
                  value={formData.branch}
                  onChange={(event) =>
                    handleChange(
                      "branch",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select Branch
                  </option>

                  {branches.map((branch) => (
                    <option
                      key={branch}
                      value={branch}
                    >
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Device ID - Required */}

              <div className="form-field">
                <label htmlFor="employee-device-id">
                  Device ID <span>*</span>
                </label>

                <input
                  id="employee-device-id"
                  type="text"
                  value={formData.deviceId}
                  className={
                    formErrors.deviceId
                      ? "field-error"
                      : ""
                  }
                  placeholder="Enter Device ID"
                  onChange={(event) =>
                    handleChange(
                      "deviceId",
                      event.target.value
                    )
                  }
                />

                {formErrors.deviceId && (
                  <span className="field-error-message">
                    {formErrors.deviceId}
                  </span>
                )}
              </div>

              {/* Designation - Optional */}

              <div className="form-field">
                <label htmlFor="employee-designation">
                  Designation
                </label>

                <input
                  id="employee-designation"
                  type="text"
                  value={
                    formData.designation
                  }
                  placeholder="Enter Designation"
                  onChange={(event) =>
                    handleChange(
                      "designation",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Password */}

              <div className="form-field">
                <label htmlFor="employee-password">
                  Password <span>*</span>
                </label>

                <div className="password-input-wrapper">
                  <input
                    id="employee-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.password
                    }
                    className={
                      formErrors.password
                        ? "field-error"
                        : ""
                    }
                    placeholder="Enter Password"
                    onChange={(event) =>
                      handleChange(
                        "password",
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    <EyeIcon
                      hidden={!showPassword}
                    />
                  </button>
                </div>

                {formErrors.password && (
                  <span className="field-error-message">
                    {formErrors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password */}

              <div className="form-field">
                <label htmlFor="employee-confirm-password">
                  Confirm Password{" "}
                  <span>*</span>
                </label>

                <div className="password-input-wrapper">
                  <input
                    id="employee-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    className={
                      formErrors.confirmPassword
                        ? "field-error"
                        : ""
                    }
                    placeholder="Confirm Password"
                    onChange={(event) =>
                      handleChange(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    <EyeIcon
                      hidden={
                        !showConfirmPassword
                      }
                    />
                  </button>
                </div>

                {formErrors.confirmPassword && (
                  <span className="field-error-message">
                    {
                      formErrors
                        .confirmPassword
                    }
                  </span>
                )}
              </div>

              {/* Status */}

              <div className="form-field">
                <label htmlFor="employee-status">
                  Status
                </label>

                <select
                  id="employee-status"
                  value={formData.status}
                  onChange={(event) =>
                    handleChange(
                      "status",
                      event.target.value
                    )
                  }
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* FORM ACTIONS */}

            <div className="employee-form-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={closeForm}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-primary-button"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving
                  ? editingEmployeeId
                    ? "Saving..."
                    : "Adding..."
                  : editingEmployeeId
                  ? "Save Changes"
                  : "Add Employee"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminEmployeeManagement;