import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TechnicalReactorMachines.css";

import {
  useTechnicalData,
  type TechnicalReactorMachine,
} from "../../context/TechnicalDataContext";

const TechnicalReactorMachines = () => {
  const navigate = useNavigate();

  const {
    products,
    machines,
    productMachineAssignments,
    addMachine,
    updateMachine,
    updateProductMachineAssignment,
  } = useTechnicalData();

  const [showMachineModal, setShowMachineModal] =
    useState(false);

  const [showAssignmentModal, setShowAssignmentModal] =
    useState(false);

  const [editingMachine, setEditingMachine] =
    useState<TechnicalReactorMachine | null>(null);

  const [selectedProductCode, setSelectedProductCode] =
    useState<string | null>(null);

  const [machineName, setMachineName] = useState("");

  const [machineStatus, setMachineStatus] =
    useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const [selectedMachineIds, setSelectedMachineIds] =
    useState<number[]>([]);

  const [machineSearch, setMachineSearch] =
    useState("");

  const [productSearch, setProductSearch] =
    useState("");

  /* ==================================================
     MACHINE MODAL
  ================================================== */

  const openAddMachine = () => {
    setEditingMachine(null);
    setMachineName("");
    setMachineStatus("ACTIVE");
    setShowMachineModal(true);
  };

  const openEditMachine = (
    machine: TechnicalReactorMachine
  ) => {
    setEditingMachine(machine);
    setMachineName(machine.machineName);
    setMachineStatus(machine.status);
    setShowMachineModal(true);
  };

  const closeMachineModal = () => {
    setShowMachineModal(false);
    setEditingMachine(null);
    setMachineName("");
    setMachineStatus("ACTIVE");
  };

  const handleSaveMachine = () => {
    if (editingMachine) {
      updateMachine(editingMachine.id, {
        machineName,
        status: machineStatus,
      });
    } else {
      const newMachine: TechnicalReactorMachine = {
        id: Date.now(),
        machineName,
        status: machineStatus,
      };

      addMachine(newMachine);
    }

    closeMachineModal();
  };

  /* ==================================================
     PRODUCT ASSIGNMENT
  ================================================== */

  const getAssignedMachineIds = (
    productCode: string
  ): number[] => {
    return (
      productMachineAssignments.find(
        (assignment) =>
          assignment.productCode === productCode
      )?.machineIds ?? []
    );
  };

  const openAssignmentModal = (
    productCode: string
  ) => {
    setSelectedProductCode(productCode);

    setSelectedMachineIds(
      getAssignedMachineIds(productCode)
    );

    setShowAssignmentModal(true);
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedProductCode(null);
    setSelectedMachineIds([]);
  };

  const toggleMachineAssignment = (
    machineId: number
  ) => {
    setSelectedMachineIds((currentIds) => {
      if (currentIds.includes(machineId)) {
        return currentIds.filter(
          (id) => id !== machineId
        );
      }

      return [...currentIds, machineId];
    });
  };

  const handleSaveAssignment = () => {
    if (!selectedProductCode) {
      return;
    }

    updateProductMachineAssignment(
      selectedProductCode,
      selectedMachineIds
    );

    closeAssignmentModal();
  };

  /* ==================================================
     SEARCH
  ================================================== */

  const filteredMachines = machines.filter(
    (machine) => {
      const search =
        machineSearch.toLowerCase().trim();

      if (!search) {
        return true;
      }

      return machine.machineName
        .toLowerCase()
        .includes(search);
    }
  );

  const filteredProducts = products.filter(
    (product) => {
      const search =
        productSearch.toLowerCase().trim();

      if (!search) {
        return true;
      }

      return (
        product.productCode
          .toLowerCase()
          .includes(search) ||
        product.productName
          .toLowerCase()
          .includes(search)
      );
    }
  );

  const getAssignedMachineNames = (
    productCode: string
  ): string => {
    const machineIds =
      getAssignedMachineIds(productCode);

    const names = machineIds
      .map(
        (machineId) =>
          machines.find(
            (machine) => machine.id === machineId
          )?.machineName
      )
      .filter(Boolean);

    return names.length > 0
      ? names.join(", ")
      : "None";
  };

  const selectedProduct = products.find(
    (product) =>
      product.productCode === selectedProductCode
  );

  return (
    <div className="technical-reactor-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="technical-reactor-header">

        <div>
          <h1>Reactor Machines</h1>

          <p>
            Manage reactor machines and assign them to specific
            products.
          </p>
        </div>

        <div className="technical-reactor-header-actions">

          <button
            type="button"
            className="technical-reactor-back-button"
            onClick={() => navigate("/technical")}
          >
            Back
          </button>

          <button
            type="button"
            className="technical-reactor-add-button"
            onClick={openAddMachine}
          >
            + Add Reactor Machine
          </button>

        </div>

      </div>


      {/* ==================================================
          REACTOR MACHINE MASTER LIST
      ================================================== */}

      <div className="technical-reactor-card">

        <div className="technical-reactor-card-header">

          <div>
            <h2>Reactor Machine List</h2>

            <p>
              Manage the reactor machines available in the system.
            </p>
          </div>

          <span className="technical-reactor-count">
            {machines.length} Machines
          </span>

        </div>

        <div className="technical-reactor-toolbar">

          <div className="technical-reactor-search">

            <label htmlFor="machine-search">
              Search Reactor Machines
            </label>

            <input
              id="machine-search"
              type="text"
              value={machineSearch}
              onChange={(event) =>
                setMachineSearch(
                  event.target.value
                )
              }
              placeholder="Search by machine name"
            />

          </div>

        </div>

        <div className="technical-reactor-table-wrapper">

          {filteredMachines.length === 0 ? (
            <div className="technical-reactor-empty">
              No reactor machines found.
            </div>
          ) : (
            <table className="technical-reactor-table">

              <thead>
                <tr>
                  <th>Reactor Machine</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredMachines.map(
                  (machine) => (
                    <tr key={machine.id}>

                      <td>
                        <strong className="technical-machine-name">
                          {machine.machineName}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`technical-machine-status technical-machine-status-${machine.status.toLowerCase()}`}
                        >
                          {machine.status ===
                          "ACTIVE"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="technical-machine-edit-button"
                          onClick={() =>
                            openEditMachine(
                              machine
                            )
                          }
                        >
                          View / Edit
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>


      {/* ==================================================
          PRODUCT MACHINE ASSIGNMENT
      ================================================== */}

      <div className="technical-reactor-card">

        <div className="technical-reactor-card-header">

          <div>
            <h2>Product Machine Assignment</h2>

            <p>
              Assign one or more reactor machines to each product.
            </p>
          </div>

          <span className="technical-reactor-count">
            {products.length} Products
          </span>

        </div>

        <div className="technical-reactor-toolbar">

          <div className="technical-reactor-search">

            <label htmlFor="product-search">
              Search Products
            </label>

            <input
              id="product-search"
              type="text"
              value={productSearch}
              onChange={(event) =>
                setProductSearch(
                  event.target.value
                )
              }
              placeholder="Search by Product Code or Product Name"
            />

          </div>

        </div>

        <div className="technical-reactor-table-wrapper">

          {filteredProducts.length === 0 ? (
            <div className="technical-reactor-empty">
              No products found.
            </div>
          ) : (
            <table className="technical-reactor-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Assigned Reactor Machines</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => (
                    <tr key={product.id}>

                      <td>
                        <div className="technical-reactor-product-cell">

                          <strong>
                            {product.productCode}
                          </strong>

                          <span>
                            {product.productName}
                          </span>

                        </div>
                      </td>

                      <td>
                        <span className="technical-assigned-machines">
                          {getAssignedMachineNames(
                            product.productCode
                          )}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="technical-machine-edit-button"
                          onClick={() =>
                            openAssignmentModal(
                              product.productCode
                            )
                          }
                        >
                          Manage
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>


      {/* ==================================================
          ADD / EDIT MACHINE MODAL
      ================================================== */}

      {showMachineModal && (
        <div className="technical-reactor-modal-overlay">

          <div
            className="technical-reactor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="technical-machine-modal-title"
          >

            <div className="technical-reactor-modal-header">

              <div>
                <h2 id="technical-machine-modal-title">
                  {editingMachine
                    ? "Edit Reactor Machine"
                    : "Add Reactor Machine"}
                </h2>

                <p>
                  {editingMachine
                    ? "Update the reactor machine information."
                    : "Add a new reactor machine to the system."}
                </p>
              </div>

              <button
                type="button"
                className="technical-reactor-modal-close"
                onClick={closeMachineModal}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <div className="technical-reactor-modal-body">

              <div className="technical-reactor-field">

                <label htmlFor="machine-name">
                  Reactor Machine
                </label>

                <input
                  id="machine-name"
                  type="text"
                  value={machineName}
                  onChange={(event) =>
                    setMachineName(
                      event.target.value
                    )
                  }
                  placeholder="Enter Reactor Machine"
                />

              </div>

              <div className="technical-reactor-field">

                <label htmlFor="machine-status">
                  Status
                </label>

                <select
                  id="machine-status"
                  value={machineStatus}
                  onChange={(event) =>
                    setMachineStatus(
                      event.target
                        .value as
                        | "ACTIVE"
                        | "INACTIVE"
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

            <div className="technical-reactor-modal-actions">

              <button
                type="button"
                className="technical-reactor-cancel-button"
                onClick={closeMachineModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="technical-reactor-save-button"
                onClick={handleSaveMachine}
              >
                {editingMachine
                  ? "Save Changes"
                  : "Save Machine"}
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ==================================================
          PRODUCT ASSIGNMENT MODAL
      ================================================== */}

      {showAssignmentModal &&
        selectedProduct && (
          <div className="technical-reactor-modal-overlay">

            <div
              className="technical-reactor-assignment-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="technical-assignment-modal-title"
            >

              <div className="technical-reactor-modal-header">

                <div>
                  <h2 id="technical-assignment-modal-title">
                    Assign Reactor Machines
                  </h2>

                  <p>
                    {selectedProduct.productCode} -{" "}
                    {selectedProduct.productName}
                  </p>
                </div>

                <button
                  type="button"
                  className="technical-reactor-modal-close"
                  onClick={
                    closeAssignmentModal
                  }
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

              <div className="technical-reactor-assignment-body">

                <div className="technical-reactor-assignment-info">
                  Select one or more active reactor machines that
                  can be used for this product.
                </div>

                <div className="technical-reactor-machine-options">

                  {machines
                    .filter(
                      (machine) =>
                        machine.status ===
                        "ACTIVE"
                    )
                    .map((machine) => {

                      const isSelected =
                        selectedMachineIds.includes(
                          machine.id
                        );

                      return (
                        <label
                          key={machine.id}
                          className={`technical-machine-option ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                        >

                          <input
                            type="checkbox"
                            checked={
                              isSelected
                            }
                            onChange={() =>
                              toggleMachineAssignment(
                                machine.id
                              )
                            }
                          />

                          <span>
                            {machine.machineName}
                          </span>

                        </label>
                      );
                    })}

                </div>

              </div>

              <div className="technical-reactor-modal-actions">

                <button
                  type="button"
                  className="technical-reactor-cancel-button"
                  onClick={
                    closeAssignmentModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="technical-reactor-save-button"
                  onClick={
                    handleSaveAssignment
                  }
                >
                  Save Assignment
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default TechnicalReactorMachines;