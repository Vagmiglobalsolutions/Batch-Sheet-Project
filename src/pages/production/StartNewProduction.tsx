import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StartNewProduction.css";

interface Operator {
  name: string;
  empId: string;
}

interface Product {
  code: string;
  name: string;
  machines: string[];
  operators: Operator[];
  formatNo: string;
}

interface ProductionDetails {
  productCode: string;
  productName: string;
  machineCode: string;
  operatorName: string;
  operatorEmpId: string;
  formatNo: string;
  date: string;
}

const products: Product[] = [
  {
    code: "PRD-001",
    name: "Product 1",
    machines: ["M-01", "M-04", "M-05"],
    operators: [
      { name: "Rahul Kumar", empId: "EMP001" },
      { name: "Amit Sharma", empId: "EMP002" },
      { name: "Priya Singh", empId: "EMP003" },
    ],
    formatNo: "FMT-001",
  },
  {
    code: "PRD-002",
    name: "Product 2",
    machines: ["M-02", "M-06", "M-08"],
    operators: [
      { name: "Sneha Patil", empId: "EMP004" },
      { name: "Arjun Kumar", empId: "EMP005" },
      { name: "Rahul Kumar", empId: "EMP001" },
    ],
    formatNo: "FMT-002",
  },
  {
    code: "PRD-003",
    name: "Product 3",
    machines: ["M-01", "M-03", "M-07"],
    operators: [
      { name: "Kavya Rao", empId: "EMP006" },
      { name: "Rohit Sharma", empId: "EMP007" },
      { name: "Priya Singh", empId: "EMP003" },
    ],
    formatNo: "FMT-003",
  },
];

const StartNewProduction = () => {
  const navigate = useNavigate();

  const [productCode, setProductCode] = useState("");
  const [machineCode, setMachineCode] = useState("");

  const [operatorName, setOperatorName] = useState("");
  const [operatorEmpId, setOperatorEmpId] = useState("");
  const [operatorSearch, setOperatorSearch] = useState("");
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);

  const [formatNo, setFormatNo] = useState("");
  const [date, setDate] = useState("");

  const selectedProduct = products.find(
    (product) => product.code === productCode
  );

  const filteredOperators = useMemo(() => {
    if (!selectedProduct) {
      return [];
    }

    const search = operatorSearch.trim().toLowerCase();

    if (!search) {
      return selectedProduct.operators;
    }

    return selectedProduct.operators.filter(
      (operator) =>
        operator.name.toLowerCase().includes(search) ||
        operator.empId.toLowerCase().includes(search)
    );
  }, [selectedProduct, operatorSearch]);

  const handleProductChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;

    setProductCode(value);
    setMachineCode("");

    setOperatorName("");
    setOperatorEmpId("");
    setOperatorSearch("");
    setShowOperatorDropdown(false);

    const product = products.find((item) => item.code === value);

    setFormatNo(product?.formatNo || "");
  };

  const handleOperatorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setOperatorSearch(value);
    setOperatorName("");
    setOperatorEmpId("");
    setShowOperatorDropdown(true);
  };

  const handleOperatorSelect = (operator: Operator) => {
    setOperatorName(operator.name);
    setOperatorEmpId(operator.empId);

    setOperatorSearch(`${operator.name} - ${operator.empId}`);
    setShowOperatorDropdown(false);
  };

  const handleNext = () => {
    const productionDetails: ProductionDetails = {
      productCode,
      productName: selectedProduct?.name || "",
      machineCode,
      operatorName,
      operatorEmpId,
      formatNo,
      date,
    };

    navigate("/production/select-stage", {
      state: {
        productionDetails,
        stageLots: {},
        fromNextStages: false,
      },
    });
  };

  return (
    <div className="start-production-page">
      <div className="start-production-header">
        <div>
          <h1>Start New Production</h1>
          <p>Enter the production details to begin a new batch.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/production")}
        >
          Back
        </button>
      </div>

      <div className="production-form-card">
        <div className="form-section-title">Production Information</div>

        <div className="production-form-grid">
          {/* Product */}
          <div className="production-form-group">
            <label htmlFor="product">Product</label>

            <select
              id="product"
              value={productCode}
              onChange={handleProductChange}
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product.code} value={product.code}>
                  {product.name} - {product.code}
                </option>
              ))}
            </select>
          </div>

          {/* Reactor Machine */}
          <div className="production-form-group">
            <label htmlFor="machine">Reactor Machine</label>

            <select
              id="machine"
              value={machineCode}
              onChange={(event) => setMachineCode(event.target.value)}
              disabled={!selectedProduct}
            >
              <option value="">Select Machine</option>

              {selectedProduct?.machines.map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
          </div>

          {/* Operator */}
          <div className="production-form-group operator-field-group">
            <label htmlFor="operator">Operator</label>

            <div className="operator-select-wrapper">
              <input
                id="operator"
                type="text"
                value={operatorSearch}
                onChange={handleOperatorChange}
                onFocus={() => {
                  if (selectedProduct) {
                    setShowOperatorDropdown(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowOperatorDropdown(false);
                  }, 150);
                }}
                placeholder={
                  selectedProduct
                    ? "Search operator by name or Emp ID"
                    : "Select Product first"
                }
                disabled={!selectedProduct}
                autoComplete="off"
              />

              {showOperatorDropdown && selectedProduct && (
                <div className="operator-dropdown">
                  {filteredOperators.length > 0 ? (
                    filteredOperators.map((operator) => (
                      <button
                        key={operator.empId}
                        type="button"
                        className="operator-option"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleOperatorSelect(operator)}
                      >
                        {operator.name} - {operator.empId}
                      </button>
                    ))
                  ) : (
                    <div className="operator-no-results">
                      No matching operator found
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="field-hint">
              Only operators assigned to this product are available.
            </span>
          </div>

          {/* Format */}
          <div className="production-form-group">
            <label htmlFor="format">Format No.</label>

            <input
              id="format"
              type="text"
              value={formatNo}
              readOnly
              disabled={!selectedProduct}
              placeholder="Automatically populated"
            />

            <span className="field-hint">
              Format No. is automatically assigned for the selected product.
            </span>
          </div>

          {/* Date */}
          <div className="production-form-group">
            <label htmlFor="date">Date</label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </div>

        <div className="form-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/production")}
          >
            Back
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartNewProduction;