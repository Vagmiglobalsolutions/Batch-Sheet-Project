import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  initialTechnicalFormConfigs,
  type TechnicalFormConfig,
  type TechnicalFormField,
  type TechnicalFormSection,
} from "../../data/technicalData";
import "./RequestEdit.css";

type EditStatus = "PENDING" | "APPROVED" | "REJECTED" | "EDITED_RESUBMITTED";
type FieldValue = string | number | boolean;
type FormValues = Record<string, FieldValue>;
type StageValues = Record<string, FormValues>;

interface EditRequest {
  id: number;
  productCode: string;
  productName: string;
  lastStageLotNumber: string;
  requestedAt: string;
  reason: string;
  status: EditStatus;
  batchNumber?: string;
  batchFile?: string;
  stageValues?: StageValues;
}

interface ProductionRecord {
  id: number;
  productCode: string;
  productName: string;
  lastStageLotNumber: string;
  status: "COMPLETED";
}

const STAGE_NAMES: Record<string, string> = {
  REACTION: "Reaction",
  WASHING: "Washing",
  RECOVERY: "Recovery",
  DISTILLATION: "Distillation",
  BLENDING: "Blending",
  PACKAGING: "Packaging",
  CENTRIFUGE: "Centrifuge",
  FBD: "FBD",
};


const cloneConfig = (config: TechnicalFormConfig): TechnicalFormConfig => ({
  ...config,
  sections: config.sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => ({
      ...field,
      options: [...(field.options ?? [])],
    })),
    tableColumns: section.tableColumns?.map((column) => ({
      ...column,
      options: [...(column.options ?? [])],
    })),
  })),
});

const getProductionConfigs = (productCode: string) =>
  initialTechnicalFormConfigs
    .filter(
      (config) =>
        config.productCode === productCode &&
        config.formType === "PRODUCTION" &&
        config.scope === "PRODUCT_STAGE" &&
        config.status === "PUBLISHED"
    )
    .sort((a, b) => {
      const aIndex = Object.keys(STAGE_NAMES).indexOf(a.stageId);
      const bIndex = Object.keys(STAGE_NAMES).indexOf(b.stageId);
      return aIndex - bIndex;
    })
    .map(cloneConfig);

const defaultValueForField = (field: TechnicalFormField, seed: number): FieldValue => {
  if (field.type === "checkbox") return false;
  if (field.type === "number") return seed;
  if (field.type === "select" || field.type === "radio") return field.options?.[0] ?? "";
  if (field.type === "date") return "2026-09-18";
  if (field.type === "time") return "10:30";
  return `Existing ${field.label} value`;
};

const buildMockStageValues = (productCode: string): StageValues => {
  const values: StageValues = {};
  const configs = getProductionConfigs(productCode);

  configs.forEach((config, configIndex) => {
    const stageValues: FormValues = {};
    let fieldIndex = 0;

    config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        stageValues[field.fieldKey] = defaultValueForField(
          field,
          configIndex + fieldIndex + 1
        );
        fieldIndex += 1;
      });
    });

    values[config.stageId] = stageValues;
  });

  return values;
};

const formatDateTime = () => {
  const now = new Date();
  return `${now.toLocaleDateString("en-GB")} ${now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const RequestEdit = () => {
  const navigate = useNavigate();

  const [editRequests, setEditRequests] = useState<EditRequest[]>([
    {
      id: 1,
      productCode: "PROD001",
      productName: "Product A",
      lastStageLotNumber: "FBD-000001",
      requestedAt: "06/09/2026 10:30 AM",
      reason: "Incorrect quantity entered in the completed production record.",
      status: "PENDING",
    },
    {
      id: 2,
      productCode: "PROD002",
      productName: "Product B",
      lastStageLotNumber: "PK-000002",
      requestedAt: "06/09/2026 09:15 AM",
      reason: "Correction required in the submitted process details.",
      status: "APPROVED",
      batchNumber: "BS-2026-0002",
      batchFile: "BatchSheet_BS-2026-0002.xlsx",
      stageValues: buildMockStageValues("PROD002"),
    },
    {
      id: 3,
      productCode: "PROD003",
      productName: "Product C",
      lastStageLotNumber: "DST-000003",
      requestedAt: "05/09/2026 04:40 PM",
      reason: "Wrong information entered during submission.",
      status: "REJECTED",
    },
  ]);

  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedProductionRecord, setSelectedProductionRecord] = useState<ProductionRecord | null>(null);
  const [newRequestRecordId, setNewRequestRecordId] = useState("");
  const [newRequestReason, setNewRequestReason] = useState("");
  const [newRequestAttachment, setNewRequestAttachment] = useState<File | null>(null);
  const [newRequestRecordError, setNewRequestRecordError] = useState("");
  const [newRequestReasonError, setNewRequestReasonError] = useState("");
  const [showNewRequestConfirmation, setShowNewRequestConfirmation] = useState(false);
  const [isSubmittingNewRequest, setIsSubmittingNewRequest] = useState(false);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EditRequest | null>(null);
  const [reason, setReason] = useState("");
  const [stageValues, setStageValues] = useState<StageValues>({});
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [isSubmittingUpdatedBatch, setIsSubmittingUpdatedBatch] = useState(false);

  const submittedProductionRecords: ProductionRecord[] = useMemo(
    () => [
      {
        id: 101,
        productCode: "PROD001",
        productName: "Product A",
        lastStageLotNumber: "FBD-000001",
        status: "COMPLETED",
      },
      {
        id: 102,
        productCode: "PROD002",
        productName: "Product B",
        lastStageLotNumber: "PK-000002",
        status: "COMPLETED",
      },
      {
        id: 103,
        productCode: "PROD003",
        productName: "Product C",
        lastStageLotNumber: "DST-000003",
        status: "COMPLETED",
      },
      {
        id: 104,
        productCode: "PROD004",
        productName: "Product D",
        lastStageLotNumber: "CB-000004",
        status: "COMPLETED",
      },
    ],
    []
  );

  const availableRequests = editRequests;

  const handleOpenNewRequestForm = () => {
    setShowNewRequestForm(true);
    setSelectedProductionRecord(null);
    setNewRequestRecordId("");
    setNewRequestReason("");
    setNewRequestAttachment(null);
    setNewRequestRecordError("");
    setNewRequestReasonError("");
  };

  const handleCloseNewRequestForm = () => {
    if (isSubmittingNewRequest) return;
    setShowNewRequestForm(false);
    setSelectedProductionRecord(null);
    setNewRequestRecordId("");
    setNewRequestReason("");
    setNewRequestAttachment(null);
    setNewRequestRecordError("");
    setNewRequestReasonError("");
  };

  const handleNewRequestRecordChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const recordId = event.target.value;
    setNewRequestRecordId(recordId);
    const record = submittedProductionRecords.find((item) => String(item.id) === recordId) ?? null;
    setSelectedProductionRecord(record);
    if (recordId) setNewRequestRecordError("");
  };

  const handleNewRequestReasonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNewRequestReason(value);
    if (value.trim()) setNewRequestReasonError("");
  };

  const handleNewRequestAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewRequestAttachment(event.target.files?.[0] ?? null);
  };

  const handleRemoveNewRequestAttachment = () => setNewRequestAttachment(null);

  const validateNewRequest = () => {
    let valid = true;

    if (!newRequestRecordId) {
      setNewRequestRecordError("Please select the completed production record.");
      valid = false;
    }

    if (!newRequestReason.trim()) {
      setNewRequestReasonError("Reason is required for an edit request.");
      valid = false;
    }

    return valid;
  };

  const handleSendNewRequest = () => {
    if (!validateNewRequest()) return;
    setShowNewRequestConfirmation(true);
  };

  const handleCancelNewRequestConfirmation = () => {
    if (isSubmittingNewRequest) return;
    setShowNewRequestConfirmation(false);
  };

  const handleConfirmNewRequest = () => {
    if (!selectedProductionRecord) return;

    setIsSubmittingNewRequest(true);

    window.setTimeout(() => {
      const newEditRequest: EditRequest = {
        id:
          editRequests.length > 0
            ? Math.max(...editRequests.map((request) => request.id)) + 1
            : 1,
        productCode: selectedProductionRecord.productCode,
        productName: selectedProductionRecord.productName,
        lastStageLotNumber: selectedProductionRecord.lastStageLotNumber,
        requestedAt: formatDateTime(),
        reason: newRequestReason.trim(),
        status: "PENDING",
      };

      setEditRequests((currentRequests) => [newEditRequest, ...currentRequests]);
      setIsSubmittingNewRequest(false);
      setShowNewRequestConfirmation(false);
      handleCloseNewRequestForm();
    }, 700);
  };

  const handleOpenRequestForm = (request: EditRequest) => {
    if (request.status !== "APPROVED") return;

    const configs = getProductionConfigs(request.productCode);
    const initialValues = request.stageValues ?? buildMockStageValues(request.productCode);

    setSelectedRequest(request);
    setReason(request.reason);
    setStageValues(initialValues);
    setExpandedStages(
      configs.reduce<Record<string, boolean>>((accumulator, config, index) => {
        accumulator[config.stageId] = index === 0;
        return accumulator;
      }, {})
    );
    setShowRequestForm(true);
  };

  const handleCloseRequestForm = () => {
    if (isSubmittingUpdatedBatch) return;
    setShowRequestForm(false);
    setSelectedRequest(null);
    setReason("");
    setStageValues({});
    setExpandedStages({});
  };

  const updateFieldValue = (stageId: string, fieldKey: string, value: FieldValue) => {
    setStageValues((current) => ({
      ...current,
      [stageId]: {
        ...(current[stageId] ?? {}),
        [fieldKey]: value,
      },
    }));
  };

  const toggleStage = (stageId: string) => {
    setExpandedStages((current) => ({
      ...current,
      [stageId]: !current[stageId],
    }));
  };

  const renderEditableField = (
    stageId: string,
    field: TechnicalFormField,
    value: FieldValue | undefined,
    rowIndex?: number
  ) => {
    const actualFieldKey = rowIndex === undefined ? field.fieldKey : `${field.fieldKey}__row_${rowIndex}`;
    const currentValue = value ?? "";
    const setValue = (nextValue: FieldValue) => updateFieldValue(stageId, actualFieldKey, nextValue);

    if (field.type === "textarea") {
      return (
        <textarea
          value={String(currentValue)}
          rows={3}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          value={String(currentValue)}
          onChange={(event) => setValue(event.target.value)}
        >
          <option value="">Select {field.label}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (field.type === "radio") {
      return (
        <div className="production-edit-radio-group">
          {(field.options ?? []).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={`${stageId}-${actualFieldKey}`}
                value={option}
                checked={String(currentValue) === option}
                onChange={() => setValue(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label className="production-edit-checkbox">
          <input
            type="checkbox"
            checked={Boolean(currentValue)}
            onChange={(event) => setValue(event.target.checked)}
          />
          <span>{field.label}</span>
        </label>
      );
    }

    return (
      <input
        type={field.type}
        value={String(currentValue)}
        onChange={(event) => {
          const nextValue = field.type === "number" ? Number(event.target.value) : event.target.value;
          setValue(nextValue);
        }}
      />
    );
  };

  const renderSection = (stageId: string, section: TechnicalFormSection) => {
    const values = stageValues[stageId] ?? {};
    const rowCount = section.repeatable ? Math.max(2, section.fields.length ? 2 : 1) : 1;

    if (section.tableLayout) {
      return (
        <div className="production-edit-section" key={section.id}>
          <div className="production-edit-section-title">
            <div>
              <h4>{section.title}</h4>
              {section.repeatable && <span>Repeatable</span>}
            </div>
          </div>

          <div className="production-edit-table-scroll">
            <table className="production-edit-table">
              <thead>
                <tr>
                  {section.tableColumns?.length ? (
                    section.tableColumns.map((column) => (
                      <th key={column.id}>{column.label}</th>
                    ))
                  ) : (
                    section.fields.map((field) => (
                      <th key={field.id}>{field.label}</th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                  <tr key={`${section.id}-row-${rowIndex}`}>
                    {(section.tableColumns?.length ? section.tableColumns : section.fields).map((column) => {
                      const field = section.fields.find((item) => item.fieldKey === column.fieldKey) ?? column;
                      const key = `${field.fieldKey}__row_${rowIndex}`;
                      return (
                        <td key={column.id}>
                          {renderEditableField(stageId, field, values[key], rowIndex)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="production-edit-section" key={section.id}>
        <div className="production-edit-section-title">
          <div>
            <h4>{section.title}</h4>
            {section.repeatable && <span>Repeatable</span>}
          </div>
        </div>

        <div className="production-edit-fields-grid">
          {section.fields.map((field) => (
            <div
              className={`production-edit-field ${field.type === "textarea" ? "production-edit-field-wide" : ""}`}
              key={field.id}
            >
              {field.type !== "checkbox" && (
                <label>
                  {field.label}
                  {field.required && <span className="required-mark">*</span>}
                </label>
              )}
              {renderEditableField(stageId, field, values[field.fieldKey])}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStageForm = (config: TechnicalFormConfig) => (
    <div className="production-edit-stage" key={config.stageId}>
      <button
        type="button"
        className="production-edit-stage-header"
        onClick={() => toggleStage(config.stageId)}
        aria-expanded={Boolean(expandedStages[config.stageId])}
      >
        <div>
          <span className="production-edit-stage-number">
            {config.stageId}
          </span>
          <strong>{config.stageName}</strong>
        </div>
        <span className="production-edit-stage-chevron">
          {expandedStages[config.stageId] ? "−" : "+"}
        </span>
      </button>

      {expandedStages[config.stageId] && (
        <div className="production-edit-stage-body">
          {config.sections.map((section) => renderSection(config.stageId, section))}
        </div>
      )}
    </div>
  );

  const handleSubmitUpdatedReport = () => {
    if (!selectedRequest) return;

    setIsSubmittingUpdatedBatch(true);

    window.setTimeout(() => {
      setEditRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                stageValues,
                status: "EDITED_RESUBMITTED",
              }
            : request
        )
      );

      setIsSubmittingUpdatedBatch(false);
      handleCloseRequestForm();
    }, 700);
  };

  const getStatusClass = (status: EditStatus) =>
    `request-status request-status-${status.toLowerCase()}`;

  const approvedConfigs = selectedRequest
    ? getProductionConfigs(selectedRequest.productCode)
    : [];

  return (
    <div className="request-edit-page">
      <div className="request-edit-header">
        <div>
          <h1>Request Edit</h1>
          <p>Request correction of a completed production batch.</p>
        </div>

        <button
          type="button"
          className="request-edit-back-button"
          onClick={() => navigate("/production")}
        >
          Back
        </button>
      </div>

      <div className="request-edit-info-card">
        <div className="request-edit-info-title">
          Edit Request Information
        </div>
        <p>
          Select a completed production record and provide the reason for correction.
          The selected record's last-stage lot number is used by Admin to locate the
          existing Batch Sheet.
        </p>
      </div>

      <div className="request-edit-card">
        <div className="request-edit-card-header">
          <div>
            <h2>Edit Requests</h2>
            <p>View the status of your submitted edit requests.</p>
          </div>

          <div className="request-edit-header-actions">
            <span className="request-edit-count">
              {availableRequests.length} Requests
            </span>
            <button
              type="button"
              className="request-edit-new-button"
              onClick={handleOpenNewRequestForm}
            >
              + Request Edit
            </button>
          </div>
        </div>

        <div className="request-edit-table-wrapper">
          <table className="request-edit-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Last Stage Lot No.</th>
                <th>Requested At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="request-product">
                      <strong>{request.productCode}</strong>
                      <span>{request.productName}</span>
                    </div>
                  </td>
                  <td>{request.lastStageLotNumber}</td>
                  <td>{request.requestedAt}</td>
                  <td>
                    <span className={getStatusClass(request.status)}>
                      {request.status === "PENDING" && "Pending Admin"}
                      {request.status === "APPROVED" && "Edit Approved"}
                      {request.status === "REJECTED" && "Rejected"}
                      {request.status === "EDITED_RESUBMITTED" && "Edited & Resubmitted"}
                    </span>
                  </td>
                  <td>
                    {request.status === "APPROVED" ? (
                      <button
                        type="button"
                        className="edit-batch-button"
                        onClick={() => handleOpenRequestForm(request)}
                      >
                        Edit Batch Sheet
                      </button>
                    ) : request.status === "PENDING" ? (
                      <span className="request-action-muted">Awaiting approval</span>
                    ) : request.status === "EDITED_RESUBMITTED" ? (
                      <span className="request-action-muted">Submitted to Admin for review</span>
                    ) : (
                      <span className="request-action-muted">No action available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNewRequestForm && (
        <div className="new-request-overlay">
          <div className="new-request-modal" role="dialog" aria-modal="true">
            <div className="new-request-header">
              <div>
                <h2>Request Edit Access</h2>
                <p>Select the completed production record that requires correction.</p>
              </div>
              <button
                type="button"
                className="new-request-close"
                onClick={handleCloseNewRequestForm}
                disabled={isSubmittingNewRequest}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="new-request-body">
              <div className="new-request-field">
                <label htmlFor="new-request-record">
                  Production Record <span className="required-mark">*</span>
                </label>
                <select
                  id="new-request-record"
                  value={newRequestRecordId}
                  onChange={handleNewRequestRecordChange}
                  className={newRequestRecordError ? "new-request-input-error" : ""}
                >
                  <option value="">Select Completed Production Record</option>
                  {submittedProductionRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.productCode} - {record.productName} - Last Stage Lot: {record.lastStageLotNumber}
                    </option>
                  ))}
                </select>
                {newRequestRecordError && (
                  <span className="new-request-error">{newRequestRecordError}</span>
                )}
              </div>

              {selectedProductionRecord && (
                <div className="new-request-record-card">
                  <div className="new-request-record-title">Selected Completed Record</div>
                  <div className="new-request-record-grid">
                    <div>
                      <span>Product Code</span>
                      <strong>{selectedProductionRecord.productCode}</strong>
                    </div>
                    <div>
                      <span>Product Name</span>
                      <strong>{selectedProductionRecord.productName}</strong>
                    </div>
                    <div>
                      <span>Record Status</span>
                      <strong>Completed</strong>
                    </div>
                    <div>
                      <span>Last Stage Lot Number</span>
                      <strong>{selectedProductionRecord.lastStageLotNumber}</strong>
                    </div>
                  </div>
                  <div className="new-request-record-note">
                    This last-stage lot number will be used by Admin to find the existing
                    Batch Sheet. You do not need to enter a Batch Number.
                  </div>
                </div>
              )}

              <div className="new-request-field">
                <label htmlFor="new-request-reason">
                  Reason <span className="required-mark">*</span>
                </label>
                <textarea
                  id="new-request-reason"
                  value={newRequestReason}
                  onChange={handleNewRequestReasonChange}
                  rows={5}
                  placeholder="Enter the reason for requesting this correction"
                  className={newRequestReasonError ? "new-request-input-error" : ""}
                />
                {newRequestReasonError && (
                  <span className="new-request-error">{newRequestReasonError}</span>
                )}
              </div>

              <div className="new-request-field">
                <label htmlFor="new-request-attachment">
                  Attachment <span className="optional-label">Optional</span>
                </label>
                <div className="new-request-file-box">
                  <input
                    id="new-request-attachment"
                    type="file"
                    onChange={handleNewRequestAttachmentChange}
                  />
                </div>
                {newRequestAttachment && (
                  <div className="new-request-file-selected">
                    <span>{newRequestAttachment.name}</span>
                    <button type="button" onClick={handleRemoveNewRequestAttachment}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="new-request-actions">
              <button
                type="button"
                className="new-request-cancel"
                onClick={handleCloseNewRequestForm}
                disabled={isSubmittingNewRequest}
              >
                Cancel
              </button>
              <button
                type="button"
                className="new-request-submit"
                onClick={handleSendNewRequest}
                disabled={isSubmittingNewRequest}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewRequestConfirmation && selectedProductionRecord && (
        <div className="new-request-overlay">
          <div className="new-request-confirm-modal" role="dialog" aria-modal="true">
            <div className="new-request-confirm-content">
              <h2>Confirm Edit Request</h2>
              <p>
                You are requesting permission to correct the completed production
                record with last-stage lot number
                <strong> {selectedProductionRecord.lastStageLotNumber}</strong>.
              </p>
              <p>
                The request will be sent to Admin. Admin will use this last-stage lot
                number to find the existing Batch Sheet and its Batch Number.
              </p>
            </div>
            <div className="new-request-confirm-actions">
              <button
                type="button"
                className="new-request-cancel"
                onClick={handleCancelNewRequestConfirmation}
                disabled={isSubmittingNewRequest}
              >
                Cancel
              </button>
              <button
                type="button"
                className="new-request-submit"
                onClick={handleConfirmNewRequest}
                disabled={isSubmittingNewRequest}
              >
                {isSubmittingNewRequest ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRequestForm && selectedRequest && (
        <div className="edit-batch-overlay">
          <div className="edit-batch-modal production-full-edit-modal">
            <div className="edit-batch-header">
              <div>
                <h2>Edit Batch Sheet</h2>
                <p>
                  Correct the existing production batch and submit the updated batch to Admin.
                </p>
              </div>
              <button
                type="button"
                className="edit-batch-close"
                onClick={handleCloseRequestForm}
                disabled={isSubmittingUpdatedBatch}
              >
                ×
              </button>
            </div>

            <div className="production-edit-batch-summary">
              <div>
                <span>Batch Number</span>
                <strong>{selectedRequest.batchNumber ?? "Assigned Batch Number"}</strong>
              </div>
              <div>
                <span>Product</span>
                <strong>{selectedRequest.productName}</strong>
              </div>
              <div>
                <span>Product Code</span>
                <strong>{selectedRequest.productCode}</strong>
              </div>
              <div>
                <span>Last Stage Lot Number</span>
                <strong>{selectedRequest.lastStageLotNumber}</strong>
              </div>
            </div>

            <div className="production-edit-notice">
              <strong>Admin approved edit access.</strong>
              <span>
                The existing production data is prefilled below. Edit only the information
                that requires correction. QA/QC-entered fields are not displayed here.
              </span>
            </div>

            <div className="production-edit-history-note">
              Original completed batch history is preserved. This submission creates an
              updated version for Admin review; it does not silently overwrite the original record.
            </div>

            <div className="production-edit-form-body">
              {approvedConfigs.length > 0 ? (
                approvedConfigs.map(renderStageForm)
              ) : (
                <div className="production-edit-empty-form">
                  No published Production form configuration was found for this product.
                </div>
              )}
            </div>

            <div className="production-edit-reason-section">
              <label htmlFor="approved-edit-reason">Original Edit Request Reason</label>
              <textarea
                id="approved-edit-reason"
                value={reason}
                readOnly
                rows={3}
              />
            </div>

            <div className="edit-batch-actions production-edit-actions">
              <button
                type="button"
                className="edit-batch-cancel"
                onClick={handleCloseRequestForm}
                disabled={isSubmittingUpdatedBatch}
              >
                Cancel
              </button>
              <button
                type="button"
                className="edit-batch-submit"
                onClick={handleSubmitUpdatedReport}
                disabled={isSubmittingUpdatedBatch}
              >
                {isSubmittingUpdatedBatch ? "Submitting..." : "Submit Updated Batch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestEdit;