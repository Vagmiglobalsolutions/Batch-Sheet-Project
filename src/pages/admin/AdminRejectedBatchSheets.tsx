import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminRejectedBatchSheets.css";

import {
  initialTechnicalFormConfigs,
  type TechnicalFormConfig,
  type TechnicalFormField,
  type TechnicalFormSection,
} from "../../data/technicalData";

import { useProductData } from "../../context/ProductContext";

type BatchSheetStatus =
  | "Rejected"
  | "Under Review"

type QAStatus = "Approved" | "Hold" | "Rejected";

type FieldValue =
  | string
  | number
  | boolean
  | null
  | undefined;

type FormValues = Record<string, FieldValue>;

interface RepeatableRow {
  id: string;
  values: FormValues;
}

interface StageRecord {
  id: string;
  stageId: string;
  stageName: string;
  occurrence: number;
  lotNumber: string;
  submittedAt: string;

  productionValues: FormValues;

  productionRepeatableValues: Record<
    string,
    RepeatableRow[]
  >;

  qaValues: FormValues;

  qaRepeatableValues: Record<
    string,
    RepeatableRow[]
  >;

  qaStatus: QAStatus;
}

interface BatchSheet {
  id: string;
  batchSheetNumber: string;
  productCode: string;
  productName: string;
  status: BatchSheetStatus;
  generatedAt: string;
  stages: StageRecord[];
  rejectionReason: string;
  rejectedStage: string;
  rejectedAt: string;
}

/*
 * ============================================================
 * FORM CONFIG
 * ============================================================
 */

const getFormConfig = (
  productCode: string,
  stageId: string,
  formType: "PRODUCTION" | "QA_QC"
): TechnicalFormConfig | undefined => {
  if (formType === "QA_QC") {
    return initialTechnicalFormConfigs.find(
      (config) =>
        config.productCode === "__GLOBAL__" &&
        config.stageId === "QA_QC" &&
        config.formType === "QA_QC"
    );
  }

  return initialTechnicalFormConfigs.find(
    (config) =>
      config.productCode === productCode &&
      config.stageId === stageId &&
      config.formType === "PRODUCTION" &&
      config.status === "PUBLISHED"
  );
};

/*
 * ============================================================
 * PRODUCT DISPLAY
 * ============================================================
 */

const getProductDisplayName = (
  productName: string,
  productCode: string
): string => {
  return `${productName} - ${productCode}`;
};

/*
 * ============================================================
 * FIELD DEFAULT VALUE
 * ============================================================
 */

const getFieldDefaultValue = (
  field: TechnicalFormField,
  productName: string,
  productCode: string,
  stageName: string,
  lotNumber: string
): FieldValue => {
  const key = field.fieldKey.toLowerCase();
  const label = field.label.toLowerCase();

  if (
    key === "productname" ||
    label === "product name"
  ) {
    return productName;
  }

  if (
    key === "productcode" ||
    label === "product code"
  ) {
    return productCode;
  }

  if (
    key === "processstage" ||
    label === "process stage"
  ) {
    return stageName;
  }

  if (
    key === "lotnumber" ||
    key.includes("lotnumber") ||
    key.includes("lotno")
  ) {
    return lotNumber;
  }

  if (
    key === "operator" ||
    key === "operatorname"
  ) {
    return "Rahul - EMP001";
  }

  if (key === "employeeid") {
    return "EMP001";
  }

  if (
    key === "checkedby" ||
    key === "checkedbyname"
  ) {
    return "QA Employee";
  }

  if (
    key === "approvedby" ||
    key === "approvedbyname"
  ) {
    return "QA Employee";
  }

  if (
    key === "date" ||
    key.includes("date") ||
    label.includes("inspection date")
  ) {
    return "12-09-2026";
  }

  /*
   * Time fields are identified through fieldKey.
   * "time" is NOT used as a TechnicalFormField type.
   */
  if (key.includes("time")) {
    return "10:30";
  }

  if (
    key === "decision" ||
    key === "qadecision" ||
    key === "qaqcdecision"
  ) {
    return "Approved";
  }

  if (
    key === "qaqcremarks" ||
    key === "remarks"
  ) {
    return "Approved after inspection.";
  }

  if (key === "rejectionreason") {
    return "";
  }

  switch (field.type) {
    case "number":
      if (label.includes("yield")) {
        return 95;
      }

      if (label.includes("purity")) {
        return 98.5;
      }

      if (label.includes("quantity")) {
        return 100;
      }

      return 10;

    case "checkbox":
      return true;

    case "radio":
      return field.options?.[0] ?? "Approved";

    case "select":
      return field.options?.[0] ?? "Recorded";

    case "textarea":
      if (label.includes("deviation")) {
        return "No deviations reported.";
      }

      if (label.includes("remark")) {
        return "Recorded and reviewed.";
      }

      return "Recorded.";

    case "date":
      return "12-09-2026";

    case "text":
    default:
      return "Recorded";
  }
};

/*
 * ============================================================
 * BUILD FORM VALUES
 * ============================================================
 */

const buildFormValues = (
  config: TechnicalFormConfig,
  productName: string,
  productCode: string,
  stageName: string,
  lotNumber: string
): FormValues => {
  const values: FormValues = {};

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      values[field.fieldKey] =
        getFieldDefaultValue(
          field,
          productName,
          productCode,
          stageName,
          lotNumber
        );
    });

    section.tableColumns?.forEach((column) => {
      if (!(column.fieldKey in values)) {
        values[column.fieldKey] =
          getFieldDefaultValue(
            column,
            productName,
            productCode,
            stageName,
            lotNumber
          );
      }
    });
  });

  return values;
};

/*
 * ============================================================
 * BUILD REPEATABLE VALUES
 * ============================================================
 */

const buildRepeatableRows = (
  config: TechnicalFormConfig,
  productName: string,
  productCode: string,
  stageName: string,
  lotNumber: string
): Record<string, RepeatableRow[]> => {
  const result: Record<
    string,
    RepeatableRow[]
  > = {};

  config.sections.forEach((section) => {
    if (!section.repeatable) {
      return;
    }

    result[section.id] = Array.from(
      { length: 2 },
      (_, index) => {
        const values: FormValues = {};

        section.fields.forEach((field) => {
          values[field.fieldKey] =
            getFieldDefaultValue(
              field,
              productName,
              productCode,
              stageName,
              lotNumber
            );
        });

        section.tableColumns?.forEach(
          (column) => {
            values[column.fieldKey] =
              getFieldDefaultValue(
                column,
                productName,
                productCode,
                stageName,
                lotNumber
              );
          }
        );

        return {
          id: `${section.id}-row-${index + 1}`,
          values,
        };
      }
    );
  });

  return result;
};

/*
 * ============================================================
 * CREATE MOCK STAGE
 * ============================================================
 */

const createMockStage = (
  id: string,
  productCode: string,
  productName: string,
  stageId: string,
  stageName: string,
  occurrence: number,
  lotNumber: string
): StageRecord => {
  const productionConfig =
    getFormConfig(
      productCode,
      stageId,
      "PRODUCTION"
    );

  const qaConfig =
    getFormConfig(
      productCode,
      stageId,
      "QA_QC"
    );

  return {
    id,
    stageId,
    stageName,
    occurrence,
    lotNumber,
    submittedAt: "12-09-2026 15:30",

    productionValues: productionConfig
      ? buildFormValues(
          productionConfig,
          productName,
          productCode,
          stageName,
          lotNumber
        )
      : {},

    productionRepeatableValues:
      productionConfig
        ? buildRepeatableRows(
            productionConfig,
            productName,
            productCode,
            stageName,
            lotNumber
          )
        : {},

    qaValues: qaConfig
      ? buildFormValues(
          qaConfig,
          productName,
          productCode,
          stageName,
          lotNumber
        )
      : {},

    qaRepeatableValues: qaConfig
      ? buildRepeatableRows(
          qaConfig,
          productName,
          productCode,
          stageName,
          lotNumber
        )
      : {},

    qaStatus: "Approved",
  };
};

/*
 * ============================================================
 * INITIAL MOCK DATA
 * ============================================================
 */

const initialBatchSheets: BatchSheet[] = [
  {
    id: "BATCH-001",
    batchSheetNumber: "BS-2026-0001",
    productCode: "PROD001",
    productName: "Product A",
    status: "Rejected",
    generatedAt: "12-09-2026 16:20",
    rejectionReason: "QC inspection result did not meet the approved specification.",
    rejectedStage: "Washing",
    rejectedAt: "12-09-2026 16:20",

    stages: [
      createMockStage(
        "STAGE-001",
        "PROD001",
        "Product A",
        "REACTION",
        "Reaction",
        1,
        "RX-000101"
      ),
      createMockStage(
        "STAGE-002",
        "PROD001",
        "Product A",
        "WASHING",
        "Washing",
        1,
        "WS-000201"
      ),
      createMockStage(
        "STAGE-003",
        "PROD001",
        "Product A",
        "RECOVERY",
        "Recovery",
        1,
        "RC-000301"
      ),
      createMockStage(
        "STAGE-004",
        "PROD001",
        "Product A",
        "DISTILLATION",
        "Distillation",
        1,
        "DS-000401"
      ),
      createMockStage(
        "STAGE-005",
        "PROD001",
        "Product A",
        "BLENDING",
        "Blending",
        1,
        "BL-000501"
      ),
      createMockStage(
        "STAGE-006",
        "PROD001",
        "Product A",
        "PACKAGING",
        "Packaging",
        1,
        "PK-000601"
      ),
      createMockStage(
        "STAGE-007",
        "PROD001",
        "Product A",
        "CENTRIFUGE",
        "Centrifuge",
        1,
        "CF-000701"
      ),
      createMockStage(
        "STAGE-008",
        "PROD001",
        "Product A",
        "FBD",
        "FBD",
        1,
        "FBD-000801"
      ),
    ],
  },

  {
    id: "BATCH-002",
    batchSheetNumber: "BS-2026-0002",
    productCode: "PROD002",
    productName: "Product B",
    status: "Rejected",
    generatedAt: "13-09-2026 14:40",
    rejectionReason: "Process parameter was outside the permitted specification during QA review.",
    rejectedStage: "Distillation",
    rejectedAt: "13-09-2026 14:40",

    stages: [
      createMockStage(
        "STAGE-009",
        "PROD002",
        "Product B",
        "REACTION",
        "Reaction",
        1,
        "RX-000102"
      ),
      createMockStage(
        "STAGE-010",
        "PROD002",
        "Product B",
        "DISTILLATION",
        "Distillation",
        1,
        "DS-000402"
      ),
      createMockStage(
        "STAGE-011",
        "PROD002",
        "Product B",
        "BLENDING",
        "Blending",
        1,
        "BL-000502"
      ),
      createMockStage(
        "STAGE-012",
        "PROD002",
        "Product B",
        "PACKAGING",
        "Packaging",
        1,
        "PK-000602"
      ),
    ],
  },

  {
    id: "BATCH-003",
    batchSheetNumber: "BS-2026-0003",
    productCode: "PROD001",
    productName: "Product A",
    status: "Rejected",
    generatedAt: "14-09-2026 17:05",
    rejectionReason: "Sample failed the QA/QC inspection at the Recovery stage.",
    rejectedStage: "Recovery",
    rejectedAt: "14-09-2026 17:05",

    stages: [
      createMockStage(
        "STAGE-013",
        "PROD001",
        "Product A",
        "REACTION",
        "Reaction",
        1,
        "RX-000103"
      ),
      createMockStage(
        "STAGE-014",
        "PROD001",
        "Product A",
        "WASHING",
        "Washing",
        1,
        "WS-000203"
      ),
      createMockStage(
        "STAGE-015",
        "PROD001",
        "Product A",
        "WASHING",
        "Washing",
        2,
        "WS-000204"
      ),
      createMockStage(
        "STAGE-016",
        "PROD001",
        "Product A",
        "RECOVERY",
        "Recovery",
        1,
        "RC-000303"
      ),
    ],
  },
];

/*
 * ============================================================
 * REJECTED BATCH DATA
 * ============================================================
 */

const rejectionStageIndexes: Record<string, number> = {
  "BATCH-001": 1,
  "BATCH-002": 1,
  "BATCH-003": 2,
};

const initialRejectedBatchSheets: BatchSheet[] =
  initialBatchSheets.map((batch) => {
    const rejectedIndex =
      rejectionStageIndexes[batch.id] ??
      Math.max(batch.stages.length - 1, 0);

    return {
      ...batch,
      id: batch.id.replace("BATCH", "REJECTED"),
      status: "Rejected",
      stages: batch.stages
        .slice(0, rejectedIndex + 1)
        .map((stage, index) => ({
          ...stage,
          qaStatus:
            index === rejectedIndex
              ? "Rejected"
              : "Approved",
        })),
    };
  });

/*
 * ============================================================
 * VALUE DISPLAY
 * ============================================================
 */

const formatValue = (
  value: FieldValue
): string => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

/*
 * ============================================================
 * READ ONLY FIELD
 * ============================================================
 */

interface FieldValueDisplayProps {
  field: TechnicalFormField;
  value: FieldValue;
}

const FieldValueDisplay = ({
  field,
  value,
}: FieldValueDisplayProps) => (
  <div className="admin-batch-field">
    <div className="admin-batch-field-label">
      {field.label}
    </div>

    <div
      className={`admin-batch-field-value ${
        field.type === "textarea"
          ? "admin-batch-field-value-textarea"
          : ""
      }`}
    >
      {formatValue(value)}
    </div>
  </div>
);

/*
 * ============================================================
 * EDITABLE FIELD
 * ============================================================
 */

interface EditableFieldProps {
  field: TechnicalFormField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
}

const EditableField = ({
  field,
  value,
  onChange,
}: EditableFieldProps) => {
  const stringValue =
    typeof value === "string"
      ? value
      : value == null
      ? ""
      : String(value);

  switch (field.type) {
    case "number":
      return (
        <input
          type="number"
          value={
            typeof value === "number"
              ? value
              : ""
          }
          onChange={(event) =>
            onChange(
              event.target.value === ""
                ? ""
                : Number(
                    event.target.value
                  )
            )
          }
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={stringValue}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
        />
      );

    case "select":
      return (
        <select
          value={stringValue}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
        >
          {(field.options ?? []).map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>
      );

    case "radio":
      return (
        <div className="admin-batch-edit-radio-group">
          {(field.options ?? []).map(
            (option) => (
              <label
                key={option}
                className="admin-batch-edit-radio"
              >
                <input
                  type="radio"
                  name={field.fieldKey}
                  value={option}
                  checked={
                    value === option
                  }
                  onChange={() =>
                    onChange(option)
                  }
                />

                <span>{option}</span>
              </label>
            )
          )}
        </div>
      );

    case "checkbox":
      return (
        <label className="admin-batch-edit-checkbox">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(event) =>
              onChange(
                event.target.checked
              )
            }
          />

          <span>{field.label}</span>
        </label>
      );

    case "textarea":
      return (
        <textarea
          value={stringValue}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          rows={4}
        />
      );

    case "text":
    default:
      return (
        <input
          type="text"
          value={stringValue}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
        />
      );
  }
};

/*
 * ============================================================
 * READ ONLY FORM SECTION
 * ============================================================
 */

interface FormSectionProps {
  section: TechnicalFormSection;
  values: FormValues;
  repeatableValues: RepeatableRow[];
}

const FormSection = ({
  section,
  values,
  repeatableValues,
}: FormSectionProps) => (
  <section className="admin-batch-form-section">
    <div className="admin-batch-form-section-header">
      <div>
        <h4>{section.title}</h4>

        {section.repeatable && (
          <span className="admin-batch-repeatable-label">
            Repeatable Section
          </span>
        )}
      </div>
    </div>

    {!section.repeatable && (
      <>
        <div className="admin-batch-fields-grid">
          {section.fields.map((field) => (
            <FieldValueDisplay
              key={field.id}
              field={field}
              value={
                values[field.fieldKey] ??
                null
              }
            />
          ))}
        </div>

        {section.tableColumns &&
          section.tableColumns.length > 0 && (
            <div className="admin-batch-configured-columns">
              <div className="admin-batch-subsection-title">
                Configured Table Columns
              </div>

              <div className="admin-batch-table-wrapper">
                <table className="admin-batch-detail-table">
                  <thead>
                    <tr>
                      {section.tableColumns.map(
                        (column) => (
                          <th key={column.id}>
                            {column.label}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      {section.tableColumns.map(
                        (column) => (
                          <td
                            key={column.id}
                          >
                            {formatValue(
                              values[
                                column.fieldKey
                              ] ?? null
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </>
    )}

    {section.repeatable && (
      <>
        {repeatableValues.length > 0 ? (
          <div className="admin-batch-table-wrapper">
            <table className="admin-batch-detail-table">
              <thead>
                <tr>
                  <th className="admin-batch-row-number">
                    #
                  </th>

                  {section.fields.map(
                    (field) => (
                      <th key={field.id}>
                        {field.label}
                      </th>
                    )
                  )}

                  {section.tableColumns?.map(
                    (column) => (
                      <th
                        key={`column-${column.id}`}
                      >
                        {column.label}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {repeatableValues.map(
                  (row, index) => (
                    <tr key={row.id}>
                      <td className="admin-batch-row-number">
                        {index + 1}
                      </td>

                      {section.fields.map(
                        (field) => (
                          <td key={field.id}>
                            {formatValue(
                              row.values[
                                field.fieldKey
                              ] ?? null
                            )}
                          </td>
                        )
                      )}

                      {section.tableColumns?.map(
                        (column) => (
                          <td
                            key={`column-${column.id}`}
                          >
                            {formatValue(
                              row.values[
                                column.fieldKey
                              ] ?? null
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-batch-no-rows">
            No repeated entries
            recorded.
          </div>
        )}
      </>
    )}
  </section>
);

/*
 * ============================================================
 * COMPLETE FORM
 * ============================================================
 */

interface CompleteFormProps {
  title: string;
  config:
    | TechnicalFormConfig
    | undefined;
  values: FormValues;
  repeatableValues: Record<
    string,
    RepeatableRow[]
  >;
}

const CompleteForm = ({
  title,
  config,
  values,
  repeatableValues,
}: CompleteFormProps) => {
  if (!config) {
    return (
      <div className="admin-batch-form-empty">
        <h4>{title}</h4>

        <p>
          No published form
          configuration is available
          for this stage.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-batch-complete-form">
      <div className="admin-batch-complete-form-header">
        <div>
          <h3>{title}</h3>

          <p>
            Complete submitted form
          </p>
        </div>

        <span className="admin-batch-form-version">
          Version {config.version}
        </span>
      </div>

      <div className="admin-batch-form-sections">
        {config.sections.map(
          (section) => (
            <FormSection
              key={section.id}
              section={section}
              values={values}
              repeatableValues={
                repeatableValues[
                  section.id
                ] ?? []
              }
            />
          )
        )}
      </div>
    </div>
  );
};

/*
 * ============================================================
 * EDITABLE FORM SECTION
 * ============================================================
 */

interface EditableFormSectionProps {
  section: TechnicalFormSection;
  values: FormValues;
  repeatableValues: RepeatableRow[];

  onFieldChange: (
    fieldKey: string,
    value: FieldValue
  ) => void;

  onRepeatableFieldChange: (
    sectionId: string,
    rowId: string,
    fieldKey: string,
    value: FieldValue
  ) => void;
}

const EditableFormSection = ({
  section,
  values,
  repeatableValues,
  onFieldChange,
  onRepeatableFieldChange,
}: EditableFormSectionProps) => (
  <section className="admin-batch-form-section admin-batch-edit-section">
    <div className="admin-batch-form-section-header">
      <div>
        <h4>{section.title}</h4>

        {section.repeatable && (
          <span className="admin-batch-repeatable-label">
            Repeatable Section
          </span>
        )}
      </div>
    </div>

    {!section.repeatable && (
      <div className="admin-batch-edit-fields-grid">
        {section.fields.map((field) => (
          <div
            key={field.id}
            className="admin-batch-edit-field-group"
          >
            {field.type !== "checkbox" && (
              <label>
                {field.label}
              </label>
            )}

            <EditableField
              field={field}
              value={
                values[field.fieldKey] ??
                ""
              }
              onChange={(value) =>
                onFieldChange(
                  field.fieldKey,
                  value
                )
              }
            />
          </div>
        ))}
      </div>
    )}

    {section.repeatable && (
      <div className="admin-batch-edit-repeatable-list">
        {repeatableValues.map(
          (row, index) => (
            <div
              key={row.id}
              className="admin-batch-edit-repeatable-row"
            >
              <div className="admin-batch-repeatable-row-heading">
                Entry {index + 1}
              </div>

              <div className="admin-batch-edit-fields-grid">
                {section.fields.map(
                  (field) => (
                    <div
                      key={field.id}
                      className="admin-batch-edit-field-group"
                    >
                      {field.type !==
                        "checkbox" && (
                        <label>
                          {field.label}
                        </label>
                      )}

                      <EditableField
                        field={field}
                        value={
                          row.values[
                            field.fieldKey
                          ] ?? ""
                        }
                        onChange={(
                          value
                        ) =>
                          onRepeatableFieldChange(
                            section.id,
                            row.id,
                            field.fieldKey,
                            value
                          )
                        }
                      />
                    </div>
                  )
                )}
              </div>

              {section.tableColumns &&
                section.tableColumns.length >
                  0 && (
                  <div className="admin-batch-edit-table-fields">
                    <div className="admin-batch-subsection-title">
                      Configured Table Columns
                    </div>

                    <div className="admin-batch-table-wrapper">
                      <table className="admin-batch-detail-table">
                        <thead>
                          <tr>
                            {section.tableColumns.map(
                              (column) => (
                                <th
                                  key={
                                    column.id
                                  }
                                >
                                  {
                                    column.label
                                  }
                                </th>
                              )
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            {section.tableColumns.map(
                              (column) => (
                                <td
                                  key={
                                    column.id
                                  }
                                >
                                  <EditableField
                                    field={
                                      column
                                    }
                                    value={
                                      row.values[
                                        column.fieldKey
                                      ] ?? ""
                                    }
                                    onChange={(
                                      value
                                    ) =>
                                      onRepeatableFieldChange(
                                        section.id,
                                        row.id,
                                        column.fieldKey,
                                        value
                                      )
                                    }
                                  />
                                </td>
                              )
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          )
        )}
      </div>
    )}
  </section>
);

/*
 * ============================================================
 * EDITABLE COMPLETE FORM
 * ============================================================
 */

interface EditableCompleteFormProps {
  title: string;
  config:
    | TechnicalFormConfig
    | undefined;
  values: FormValues;
  repeatableValues: Record<
    string,
    RepeatableRow[]
  >;

  onFieldChange: (
    fieldKey: string,
    value: FieldValue
  ) => void;

  onRepeatableFieldChange: (
    sectionId: string,
    rowId: string,
    fieldKey: string,
    value: FieldValue
  ) => void;
}

const EditableCompleteForm = ({
  title,
  config,
  values,
  repeatableValues,
  onFieldChange,
  onRepeatableFieldChange,
}: EditableCompleteFormProps) => {
  if (!config) {
    return (
      <div className="admin-batch-form-empty">
        <h4>{title}</h4>

        <p>
          No published form
          configuration is available
          for this stage.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-batch-complete-form">
      <div className="admin-batch-complete-form-header">
        <div>
          <h3>{title}</h3>

          <p>
            Editable Admin copy of the
            submitted form
          </p>
        </div>

        <span className="admin-batch-form-version">
          Version {config.version}
        </span>
      </div>

      <div className="admin-batch-form-sections">
        {config.sections.map(
          (section) => (
            <EditableFormSection
              key={section.id}
              section={section}
              values={values}
              repeatableValues={
                repeatableValues[
                  section.id
                ] ?? []
              }
              onFieldChange={
                onFieldChange
              }
              onRepeatableFieldChange={
                onRepeatableFieldChange
              }
            />
          )
        )}
      </div>
    </div>
  );
};

/*
 * ============================================================
 * STAGE CARD
 * ============================================================
 */

interface StageCardProps {
  stage: StageRecord;
  productCode: string;
}

const StageCard = ({
  stage,
  productCode,
}: StageCardProps) => {
  const productionConfig =
    getFormConfig(
      productCode,
      stage.stageId,
      "PRODUCTION"
    );

  const qaConfig =
    getFormConfig(
      productCode,
      stage.stageId,
      "QA_QC"
    );

  return (
    <article className="admin-batch-stage-card">
      <div className="admin-batch-stage-header">
        <div className="admin-batch-stage-title">
          <div className="admin-batch-stage-number">
            {stage.occurrence}
          </div>

          <div>
            <h2>
              {stage.stageName}
            </h2>

            {stage.occurrence > 1 && (
              <span className="admin-batch-occurrence">
                Repeat Occurrence{" "}
                {stage.occurrence}
              </span>
            )}

            <p>
              Lot Number:{" "}
              <strong>
                {stage.lotNumber}
              </strong>
            </p>
          </div>
        </div>

        <div className="admin-batch-stage-meta">
          <span
            className={`admin-batch-status ${
              stage.qaStatus === "Rejected"
                ? "rejected"
                : "approved"
            }`}
          >
            QA {stage.qaStatus}
          </span>

          <span className="admin-batch-submitted-date">
            Submitted:{" "}
            {stage.submittedAt}
          </span>
        </div>
      </div>

      <div className="admin-batch-stage-body">
        <CompleteForm
          title={`${stage.stageName} Production`}
          config={productionConfig}
          values={
            stage.productionValues
          }
          repeatableValues={
            stage.productionRepeatableValues
          }
        />

        <CompleteForm
          title={`${stage.stageName} QA/QC`}
          config={qaConfig}
          values={stage.qaValues}
          repeatableValues={
            stage.qaRepeatableValues
          }
        />
      </div>
    </article>
  );
};

/*
 * ============================================================
 * MAIN PAGE
 * ============================================================
 */

const AdminRejectedBatchSheets = () => {
  const navigate = useNavigate();

  const { products } = useProductData();

  const [
    batchSheets,
    setBatchSheets,
  ] = useState<BatchSheet[]>(
    initialRejectedBatchSheets
  );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    productFilter,
    setProductFilter,
  ] = useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    selectedBatch,
    setSelectedBatch,
  ] = useState<BatchSheet | null>(
    null
  );

  const [
    editingBatch,
    setEditingBatch,
  ] = useState<BatchSheet | null>(
    null
  );

  const [
    statusEditingBatch,
    setStatusEditingBatch,
  ] = useState<BatchSheet | null>(
    null
  );

  const [
    showViewModal,
    setShowViewModal,
  ] = useState(false);

  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    showStatusModal,
    setShowStatusModal,
  ] = useState(false);

  const [
    showSaveConfirmation,
    setShowSaveConfirmation,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    isSavingStatus,
    setIsSavingStatus,
  ] = useState(false);

  /*
   * ==========================================================
   * FILTER
   * ==========================================================
   */

  const filteredBatchSheets =
    useMemo(() => {
      const search =
        searchTerm.trim().toLowerCase();

      return batchSheets.filter(
        (batch) => {
          const matchesSearch =
            !search ||
            batch.batchSheetNumber
              .toLowerCase()
              .includes(search) ||
            batch.productName
              .toLowerCase()
              .includes(search) ||
            batch.productCode
              .toLowerCase()
              .includes(search) ||
            batch.stages.some((stage) =>
              stage.lotNumber
                .toLowerCase()
                .includes(search)
            );

          const matchesProduct =
            productFilter === "All" ||
            batch.productCode ===
              productFilter;

          const matchesStatus =
            statusFilter === "All" ||
            batch.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesProduct &&
            matchesStatus
          );
        }
      );
    }, [
      batchSheets,
      searchTerm,
      productFilter,
      statusFilter,
    ]);

  /*
   * ==========================================================
   * VIEW
   * ==========================================================
   */

  const openViewBatch = (
    batch: BatchSheet
  ) => {
    setSelectedBatch(batch);
    setShowViewModal(true);
  };

  const closeViewBatch = () => {
    setSelectedBatch(null);
    setShowViewModal(false);
  };

  /*
   * ==========================================================
   * FULL EDIT
   * ==========================================================
   */

  const openFullEdit = (
    batch: BatchSheet
  ) => {
    const clonedBatch =
      JSON.parse(
        JSON.stringify(batch)
      ) as BatchSheet;

    setEditingBatch(clonedBatch);
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (isSaving) {
      return;
    }

    setEditingBatch(null);
    setShowEditModal(false);
  };

  /*
   * ==========================================================
   * NORMAL FIELD EDIT
   * ==========================================================
   */

  const updateStageField = (
    stageId: string,
    formType: "PRODUCTION" | "QA_QC",
    fieldKey: string,
    value: FieldValue
  ) => {
    setEditingBatch((current) => {
      if (!current) {
        return null;
      }

      return {
        ...current,

        stages: current.stages.map(
          (stage) => {
            if (stage.id !== stageId) {
              return stage;
            }

            if (
              formType ===
              "PRODUCTION"
            ) {
              return {
                ...stage,

                productionValues: {
                  ...stage.productionValues,
                  [fieldKey]: value,
                },
              };
            }

            return {
              ...stage,

              qaValues: {
                ...stage.qaValues,
                [fieldKey]: value,
              },
            };
          }
        ),
      };
    });
  };

  /*
   * ==========================================================
   * REPEATABLE FIELD EDIT
   * ==========================================================
   */

  const updateRepeatableField = (
    stageId: string,
    formType: "PRODUCTION" | "QA_QC",
    sectionId: string,
    rowId: string,
    fieldKey: string,
    value: FieldValue
  ) => {
    setEditingBatch((current) => {
      if (!current) {
        return null;
      }

      return {
        ...current,

        stages: current.stages.map(
          (stage) => {
            if (stage.id !== stageId) {
              return stage;
            }

            if (
              formType ===
              "PRODUCTION"
            ) {
              return {
                ...stage,

                productionRepeatableValues:
                  {
                    ...stage.productionRepeatableValues,

                    [sectionId]:
                      (
                        stage
                          .productionRepeatableValues[
                          sectionId
                        ] ?? []
                      ).map((row) =>
                        row.id === rowId
                          ? {
                              ...row,

                              values: {
                                ...row.values,
                                [fieldKey]:
                                  value,
                              },
                            }
                          : row
                      ),
                  },
              };
            }

            return {
              ...stage,

              qaRepeatableValues: {
                ...stage.qaRepeatableValues,

                [sectionId]:
                  (
                    stage
                      .qaRepeatableValues[
                      sectionId
                    ] ?? []
                  ).map((row) =>
                    row.id === rowId
                      ? {
                          ...row,

                          values: {
                            ...row.values,
                            [fieldKey]:
                              value,
                          },
                        }
                      : row
                  ),
              },
            };
          }
        ),
      };
    });
  };

  /*
   * ==========================================================
   * STATUS EDIT
   * ==========================================================
   */

  const openStatusEdit = (
    batch: BatchSheet
  ) => {
    setStatusEditingBatch(batch);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    if (isSavingStatus) {
      return;
    }

    setStatusEditingBatch(null);
    setShowStatusModal(false);
  };

  const saveStatus = () => {
    if (!statusEditingBatch) {
      return;
    }

    setIsSavingStatus(true);

    window.setTimeout(() => {
      setBatchSheets((current) =>
        current.map((batch) =>
          batch.id ===
          statusEditingBatch.id
            ? {
                ...batch,
                status:
                  statusEditingBatch.status,
              }
            : batch
        )
      );

      setIsSavingStatus(false);
      setShowStatusModal(false);
      setStatusEditingBatch(null);
    }, 700);
  };

  /*
   * ==========================================================
   * SAVE FULL EDIT
   * ==========================================================
   */

  const requestSaveFullEdit =
    () => {
      if (!editingBatch) {
        return;
      }

      setShowSaveConfirmation(true);
    };

  const confirmSaveFullEdit =
    () => {
      if (!editingBatch) {
        return;
      }

      setIsSaving(true);

      window.setTimeout(() => {
        setBatchSheets((current) =>
          current.map((batch) =>
            batch.id ===
            editingBatch.id
              ? editingBatch
              : batch
          )
        );

        setIsSaving(false);
        setShowSaveConfirmation(false);
        setShowEditModal(false);
        setEditingBatch(null);
      }, 700);
    };

  /*
   * ==========================================================
   * PRINT / SAVE AS PDF
   * ==========================================================
   *
   * Do NOT print the current Admin application window.
   *
   * The Rejected Batch Sheet modal lives inside the Admin layout,
   * which also contains the application header/sidebar.
   * Printing the current window can therefore print the
   * application layout or hide the modal content.
   *
   * Instead, create a temporary standalone print window
   * containing ONLY the consolidated Rejected Batch Sheet modal.
   *
   * Therefore:
   *
   * Print/PDF -> Standalone Batch Sheet Preview
   * Cancel     -> Original consolidated Batch Sheet
   * Close      -> Main Batch Sheets page
   */

  const handlePrint = (batch: BatchSheet) => {
    // Open immediately from the user's click so the browser
    // does not block the temporary print window.
    const printWindow = window.open(
      "",
      "_blank",
      "width=1100,height=900"
    );

    if (!printWindow) {
      return;
    }

    // Keep the original React modal open as well.
    setSelectedBatch(batch);
    setShowViewModal(true);

    // Give React enough time to render the selected Batch Sheet.
    window.setTimeout(() => {
      const modal = document.querySelector(
        ".admin-batch-large-modal:not(.admin-batch-edit-large-modal)"
      );

      if (!modal) {
        printWindow.close();
        return;
      }

      // Clone ONLY the consolidated Rejected Batch Sheet modal.
      const printContent = modal.cloneNode(
        true
      ) as HTMLElement;

      // Remove controls that should never appear in the PDF.
      printContent
        .querySelectorAll(
          ".admin-batch-modal-footer, .admin-batch-modal-close"
        )
        .forEach((element) => {
          element.remove();
        });

      // Copy loaded application styles so the standalone
      // document keeps the same Batch Sheet appearance.
      const styleTags = Array.from(
        document.querySelectorAll(
          'style, link[rel="stylesheet"]'
        )
      )
        .map((element) => element.outerHTML)
        .join("\n");

      printWindow.document.open();

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />

            <title>
              ${batch.batchSheetNumber} - Rejected Batch Sheet
            </title>

            ${styleTags}

            <style>
              @page {
                size: A4;
                margin: 12mm 12mm 18mm 12mm;
              }

              .print-page-number {
                position: fixed !important;
                right: 0 !important;
                bottom: -10mm !important;
                width: 100% !important;
                text-align: right !important;
                font-family: Arial, Helvetica, sans-serif !important;
                font-size: 9px !important;
                color: #555555 !important;
                display: block !important;
              }

              .print-page-number-value::after {
                content: counter(page);
              }

              html,
              body {
                width: 100%;
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                background: #ffffff !important;
              }

              body {
                font-family:
                  Arial,
                  Helvetica,
                  sans-serif;
              }

              .print-document {
                width: 100%;
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
                margin: 0;
                padding: 0;
                overflow: visible !important;
                background: #ffffff;
              }

              .admin-batch-large-modal {
                position: static !important;
                display: block !important;
                width: 100% !important;
                max-width: none !important;
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                border: none !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                background: #ffffff !important;
              }

              .admin-batch-modal-header {
                position: static !important;
                display: flex !important;
                width: 100% !important;
                height: auto !important;
                margin: 0 0 14px !important;
                padding: 0 0 10px !important;
                background: #ffffff !important;
                border-bottom: 1px solid #000000 !important;
              }

              .admin-batch-modal-summary {
                display: grid !important;
                width: 100% !important;
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
                margin-bottom: 18px !important;
                overflow: visible !important;
              }

              .admin-batch-stage-list {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
              }

              .admin-batch-stage-card {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
                margin: 0 0 18px !important;
                padding: 0 !important;
                overflow: visible !important;
                background: #ffffff !important;
                break-inside: auto !important;
                page-break-inside: auto !important;
              }

              .admin-batch-stage-header {
                break-after: avoid !important;
                page-break-after: avoid !important;
              }

              .admin-batch-table-wrapper {
                width: 100% !important;
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
                overflow: visible !important;
              }

              .admin-batch-detail-table {
                width: 100% !important;
                min-width: 0 !important;
                height: auto !important;
                border-collapse: collapse !important;
                table-layout: fixed !important;
              }

              .admin-batch-detail-table th,
              .admin-batch-detail-table td {
                white-space: normal !important;
                word-break: break-word !important;
                overflow-wrap: anywhere !important;
              }

              .admin-batch-detail-table thead {
                display: table-header-group !important;
              }

              .admin-batch-detail-table tr {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }

              button,
              .admin-batch-modal-footer,
              .admin-batch-modal-close {
                display: none !important;
              }

              .admin-batch-large-modal *,
              .admin-batch-stage-list *,
              .admin-batch-stage-card *,
              .admin-batch-table-wrapper * {
                max-height: none !important;
              }

              .admin-batch-large-modal,
              .admin-batch-stage-list,
              .admin-batch-stage-card,
              .admin-batch-table-wrapper {
                overflow: visible !important;
              }
            </style>
          </head>

          <body>
            <main class="print-document">
              ${printContent.outerHTML}
              <div class="print-page-number" aria-hidden="true">Page <span class="print-page-number-value"></span></div>
            </main>
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for the standalone document to render before
      // opening the browser's print preview.
      printWindow.setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 700);

      // Closing/canceling print returns the user to the
      // original React Rejected Batch Sheet modal.
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);
  };

  /*
   * ==========================================================
   * MAIN PAGE
   * ==========================================================
   */

  return (
    <div className="admin-batch-page">
      <div className="admin-batch-page-header">
        <div>
          <h1>Rejected Batch Sheets</h1>

          <p>
            Review rejected lots, preserved process
            history, QA/QC rejection reasons and
            Admin review details.
          </p>
        </div>

        <button
          type="button"
          className="admin-batch-back-button"
          onClick={() =>
            navigate("/admin")
          }
        >
          ← Back to Dashboard
        </button>
      </div>

      <section className="admin-batch-summary-grid">
        <div className="admin-batch-summary-card">
          <span>
            Total Rejected
          </span>

          <strong>
            {batchSheets.length}
          </strong>

          <small>
            Rejected batch records
          </small>
        </div>

        <div className="admin-batch-summary-card">
          <span>
            Under Review
          </span>

          <strong>
            {
              batchSheets.filter(
                (batch) =>
                  batch.status === "Under Review"
              ).length
            }
          </strong>

          <small>
            Rejected records under review
          </small>
        </div>

        <div className="admin-batch-summary-card">
          <span>
            Stages Preserved
          </span>

          <strong>
            {
              batchSheets.reduce(
                (total, batch) =>
                  total + batch.stages.length,
                0
              )
            }
          </strong>

          <small>
            Historical process stages retained
          </small>
        </div>
      </section>

      <section className="admin-batch-list-card">
        <div className="admin-batch-list-header">
          <div>
            <h2>
              Rejected Batch Sheet List
            </h2>

            <p>
              Select a rejected record to view
              its complete Production, QA/QC
              and rejection details.
            </p>
          </div>

          <span className="admin-batch-count">
            {
              filteredBatchSheets.length
            }{" "}
            Records
          </span>
        </div>

        <div className="admin-batch-toolbar">
          <div className="admin-batch-search">
            <input
              type="text"
              placeholder="Search Batch Number, Product Code, Product Name or Lot Number"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />
          </div>

          <div className="admin-batch-filter">
            <label htmlFor="batch-product-filter">
              Product
            </label>

            <select
              id="batch-product-filter"
              value={productFilter}
              onChange={(event) =>
                setProductFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Products
              </option>

              {products.map(
                (product) => (
                  <option
                    key={product.id}
                    value={
                      product.productCode
                    }
                  >
                    {getProductDisplayName(
                      product.productName,
                      product.productCode
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="admin-batch-filter">
            <label htmlFor="batch-status-filter">
              Status
            </label>

            <select
              id="batch-status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Under Review">
                Under Review
              </option>

            </select>
          </div>
        </div>

        <div className="admin-batch-table-wrapper">
          <table className="admin-batch-list-table">
            <thead>
              <tr>
                <th>
                  Batch Sheet No.
                </th>

                <th>Product</th>

                <th>Rejected Stage</th>

                <th>Rejected On</th>

                <th>Status</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBatchSheets.length >
              0 ? (
                filteredBatchSheets.map(
                  (batch) => (
                    <tr
                      key={batch.id}
                    >
                      <td>
                        <strong>
                          {
                            batch.batchSheetNumber
                          }
                        </strong>
                      </td>

                      <td>
                        {getProductDisplayName(
                          batch.productName,
                          batch.productCode
                        )}
                      </td>

                      <td>
                        {batch.rejectedStage}
                      </td>

                      <td>
                        {batch.rejectedAt}
                      </td>

                      <td>
                        <span
                          className={`admin-batch-status ${
                            batch.status === "Rejected"
                              ? "rejected"
                              : batch.status === "Under Review"
                              ? "in-review"
                              : "completed"
                          }`}
                        >
                          {batch.status}
                        </span>
                      </td>

                      <td>
                        <div className="admin-batch-actions">
                          <button
                            type="button"
                            className="admin-batch-view-button"
                            onClick={() =>
                              openViewBatch(
                                batch
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="admin-batch-edit-button"
                            onClick={() =>
                              openStatusEdit(
                                batch
                              )
                            }
                          >
                            Edit Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="admin-batch-empty-table"
                  >
                    No batch sheets
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          VIEW CONSOLIDATED BATCH SHEET
          ====================================================== */}

      {showViewModal &&
        selectedBatch && (
          <div
            className="admin-batch-modal-overlay"
            role="presentation"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeViewBatch();
              }
            }}
          >
            <div className="admin-batch-large-modal">
              <div className="admin-batch-modal-header">
                <div>
                  <h2>
                    {
                      selectedBatch.batchSheetNumber
                    }
                  </h2>

                  <p>
                    {getProductDisplayName(
                      selectedBatch.productName,
                      selectedBatch.productCode
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-batch-modal-close"
                  onClick={
                    closeViewBatch
                  }
                >
                  ×
                </button>
              </div>

              <div className="admin-batch-modal-summary">
                <div>
                  <span>
                    Batch Sheet Number
                  </span>

                  <strong>
                    {
                      selectedBatch.batchSheetNumber
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Product
                  </span>

                  <strong>
                    {getProductDisplayName(
                      selectedBatch.productName,
                      selectedBatch.productCode
                    )}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {
                      selectedBatch.status
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Generated At
                  </span>

                  <strong>
                    {
                      selectedBatch.generatedAt
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Total Stage Records
                  </span>

                  <strong>
                    {
                      selectedBatch.stages
                        .length
                    }
                  </strong>
                </div>
              </div>

              <div className="admin-rejected-details">
                <div>
                  <span>QA/QC Rejection Reason</span>
                  <strong>{selectedBatch.rejectionReason}</strong>
                </div>

                <div>
                  <span>Rejected Stage</span>
                  <strong>{selectedBatch.rejectedStage}</strong>
                </div>
              </div>

              <div className="admin-batch-stage-list">
                {selectedBatch.stages.map(
                  (stage) => (
                    <StageCard
                      key={stage.id}
                      stage={stage}
                      productCode={
                        selectedBatch.productCode
                      }
                    />
                  )
                )}
              </div>

              <div className="admin-batch-modal-footer">
                <button
                  type="button"
                  className="admin-batch-secondary-button"
                  onClick={() =>
                    handlePrint(
                      selectedBatch
                    )
                  }
                >
                  Print / Save as PDF
                </button>

                <button
                  type="button"
                  className="admin-batch-secondary-button"
                  onClick={() =>
                    openFullEdit(
                      selectedBatch
                    )
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="admin-batch-primary-button"
                  onClick={
                    closeViewBatch
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ======================================================
          FULL EDIT MODAL
          ====================================================== */}

      {showEditModal &&
        editingBatch && (
          <div className="admin-batch-modal-overlay">
            <div className="admin-batch-large-modal admin-batch-edit-large-modal">
              <div className="admin-batch-modal-header">
                <div>
                  <h2>
                    Edit Rejected Batch Sheet
                  </h2>

                  <p>
                    {
                      editingBatch.batchSheetNumber
                    }{" "}
                    •{" "}
                    {getProductDisplayName(
                      editingBatch.productName,
                      editingBatch.productCode
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-batch-modal-close"
                  onClick={
                    closeEditModal
                  }
                  disabled={isSaving}
                >
                  ×
                </button>
              </div>

              <div className="admin-batch-edit-info">
                <strong>
                  Admin Edit Mode
                </strong>

                <p>
                  The fields below are
                  editable by Admin. The
                  backend will later record
                  every change in the Audit
                  Logs with the Admin identity
                  and server timestamp.
                </p>
              </div>

              <div className="admin-batch-modal-summary">
                <div>
                  <span>
                    Batch Sheet Number
                  </span>

                  <strong>
                    {
                      editingBatch.batchSheetNumber
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Product
                  </span>

                  <strong>
                    {getProductDisplayName(
                      editingBatch.productName,
                      editingBatch.productCode
                    )}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {
                      editingBatch.status
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Stage Records
                  </span>

                  <strong>
                    {
                      editingBatch.stages
                        .length
                    }
                  </strong>
                </div>
              </div>

              <div className="admin-batch-stage-list admin-batch-edit-stage-list">
                {editingBatch.stages.map(
                  (stage) => {
                    const productionConfig =
                      getFormConfig(
                        editingBatch.productCode,
                        stage.stageId,
                        "PRODUCTION"
                      );

                    const qaConfig =
                      getFormConfig(
                        editingBatch.productCode,
                        stage.stageId,
                        "QA_QC"
                      );

                    return (
                      <article
                        key={stage.id}
                        className="admin-batch-stage-card"
                      >
                        <div className="admin-batch-stage-header">
                          <div className="admin-batch-stage-title">
                            <div className="admin-batch-stage-number">
                              {
                                stage.occurrence
                              }
                            </div>

                            <div>
                              <h2>
                                {
                                  stage.stageName
                                }
                              </h2>

                              {stage.occurrence >
                                1 && (
                                <span className="admin-batch-occurrence">
                                  Repeat
                                  Occurrence{" "}
                                  {
                                    stage.occurrence
                                  }
                                </span>
                              )}

                              <p>
                                Lot Number:{" "}
                                <strong>
                                  {
                                    stage.lotNumber
                                  }
                                </strong>
                              </p>
                            </div>
                          </div>

                          <div className="admin-batch-stage-meta">
                            <span className="admin-batch-status approved">
                              QA{" "}
                              {
                                stage.qaStatus
                              }
                            </span>
                          </div>
                        </div>

                        <div className="admin-batch-stage-body">
                          <EditableCompleteForm
                            title={`${stage.stageName} Production`}
                            config={
                              productionConfig
                            }
                            values={
                              stage.productionValues
                            }
                            repeatableValues={
                              stage.productionRepeatableValues
                            }
                            onFieldChange={(
                              fieldKey,
                              value
                            ) =>
                              updateStageField(
                                stage.id,
                                "PRODUCTION",
                                fieldKey,
                                value
                              )
                            }
                            onRepeatableFieldChange={(
                              sectionId,
                              rowId,
                              fieldKey,
                              value
                            ) =>
                              updateRepeatableField(
                                stage.id,
                                "PRODUCTION",
                                sectionId,
                                rowId,
                                fieldKey,
                                value
                              )
                            }
                          />

                          <EditableCompleteForm
                            title={`${stage.stageName} QA/QC`}
                            config={
                              qaConfig
                            }
                            values={
                              stage.qaValues
                            }
                            repeatableValues={
                              stage.qaRepeatableValues
                            }
                            onFieldChange={(
                              fieldKey,
                              value
                            ) =>
                              updateStageField(
                                stage.id,
                                "QA_QC",
                                fieldKey,
                                value
                              )
                            }
                            onRepeatableFieldChange={(
                              sectionId,
                              rowId,
                              fieldKey,
                              value
                            ) =>
                              updateRepeatableField(
                                stage.id,
                                "QA_QC",
                                sectionId,
                                rowId,
                                fieldKey,
                                value
                              )
                            }
                          />
                        </div>
                      </article>
                    );
                  }
                )}
              </div>

              <div className="admin-batch-modal-footer">
                <button
                  type="button"
                  className="admin-batch-secondary-button"
                  onClick={
                    closeEditModal
                  }
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="admin-batch-primary-button"
                  onClick={
                    requestSaveFullEdit
                  }
                  disabled={isSaving}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ======================================================
          STATUS EDIT MODAL
          ====================================================== */}

      {showStatusModal &&
        statusEditingBatch && (
          <div className="admin-batch-modal-overlay">
            <div className="admin-batch-confirm-modal">
              <div className="admin-batch-confirm-icon">
                !
              </div>

              <h2>
                Edit Rejection Review Status
              </h2>

              <p>
                Update the review status for:
              </p>

              <strong className="admin-batch-confirm-batch-number">
                {
                  statusEditingBatch.batchSheetNumber
                }
              </strong>

              <div className="admin-batch-status-edit-group">
                <label htmlFor="admin-batch-status-select">
                  Status
                </label>

                <select
                  id="admin-batch-status-select"
                  value={
                    statusEditingBatch.status
                  }
                  onChange={(event) =>
                    setStatusEditingBatch({
                      ...statusEditingBatch,
                      status:
                        event.target
                          .value as BatchSheetStatus,
                    })
                  }
                >
                  <option value="Rejected">
                    Rejected
                  </option>

                  <option value="Under Review">
                    Under Review
                  </option>

                </select>
              </div>

              <div className="admin-batch-confirm-actions">
                <button
                  type="button"
                  className="admin-batch-secondary-button"
                  onClick={
                    closeStatusModal
                  }
                  disabled={
                    isSavingStatus
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="admin-batch-primary-button"
                  onClick={saveStatus}
                  disabled={
                    isSavingStatus
                  }
                >
                  {isSavingStatus
                    ? "Saving..."
                    : "Save Status"}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ======================================================
          SAVE CONFIRMATION
          ====================================================== */}

      {showSaveConfirmation &&
        editingBatch && (
          <div className="admin-batch-modal-overlay">
            <div className="admin-batch-confirm-modal">
              <div className="admin-batch-confirm-icon">
                !
              </div>

              <h2>
                Save Changes?
              </h2>

              <p>
                You are about to save
                changes to batch sheet:
              </p>

              <strong className="admin-batch-confirm-batch-number">
                {
                  editingBatch.batchSheetNumber
                }
              </strong>

              <p>
                The updated batch record
                will replace the current
                Admin-side record.
              </p>

              <div className="admin-batch-confirm-actions">
                <button
                  type="button"
                  className="admin-batch-secondary-button"
                  onClick={() =>
                    setShowSaveConfirmation(
                      false
                    )
                  }
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="admin-batch-primary-button"
                  onClick={
                    confirmSaveFullEdit
                  }
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : "Confirm Save"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminRejectedBatchSheets;