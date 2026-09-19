import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTechnicalData } from "../../context/TechnicalDataContext";
import type {
  TechnicalFormConfig,
  TechnicalFormField,
  TechnicalFormFieldType,
  TechnicalFormSection,
} from "../../data/technicalData";
import "./TechnicalForms.css";

interface StageOption {
  id: string;
  name: string;
}

const STAGES: StageOption[] = [
  { id: "REACTION", name: "Reaction" },
  { id: "WASHING", name: "Washing" },
  { id: "RECOVERY", name: "Recovery" },
  { id: "DISTILLATION", name: "Distillation" },
  { id: "BLENDING", name: "Blending" },
  { id: "PACKAGING", name: "Packaging" },
  { id: "CENTRIFUGE", name: "Centrifuge" },
  { id: "FBD", name: "FBD" },
  { id: "QA_QC", name: "QA/QC" },
];

const GLOBAL_QA_QC_PRODUCT_CODE = "__GLOBAL__";

const FIELD_TYPES: { value: TechnicalFormFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox" },
];

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const cloneFormConfig = (config: TechnicalFormConfig): TechnicalFormConfig => ({
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

const createEmptyField = (): TechnicalFormField => ({
  id: createId("field"),
  fieldKey: `newField${Date.now()}`,
  label: "New Field",
  type: "text",
  required: false,
  options: [],
});

const createEmptySection = (): TechnicalFormSection => ({
  id: createId("section"),
  title: "New Section",
  repeatable: false,
  fields: [],
});

const TechnicalForms = () => {
  const navigate = useNavigate();
  const {
    products,
    formConfigs,
    saveFormDraft,
    publishForm,
  } = useTechnicalData();

  const activeProducts = useMemo(
    () => products.filter((product) => product.status === "Active"),
    [products]
  );

  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [selectedStageId, setSelectedStageId] = useState("");
  const [formConfig, setFormConfig] = useState<TechnicalFormConfig | null>(null);

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{
    sectionId: string;
    fieldId: string;
  } | null>(null);
  const [fieldDraft, setFieldDraft] = useState<TechnicalFormField | null>(null);
  const [sectionDraft, setSectionDraft] = useState<{
    title: string;
    repeatable: boolean;
  }>({ title: "", repeatable: false });

  const [showAddSection, setShowAddSection] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "REMOVE_FIELD" | "REMOVE_TABLE_COLUMN" | "REMOVE_SECTION" | null
  >(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    sectionId?: string;
    fieldId?: string;
    title: string;
    message: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [successPopup, setSuccessPopup] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const availableStages = STAGES;

  const selectedProduct = useMemo(
    () => activeProducts.find((product) => product.productCode === selectedProductCode),
    [activeProducts, selectedProductCode]
  );

  const selectedStage = useMemo(
    () => STAGES.find((stage) => stage.id === selectedStageId),
    [selectedStageId]
  );

  useEffect(() => {
    if (selectedStageId === "QA_QC") return;
    setFormConfig(null);
  }, [selectedProductCode]);

  useEffect(() => {
    if (!selectedStageId) {
      setFormConfig(null);
      return;
    }

    const isGlobalQaQc = selectedStageId === "QA_QC";

    if (!isGlobalQaQc && !selectedProductCode) {
      setFormConfig(null);
      return;
    }

    const matchingConfigs = formConfigs.filter((config) =>
      isGlobalQaQc
        ? config.stageId === "QA_QC" ||
          (config.scope === "GLOBAL" && config.formType === "QA_QC")
        : config.productCode === selectedProductCode &&
          config.stageId === selectedStageId
    );

    const drafts = matchingConfigs.filter((config) => config.status === "DRAFT");
    const published = matchingConfigs.filter((config) => config.status === "PUBLISHED");

    const latest =
      [...drafts, ...published].sort((a, b) => b.version - a.version)[0] ?? null;

    if (latest) {
      setFormConfig(cloneFormConfig(latest));
      return;
    }

    const stage = STAGES.find((item) => item.id === selectedStageId);
    if (!stage) {
      setFormConfig(null);
      return;
    }

    const now = new Date().toISOString();
    setFormConfig({
      id: isGlobalQaQc
        ? "FORM-QA-QC-GLOBAL"
        : `FORM-${selectedProductCode}-${selectedStageId}`,
      productCode: isGlobalQaQc
        ? GLOBAL_QA_QC_PRODUCT_CODE
        : selectedProductCode,
      stageId: selectedStageId,
      stageName: stage.name,
      scope: isGlobalQaQc ? "GLOBAL" : "PRODUCT_STAGE",
      formType: isGlobalQaQc ? "QA_QC" : "PRODUCTION",
      version: 1,
      status: "DRAFT",
      sections: [],
      createdAt: now,
      updatedAt: now,
    });
  }, [selectedProductCode, selectedStageId, formConfigs]);

  const updateConfig = (
    updater: (current: TechnicalFormConfig) => TechnicalFormConfig
  ) => {
    setFormConfig((current) => (current ? updater(cloneFormConfig(current)) : current));
  };

  const openSectionEditor = (section: TechnicalFormSection) => {
    setSectionDraft({ title: section.title, repeatable: section.repeatable });
    setEditingSectionId(section.id);
  };

  const saveSectionEditor = () => {
    if (!editingSectionId) return;

    updateConfig((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === editingSectionId
          ? {
              ...section,
              title: sectionDraft.title.trim() || section.title,
              repeatable: sectionDraft.repeatable,
            }
          : section
      ),
    }));

    setEditingSectionId(null);
  };

  const openRemoveFieldConfirm = (
    section: TechnicalFormSection,
    field: TechnicalFormField,
    isTableColumn = false
  ) => {
    setConfirmAction(isTableColumn ? "REMOVE_TABLE_COLUMN" : "REMOVE_FIELD");
    setConfirmTarget({
      sectionId: section.id,
      fieldId: field.id,
      title: isTableColumn ? "Remove Table Column?" : "Remove Field?",
      message: isTableColumn
        ? `Are you sure you want to remove “${field.label}” from this table?`
        : `Are you sure you want to remove “${field.label}” from this form?`,
    });
    setShowConfirm(true);
  };

  const openRemoveSectionConfirm = (section: TechnicalFormSection) => {
    setConfirmAction("REMOVE_SECTION");
    setConfirmTarget({
      sectionId: section.id,
      title: "Remove Section?",
      message: `Are you sure you want to remove “${section.title}” and all of its fields?`,
    });
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setConfirmAction(null);
    setConfirmTarget(null);
  };

  const confirmRemove = () => {
    if (!confirmAction || !confirmTarget) return;

    if (confirmAction === "REMOVE_FIELD" && confirmTarget.sectionId && confirmTarget.fieldId) {
      updateConfig((current) => ({
        ...current,
        sections: current.sections.map((section) =>
          section.id === confirmTarget.sectionId
            ? {
                ...section,
                fields: section.fields.filter(
                  (field) => field.id !== confirmTarget.fieldId
                ),
              }
            : section
        ),
      }));
    }

    if (
      confirmAction === "REMOVE_TABLE_COLUMN" &&
      confirmTarget.sectionId &&
      confirmTarget.fieldId
    ) {
      updateConfig((current) => ({
        ...current,
        sections: current.sections.map((section) =>
          section.id === confirmTarget.sectionId
            ? {
                ...section,
                tableColumns: getTableColumns(section).filter(
                  (column) => column.id !== confirmTarget.fieldId
                ),
              }
            : section
        ),
      }));
    }

    if (confirmAction === "REMOVE_SECTION" && confirmTarget.sectionId) {
      updateConfig((current) => ({
        ...current,
        sections: current.sections.filter(
          (section) => section.id !== confirmTarget.sectionId
        ),
      }));
    }

    closeConfirm();
  };

  const moveSection = (sectionId: string, direction: "UP" | "DOWN") => {
    updateConfig((current) => {
      const sections = [...current.sections];
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index < 0) return current;

      const target = direction === "UP" ? index - 1 : index + 1;
      if (target < 0 || target >= sections.length) return current;

      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...current, sections };
    });
  };

  const moveField = (
    sectionId: string,
    fieldId: string,
    direction: "UP" | "DOWN"
  ) => {
    updateConfig((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const fields = [...section.fields];
        const index = fields.findIndex((field) => field.id === fieldId);
        if (index < 0) return section;

        const target = direction === "UP" ? index - 1 : index + 1;
        if (target < 0 || target >= fields.length) return section;

        [fields[index], fields[target]] = [fields[target], fields[index]];
        return { ...section, fields };
      }),
    }));
  };

  const openFieldEditor = (sectionId: string, field: TechnicalFormField) => {
    setEditingField({ sectionId, fieldId: field.id });
    setFieldDraft({ ...field, options: [...(field.options ?? [])] });
  };

  const saveFieldEditor = () => {
    if (editingField?.fieldId.startsWith("TABLE_COLUMN:") && fieldDraft) {
      const columnId = editingField.fieldId.replace("TABLE_COLUMN:", "");
      const section = formConfig?.sections.find(
        (item) => item.id === editingField.sectionId
      );

      if (section) {
        updateTableColumns(
          section.id,
          getTableColumns(section).map((column) =>
            column.id === columnId
              ? {
                  ...fieldDraft,
                  label: fieldDraft.label.trim() || column.label,
                  fieldKey: fieldDraft.fieldKey.trim() || column.fieldKey,
                }
              : column
          )
        );
      }

      setEditingField(null);
      setFieldDraft(null);
      return;
    }

    if (!editingField || !fieldDraft) return;

    updateConfig((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === editingField.sectionId
          ? {
              ...section,
              fields: section.fields.map((field) =>
                field.id === editingField.fieldId
                  ? {
                      ...fieldDraft,
                      label: fieldDraft.label.trim() || field.label,
                      fieldKey: fieldDraft.fieldKey.trim() || field.fieldKey,
                      options:
                        fieldDraft.type === "select"
                          ? [...(fieldDraft.options ?? [])]
                          : [],
                    }
                  : field
              ),
            }
          : section
      ),
    }));

    setEditingField(null);
    setFieldDraft(null);
  };

  const addField = (sectionId: string) => {
    const newField = createEmptyField();

    updateConfig((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, fields: [...section.fields, newField] }
          : section
      ),
    }));

    setTimeout(() => openFieldEditor(sectionId, newField), 0);
  };

  const addSection = () => {
    setSectionDraft({ title: "", repeatable: false });
    setShowAddSection(true);
  };

  const createSection = () => {
    const title = sectionDraft.title.trim();
    if (!title) return;

    const section: TechnicalFormSection = {
      ...createEmptySection(),
      title,
      repeatable: sectionDraft.repeatable,
    };

    updateConfig((current) => ({
      ...current,
      sections: [...current.sections, section],
    }));

    setShowAddSection(false);
  };

  const saveDraft = () => {
    if (!formConfig) return;

    setSaving(true);
    const saved = saveFormDraft({
      ...cloneFormConfig(formConfig),
      status: "DRAFT",
      updatedAt: new Date().toISOString(),
    });

    setFormConfig(cloneFormConfig(saved));
    setSaving(false);
    setSuccessPopup({
      title: "Draft Saved",
      message: "Your form configuration changes have been saved as a draft.",
    });
  };

  const publish = () => {
    if (!formConfig) return;

    setPublishing(true);
    const published = publishForm({
      ...cloneFormConfig(formConfig),
      status: "DRAFT",
      updatedAt: new Date().toISOString(),
    });

    setFormConfig(cloneFormConfig(published));
    setPublishing(false);
    setSuccessPopup({
      title: "Form Published",
      message:
        selectedStageId === "QA_QC"
          ? `Version ${published.version} is now published as the global QA/QC form for all products and stages.`
          : `Version ${published.version} is now published for ${selectedProduct?.productName ?? selectedProductCode} - ${selectedStage?.name ?? selectedStageId}.`,
    });
  };

  const renderPreviewInput = (field: TechnicalFormField) => {
    const className = "technical-form-preview-input";

    if (field.type === "textarea") {
      return <textarea className={className} rows={2} disabled placeholder={field.label} />;
    }

    if (field.type === "select") {
      return (
        <select className={className} disabled>
          <option>Select {field.label}</option>
          {(field.options ?? []).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (field.type === "radio") {
      return (
        <div className="technical-preview-radio-group">
          {(field.options ?? []).map((option) => (
            <label key={option} className="technical-preview-radio">
              <input type="radio" name={`preview-${field.id}`} disabled />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label className="technical-preview-checkbox">
          <input type="checkbox" disabled />
          <span>{field.label}</span>
        </label>
      );
    }

    return (
      <input
        className={className}
        type={field.type === "number" ? "number" : field.type}
        disabled
        placeholder={field.label}
      />
    );
  };

  const isActivityTable = (section: TechnicalFormSection) =>
    section.tableLayout === "ACTIVITY";

  const isGridTable = (section: TechnicalFormSection) =>
    section.tableLayout === "GRID";

  const isReactionActivityTable = (section: TechnicalFormSection) =>
    section.tableLayout === "REACTION_ACTIVITY";

  const isQaInspectionTable = (section: TechnicalFormSection) =>
    section.tableLayout === "QA_INSPECTION";

  const isTableSection = (section: TechnicalFormSection) =>
    Boolean(section.tableLayout);


  const defaultActivityColumns = (): TechnicalFormField[] => [
    { id: "column-no", fieldKey: "no", label: "No.", type: "number", required: false, options: [] },
    { id: "column-activity", fieldKey: "activity", label: "ACTIVITY:", type: "text", required: false, options: [] },
    { id: "column-time", fieldKey: "time", label: "Time", type: "time", required: false, options: [] },
    { id: "column-qty", fieldKey: "qty", label: "Qty", type: "number", required: false, options: [] },
    { id: "column-operator-sign", fieldKey: "operatorSign", label: "Operator Sign", type: "text", required: false, options: [] },
    { id: "column-qc-qa-sign", fieldKey: "qcQaSign", label: "QC/QA Sign", type: "text", required: false, options: [] },
    { id: "column-remarks", fieldKey: "remarks", label: "Remarks", type: "textarea", required: false, options: [] },
  ];

  const defaultReactionActivityColumns = (): TechnicalFormField[] => [
    { id: "column-no", fieldKey: "no", label: "No.", type: "number", required: false, options: [] },
    { id: "column-activity", fieldKey: "activity", label: "Activity", type: "text", required: false, options: [] },
    { id: "column-time", fieldKey: "time", label: "Time", type: "time", required: false, options: [] },
    { id: "column-sign", fieldKey: "sign", label: "Sign", type: "text", required: false, options: [] },
    { id: "column-remarks", fieldKey: "remarks", label: "Remarks", type: "textarea", required: false, options: [] },
  ];

  const getTableColumns = (section: TechnicalFormSection): TechnicalFormField[] => {
    if (section.tableColumns?.length) return section.tableColumns;
    return section.tableLayout === "REACTION_ACTIVITY"
      ? defaultReactionActivityColumns()
      : defaultActivityColumns();
  };

  const updateTableColumns = (
    sectionId: string,
    columns: TechnicalFormField[]
  ) => {
    updateConfig((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, tableColumns: columns }
          : section
      ),
    }));
  };

  const openTableColumnEditor = (
    section: TechnicalFormSection,
    column: TechnicalFormField
  ) => {
    setEditingField({
      sectionId: section.id,
      fieldId: `TABLE_COLUMN:${column.id}`,
    });
    setFieldDraft({
      ...column,
      options: [...(column.options ?? [])],
    });
  };

  const renderActivityTable = (section: TechnicalFormSection) => {
    const columns = getTableColumns(section);

    return (
      <div className="technical-table-scroll">
        <table className="technical-production-table technical-activity-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>
                  <div className="table-header-content">
                    <span>{column.label}</span>
                    <div className="table-header-actions">
                      <button
                        type="button"
                        onClick={() => openTableColumnEditor(section, column)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger-text"
                        onClick={() => openRemoveFieldConfirm(section, column, true)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.fields.map((field, index) => (
              <tr key={field.id}>
                {columns.map((column) => {
                  if (column.fieldKey === "no") {
                    return <td key={column.id} className="activity-number-cell">{index + 1}</td>;
                  }
                  if (column.fieldKey === "activity") {
                    return (
                      <td key={column.id} className="activity-label-cell">
                        <div className="qa-parameter-cell activity-editable-row">
                          <div className="activity-label">
                            {field.label}
                            {field.required && <span className="required-mark">*</span>}
                          </div>
                          <div className="table-row-actions">
                            <button type="button" title="Move Up" onClick={() => moveField(section.id, field.id, "UP")} disabled={index === 0}>↑</button>
                            <button type="button" title="Move Down" onClick={() => moveField(section.id, field.id, "DOWN")} disabled={index === section.fields.length - 1}>↓</button>
                            <button type="button" onClick={() => openFieldEditor(section.id, field)}>Edit</button>
                            <button type="button" className="danger-text" onClick={() => openRemoveFieldConfirm(section, field)}>Remove</button>
                          </div>
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td key={column.id}>
                      <input
                        className="technical-table-input"
                        type={column.type === "time" ? "time" : column.type === "number" ? "number" : "text"}
                        disabled
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderReactionActivityTable = (section: TechnicalFormSection) => {
    const columns = getTableColumns(section);

    return (
      <div className="technical-table-scroll">
        <table className="technical-production-table technical-reaction-activity-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>
                  <div className="table-header-content">
                    <span>{column.label}</span>
                    <div className="table-header-actions">
                      <button
                        type="button"
                        onClick={() => openTableColumnEditor(section, column)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger-text"
                        onClick={() => openRemoveFieldConfirm(section, column, true)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.fields.map((field, index) => (
              <tr key={field.id}>
                {columns.map((column) => {
                  if (column.fieldKey === "no") {
                    return <td key={column.id} className="activity-number-cell">{index + 9}</td>;
                  }
                  if (column.fieldKey === "activity") {
                    return (
                      <td key={column.id} className="activity-label-cell">
                        <div className="qa-parameter-cell activity-editable-row">
                          <div className="activity-label">
                            {field.label}
                            {field.required && <span className="required-mark">*</span>}
                          </div>
                          <div className="table-row-actions">
                            <button type="button" title="Move Up" onClick={() => moveField(section.id, field.id, "UP")} disabled={index === 0}>↑</button>
                            <button type="button" title="Move Down" onClick={() => moveField(section.id, field.id, "DOWN")} disabled={index === section.fields.length - 1}>↓</button>
                            <button type="button" onClick={() => openFieldEditor(section.id, field)}>Edit</button>
                            <button type="button" className="danger-text" onClick={() => openRemoveFieldConfirm(section, field)}>Remove</button>
                          </div>
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td key={column.id}>
                      <input
                        className="technical-table-input"
                        type={column.type === "time" ? "time" : column.type === "number" ? "number" : "text"}
                        disabled
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderQaInspectionTable = (section: TechnicalFormSection) => {
    const columns = getTableColumns(section);

    return (
      <div className="technical-table-scroll">
        <table className="technical-production-table technical-qa-inspection-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>
                  <div className="table-header-content">
                    <span>{column.label}</span>
                    <div className="table-header-actions">
                      <button type="button" onClick={() => openTableColumnEditor(section, column)}>Edit</button>
                      <button type="button" className="danger-text" onClick={() => openRemoveFieldConfirm(section, column, true)}>Remove</button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.fields.map((field) => (
              <tr key={field.id}>
                <td className="activity-label-cell">
                  <div className="qa-parameter-cell">
                    <div className="activity-label">
                      {field.label}
                      {field.required && <span className="required-mark">*</span>}
                    </div>
                    <div className="table-row-actions">
                      <button
                        type="button"
                        title="Move Up"
                        onClick={() => moveField(section.id, field.id, "UP")}
                        disabled={section.fields.findIndex((item) => item.id === field.id) === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        title="Move Down"
                        onClick={() => moveField(section.id, field.id, "DOWN")}
                        disabled={section.fields.findIndex((item) => item.id === field.id) === section.fields.length - 1}
                      >
                        ↓
                      </button>
                      <button type="button" onClick={() => openFieldEditor(section.id, field)}>Edit</button>
                      <button
                        type="button"
                        className="danger-text"
                        onClick={() => openRemoveFieldConfirm(section, field)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </td>
                <td><input className="technical-table-input" type="text" disabled /></td>
                <td><input className="technical-table-input" type="text" disabled /></td>
                <td><textarea className="technical-table-input technical-table-textarea" rows={1} disabled /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGridTable = (section: TechnicalFormSection) => (
    <div className="technical-table-scroll">
      <table className="technical-production-table technical-grid-table">
        <thead>
          <tr>
            {section.fields.map((field, index) => (
              <th key={field.id}>
                <div className="table-header-content">
                  <span>
                    {field.label}
                    {field.required && <span className="required-mark">*</span>}
                  </span>
                  <div className="table-header-actions">
                    <button type="button" onClick={() => openFieldEditor(section.id, field)}>Edit</button>
                    <button type="button" className="danger-text" onClick={() => openRemoveFieldConfirm(section, field)}>Remove</button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {section.fields.map((field) => (
              <td key={field.id}>{renderPreviewInput(field)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderNormalSection = (section: TechnicalFormSection) => (
    <div className="technical-normal-fields">
      {section.fields.map((field, index) => (
        <div className="technical-normal-field" key={field.id}>
          <div className="technical-field-label-row">
            <label>
              {field.label}
              {field.required && <span className="required-mark">*</span>}
            </label>
            <div className="technical-field-actions">
              <button type="button" onClick={() => moveField(section.id, field.id, "UP")} disabled={index === 0}>↑</button>
              <button type="button" onClick={() => moveField(section.id, field.id, "DOWN")} disabled={index === section.fields.length - 1}>↓</button>
              <button type="button" onClick={() => openFieldEditor(section.id, field)}>Edit</button>
              <button type="button" className="danger-text" onClick={() => openRemoveFieldConfirm(section, field)}>Remove</button>
            </div>
          </div>
          {renderPreviewInput(field)}
        </div>
      ))}
    </div>
  );

  const renderSection = (section: TechnicalFormSection, index: number) => (
    <section className="technical-form-section-card" key={section.id}>
      <div className="technical-form-section-header">
        <div>
          <h3>{section.title}</h3>
          <span className="technical-section-meta">
            {section.fields.length} {section.fields.length === 1 ? "field" : "fields"}
            {section.repeatable ? " · Repeatable" : ""}
          </span>
        </div>

        <div className="technical-section-actions">
          {!isTableSection(section) && (
            <>
              <button type="button" title="Move Up" onClick={() => moveSection(section.id, "UP")} disabled={index === 0}>↑</button>
              <button type="button" title="Move Down" onClick={() => moveSection(section.id, "DOWN")} disabled={index === (formConfig?.sections.length ?? 1) - 1}>↓</button>
            </>
          )}
          <button type="button" onClick={() => openSectionEditor(section)}>Edit</button>
          <button type="button" className="danger-button" onClick={() => openRemoveSectionConfirm(section)}>Remove</button>
        </div>
      </div>

      <div className="technical-form-section-body">
        {isReactionActivityTable(section)
          ? renderReactionActivityTable(section)
          : isActivityTable(section)
            ? renderActivityTable(section)
            : isQaInspectionTable(section)
              ? renderQaInspectionTable(section)
              : isGridTable(section)
              ? renderGridTable(section)
              : renderNormalSection(section)}

        <button type="button" className="technical-add-field-button" onClick={() => addField(section.id)}>
          + Add Field
        </button>
      </div>
    </section>
  );

  return (
    <div className="technical-forms-page">
      <div className="technical-forms-header">
        <div>
          <h1>Forms Configuration</h1>
          <p>Configure the form used for each Product and Process Stage.</p>
        </div>
        <button type="button" className="technical-forms-back-button" onClick={() => navigate("/technical")}>
          Back
        </button>
      </div>

      <div className="technical-forms-card">
        <div className="technical-forms-card-title">Form Selection</div>
        <div className="technical-forms-selection-grid">
          <div className="technical-forms-input-group">
            <label>Product</label>
            <select
              value={selectedProductCode}
              onChange={(event) => setSelectedProductCode(event.target.value)}
              disabled={selectedStageId === "QA_QC"}
            >
              <option value="">Select Product</option>
              {activeProducts.map((product) => (
                <option key={product.productCode} value={product.productCode}>
                  {product.productName} - {product.productCode}
                </option>
              ))}
            </select>
            {selectedStageId === "QA_QC" && (
              <span className="technical-selection-note">QA/QC is a single global form shared by all products and stages.</span>
            )}
          </div>

          <div className="technical-forms-input-group">
            <label>Form</label>
            <select
              value={selectedStageId}
              onChange={(event) => setSelectedStageId(event.target.value)}
            >
              <option value="">Select Form</option>
              {availableStages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!selectedStageId || (selectedStageId !== "QA_QC" && !selectedProductCode) ? (
        <div className="technical-form-empty-state">
          <div className="technical-empty-icon">+</div>
          <h2>Select a Form</h2>
          <p>Select one of the eight Production Forms or the global QA/QC form to configure it.</p>
        </div>
      ) : !formConfig ? (
        <div className="technical-form-empty-state">
          <h2>Form Configuration</h2>
          <p>Select a form to begin configuration.</p>
        </div>
      ) : (
        <>
          <div className="technical-forms-card technical-form-information-card">
            <div className="technical-forms-form-heading">
              <div>
                <h2>{selectedStageId === "QA_QC" ? "QA/QC" : selectedProduct?.productName}</h2>
                <p>
                  {selectedStageId === "QA_QC"
                    ? "Global form · Used for all products and process stages"
                    : `${selectedProductCode} · ${selectedStage?.name}`}
                </p>
              </div>
              <div className="technical-forms-version-area">
                <span className={`technical-form-status ${formConfig.status === "PUBLISHED" ? "published" : "draft"}`}>
                  {formConfig.status === "PUBLISHED" ? "Published" : "Draft"}
                </span>
                <span className="technical-form-version">Version {formConfig.version}</span>
              </div>
            </div>
          </div>

      <div className="technical-production-form-preview">
            <div className="technical-production-form-title">
              <div>
                <h2>{selectedStageId === "QA_QC" ? "QA/QC Form" : `${selectedStage?.name} Form`}</h2>
                <p>
                  {selectedStageId === "QA_QC"
                    ? "Configure the common QA/QC review structure used for every product and stage."
                    : "Configure the same section and field structure that Production will use."}
                </p>
              </div>
              <span>{selectedStageId === "QA_QC" ? "Global QA/QC Structure" : "Production Form Structure"}</span>
            </div>

            <div className="technical-forms-sections">
              {formConfig.sections.map(renderSection)}
            </div>

            <button type="button" className="technical-form-add-section-button" onClick={addSection}>
              + Add Section
            </button>
          </div>

          <div className="technical-forms-bottom-actions">
            <button type="button" className="technical-forms-cancel-button" onClick={() => navigate("/technical")}>
              Back
            </button>
            <div className="technical-forms-primary-actions">
              <button type="button" className="technical-forms-draft-button" disabled={saving || publishing} onClick={saveDraft}>
                {saving ? "Saving..." : "Save Draft"}
              </button>
              <button type="button" className="technical-forms-publish-button" disabled={saving || publishing} onClick={publish}>
                {publishing ? "Publishing..." : "Publish Form"}
              </button>
            </div>
          </div>
        </>
      )}

      {editingSectionId && (
        <div className="technical-forms-modal-overlay" onClick={() => setEditingSectionId(null)}>
          <div className="technical-forms-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Edit Section</h3>
            <div className="technical-modal-field">
              <label>Section Title</label>
              <input value={sectionDraft.title} onChange={(event) => setSectionDraft((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <label className="technical-modal-checkbox">
              <input type="checkbox" checked={sectionDraft.repeatable} onChange={(event) => setSectionDraft((current) => ({ ...current, repeatable: event.target.checked }))} />
              <span>Repeatable Section</span>
            </label>
            <div className="technical-modal-actions">
              <button type="button" className="technical-modal-cancel" onClick={() => setEditingSectionId(null)}>Cancel</button>
              <button type="button" className="technical-modal-save" onClick={saveSectionEditor}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showAddSection && (
        <div className="technical-forms-modal-overlay" onClick={() => setShowAddSection(false)}>
          <div className="technical-forms-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Add Section</h3>
            <div className="technical-modal-field">
              <label>Section Title</label>
              <input autoFocus value={sectionDraft.title} placeholder="Enter section title" onChange={(event) => setSectionDraft((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <label className="technical-modal-checkbox">
              <input type="checkbox" checked={sectionDraft.repeatable} onChange={(event) => setSectionDraft((current) => ({ ...current, repeatable: event.target.checked }))} />
              <span>Repeatable Section</span>
            </label>
            <div className="technical-modal-actions">
              <button type="button" className="technical-modal-cancel" onClick={() => setShowAddSection(false)}>Cancel</button>
              <button type="button" className="technical-modal-save" onClick={createSection}>Add Section</button>
            </div>
          </div>
        </div>
      )}

      {editingField && fieldDraft && (
        <div className="technical-forms-modal-overlay" onClick={() => { setEditingField(null); setFieldDraft(null); }}>
          <div className="technical-forms-modal technical-field-modal" onClick={(event) => event.stopPropagation()}>
            <h3>
              {editingField?.fieldId.startsWith("TABLE_COLUMN:")
                ? "Edit Table Title"
                : "Edit Field"}
            </h3>
            <div className="technical-modal-field">
              <label>Field Label</label>
              <input value={fieldDraft.label} onChange={(event) => setFieldDraft((current) => current ? { ...current, label: event.target.value } : current)} />
            </div>
            <div className="technical-modal-field">
              <label>Field Key</label>
              <input value={fieldDraft.fieldKey} onChange={(event) => setFieldDraft((current) => current ? { ...current, fieldKey: event.target.value } : current)} />
            </div>
            <div className="technical-modal-field">
              <label>Field Type</label>
              <select value={fieldDraft.type} onChange={(event) => setFieldDraft((current) => current ? { ...current, type: event.target.value as TechnicalFormFieldType } : current)}>
                {FIELD_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            {fieldDraft.type === "select" && (
              <div className="technical-modal-field">
                <label>Dropdown Options</label>
                <textarea rows={5} value={(fieldDraft.options ?? []).join("\n")} placeholder="Enter one option per line" onChange={(event) => setFieldDraft((current) => current ? { ...current, options: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } : current)} />
              </div>
            )}
            <label className="technical-modal-checkbox">
              <input type="checkbox" checked={fieldDraft.required} onChange={(event) => setFieldDraft((current) => current ? { ...current, required: event.target.checked } : current)} />
              <span>Required Field</span>
            </label>
            <div className="technical-modal-actions">
              <button type="button" className="technical-modal-cancel" onClick={() => { setEditingField(null); setFieldDraft(null); }}>Cancel</button>
              <button type="button" className="technical-modal-save" onClick={saveFieldEditor}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && confirmTarget && (
        <div className="technical-forms-modal-overlay technical-confirm-overlay" onClick={closeConfirm}>
          <div className="technical-confirm-modal" onClick={(event) => event.stopPropagation()}>
            <div className="technical-confirm-icon">!</div>
            <h3>{confirmTarget.title}</h3>
            <p>{confirmTarget.message}</p>
            <div className="technical-confirm-actions">
              <button type="button" className="technical-confirm-cancel" onClick={closeConfirm}>Cancel</button>
              <button type="button" className="technical-confirm-remove" onClick={confirmRemove}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {successPopup && (
        <div className="technical-forms-modal-overlay" onClick={() => setSuccessPopup(null)}>
          <div className="technical-success-popup" onClick={(event) => event.stopPropagation()}>
            <div className="technical-success-icon">✓</div>
            <h3>{successPopup.title}</h3>
            <p>{successPopup.message}</p>
            <button type="button" onClick={() => setSuccessPopup(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalForms;