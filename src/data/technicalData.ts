/*
 * ============================================================
 * SHARED PRODUCT MASTER
 * ============================================================
 *
 * Products are shared between:
 * - Admin Portal
 * - Technical Team Portal
 *
 * Both roles can:
 * - View products
 * - Add products
 * - Edit products
 *
 * Product Code is the unique product identity.
 *
 * Later, the backend / Firestore must enforce the same
 * uniqueness rule so duplicate Product Codes cannot be
 * created by two users at the same time.
 */

export interface Product {
  id: string;
  productCode: string;
  productName: string;
  status: "Active" | "Inactive";

  /*
   * Audit information.
   *
   * These are optional for now because the current frontend
   * is using mock data.
   *
   * Backend will populate these values later.
   */
  createdBy?: string;
  createdByRole?: "ADMIN" | "TECHNICAL";
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

/*
 * ============================================================
 * TECHNICAL PRODUCT COMPATIBILITY ALIAS
 * ============================================================
 *
 * Existing Technical Team files may still import
 * TechnicalProduct.
 *
 * Keeping this alias prevents unnecessary TypeScript
 * errors while the application is gradually moved to
 * the shared Product Master.
 *
 * New code should use Product.
 */

export type TechnicalProduct = Product;

/*
 * ============================================================
 * EMPLOYEE MASTER
 * ============================================================
 *
 * Employees are created and maintained by Admin.
 *
 * Technical Team only uses this master employee data
 * when assigning employees to products.
 *
 * Employee ID is the unique employee identity.
 */

export interface TechnicalEmployee {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  status: "Active" | "Inactive";
}

/*
 * ============================================================
 * PRODUCT → EMPLOYEE ASSIGNMENT
 * ============================================================
 */

export interface ProductEmployeeAssignment {
  productCode: string;
  employeeIds: string[];
}

/*
 * ============================================================
 * PRODUCT → STAGE CONFIGURATION
 * ============================================================
 *
 * Stores the configured process sequence for a product.
 */

export interface ProductStageConfiguration {
  productCode: string;
  stages: string[];
}

/*
 * ============================================================
 * DYNAMIC FORM CONFIGURATION
 * ============================================================
 *
 * Technical Team configures forms using these definitions.
 *
 * Later this structure can be stored directly in Firestore.
 */

export type TechnicalFormFieldType =
  | "text"
  | "number"
  | "date"
  | "time"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox";

export interface TechnicalFormField {
  id: string;
  fieldKey: string;
  label: string;
  type: TechnicalFormFieldType;
  required: boolean;
  options: string[];
}

export interface TechnicalFormSection {
  id: string;
  title: string;
  repeatable: boolean;

  fields: TechnicalFormField[];

  /**
   * Optional Excel-style table presentation.
   *
   * Kept optional so the existing configuration remains
   * backwards compatible and can later be stored directly
   * in Firestore.
   */
  tableLayout?:
    | "ACTIVITY"
    | "GRID"
    | "REACTION_ACTIVITY"
    | "QA_INSPECTION";

  tableColumns?: TechnicalFormField[];
}

export type TechnicalFormStatus =
  | "DRAFT"
  | "PUBLISHED";

export type TechnicalFormScope =
  | "PRODUCT_STAGE"
  | "GLOBAL";

export type TechnicalFormType =
  | "PRODUCTION"
  | "QA_QC";

export interface TechnicalFormConfig {
  id: string;

  /**
   * Production forms use the actual Product Code.
   *
   * Global QA/QC uses:
   * "__GLOBAL__"
   */
  productCode: string;

  stageId: string;
  stageName: string;

  scope: TechnicalFormScope;
  formType: TechnicalFormType;

  version: number;

  status: TechnicalFormStatus;

  sections: TechnicalFormSection[];

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/*
 * ============================================================
 * SHARED PRODUCT MASTER
 * ============================================================
 *
 * This is the single product list used by both Admin and
 * Technical Team.
 *
 * Example:
 *
 * Admin creates PROD005
 *        ↓
 * Shared Product Master
 *        ↓
 * Technical sees PROD005
 *
 * Technical creates PROD006
 *        ↓
 * Shared Product Master
 *        ↓
 * Admin sees PROD006
 *
 * Product Code must remain unique.
 */

export const initialProducts: Product[] = [
  {
    id: "1",
    productCode: "PROD001",
    productName: "Product A",
    status: "Active",
    createdByRole: "TECHNICAL",
  },
  {
    id: "2",
    productCode: "PROD002",
    productName: "Product B",
    status: "Active",
    createdByRole: "TECHNICAL",
  },
  {
    id: "3",
    productCode: "PROD003",
    productName: "Product C",
    status: "Active",
    createdByRole: "TECHNICAL",
  },
  {
    id: "4",
    productCode: "PROD004",
    productName: "Product D",
    status: "Active",
    createdByRole: "TECHNICAL",
  },
];

/*
 * ============================================================
 * EMPLOYEE MASTER DATA
 * ============================================================
 *
 * Employee data belongs to Admin.
 */

export const initialTechnicalEmployees: TechnicalEmployee[] = [
  {
    id: "EMP-001",
    employeeId: "EMP001",
    employeeName: "Rahul",
    designation: "Production Operator",
    status: "Active",
  },
  {
    id: "EMP-002",
    employeeId: "EMP002",
    employeeName: "Priya",
    designation: "Production Operator",
    status: "Active",
  },
  {
    id: "EMP-003",
    employeeId: "EMP003",
    employeeName: "Arun",
    designation: "Production Operator",
    status: "Active",
  },
  {
    id: "EMP-004",
    employeeId: "EMP004",
    employeeName: "Rahul",
    designation: "Production Operator",
    status: "Active",
  },
];

/*
 * ============================================================
 * PRODUCT → EMPLOYEE ASSIGNMENTS
 * ============================================================
 */

export const initialProductEmployeeAssignments: ProductEmployeeAssignment[] =
  [
    {
      productCode: "PROD001",
      employeeIds: ["EMP001", "EMP002"],
    },
    {
      productCode: "PROD002",
      employeeIds: ["EMP003", "EMP004"],
    },
    {
      productCode: "PROD003",
      employeeIds: [],
    },
    {
      productCode: "PROD004",
      employeeIds: [],
    },
  ];

/*
 * ============================================================
 * PRODUCT → STAGE CONFIGURATIONS
 * ============================================================
 */

export const initialProductStageConfigurations: ProductStageConfiguration[] =
  [
    {
      productCode: "PROD001",
      stages: [
        "REACTION",
        "WASHING",
        "RECOVERY",
        "DISTILLATION",
        "BLENDING",
        "PACKAGING",
        "CENTRIFUGE",
        "FBD",
      ],
    },
    {
      productCode: "PROD002",
      stages: [
        "REACTION",
        "DISTILLATION",
        "BLENDING",
        "PACKAGING",
      ],
    },
    {
      productCode: "PROD003",
      stages: [],
    },
    {
      productCode: "PROD004",
      stages: [],
    },
  ];

/*
 * ============================================================
 * DYNAMIC FORM CONFIGURATION
 * ============================================================
 *
 * These configurations represent the same Production form
 * structures used by the operational stage forms.
 *
 * Technical Team can:
 *
 * - Edit fields
 * - Remove fields
 * - Move fields up/down
 * - Add fields
 * - Add sections
 * - Save Draft
 * - Publish
 *
 * Production / QA screens will eventually load the latest
 * published configuration from the backend.
 */

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

const createField = (
  id: string,
  fieldKey: string,
  label: string,
  type: TechnicalFormFieldType = "text",
  required = false,
  options: string[] = []
): TechnicalFormField => ({
  id,
  fieldKey,
  label,
  type,
  required,
  options,
});

/*
 * Used for activity rows where the activity itself is a
 * configurable field/row in the Technical Form Builder.
 */

const createActivityField = (
  id: string,
  fieldKey: string,
  label: string,
  type: TechnicalFormFieldType = "text"
): TechnicalFormField =>
  createField(
    id,
    fieldKey,
    label,
    type,
    false
  );

/*
 * ============================================================
 * COMMON APPROVAL SECTIONS
 * ============================================================
 */

const createCheckedBySection = (
  prefix: string
): TechnicalFormSection => ({
  id: `${prefix}-checked-by`,
  title: "Checked By",
  repeatable: false,
  fields: [
    createField(
      `${prefix}-checked-quantity`,
      "checkedQuantity",
      "Quantity",
      "number"
    ),
    createField(
      `${prefix}-checked-yield`,
      "checkedYield",
      "Yield %",
      "number"
    ),
    createField(
      `${prefix}-checked-purity`,
      "checkedPurity",
      "Purity",
      "number"
    ),
    createField(
      `${prefix}-production-in-charge`,
      "productionInCharge",
      "Production In Charge"
    ),
    createField(
      `${prefix}-checked-signature`,
      "checkedSignature",
      "Signature"
    ),
    createField(
      `${prefix}-checked-date`,
      "checkedDate",
      "Date",
      "date"
    ),
  ],
});

const createApprovedBySection = (
  prefix: string
): TechnicalFormSection => ({
  id: `${prefix}-approved-by`,
  title: "Approved By",
  repeatable: false,
  fields: [
    createField(
      `${prefix}-approved-quantity`,
      "approvedQuantity",
      "Quantity",
      "number"
    ),
    createField(
      `${prefix}-approved-yield`,
      "approvedYield",
      "Yield %",
      "number"
    ),
    createField(
      `${prefix}-approved-purity`,
      "approvedPurity",
      "Purity",
      "number"
    ),
    createField(
      `${prefix}-qa-in-charge`,
      "qaInCharge",
      "QA In Charge"
    ),
    createField(
      `${prefix}-approved-signature`,
      "approvedSignature",
      "Signature"
    ),
    createField(
      `${prefix}-approved-date`,
      "approvedDate",
      "Date",
      "date"
    ),
  ],
});

/*
 * ============================================================
 * REACTION
 * ============================================================
 *
 * Reaction is the main production form and includes:
 *
 * - Product information
 * - Raw materials
 * - Utilities
 * - Process details
 * - Deviations
 * - Checked By
 * - Approved By
 *
 * Washing and Recovery are maintained as separate stage forms.
 */

const reactionForm: TechnicalFormSection[] = [
  {
    id: "reaction-product",
    title: "Product Information",
    repeatable: false,
    fields: [
      createField(
        "reaction-product-name",
        "productName",
        "Product Name",
        "text",
        true
      ),
      createField(
        "reaction-date",
        "date",
        "Date",
        "date",
        true
      ),
      createField(
        "reaction-ta-pd-r",
        "taPdR",
        "TA / PD / R-"
      ),
      createField(
        "reaction-reaction-lot",
        "reactionLotNo",
        "Reaction Lot No",
        "text",
        true
      ),
      createField(
        "reaction-operator",
        "operator",
        "Operator",
        "text",
        true
      ),
    ],
  },

  {
    id: "reaction-raw-materials",
    tableLayout: "GRID",
    title: "Raw Materials",
    repeatable: true,
    fields: [
      createField(
        "reaction-raw-material-name",
        "materialName",
        "Raw Material"
      ),
      createField(
        "reaction-raw-material-quantity",
        "quantity",
        "Quantity",
        "number"
      ),
      createField(
        "reaction-raw-material-batch",
        "batchNo",
        "Batch No"
      ),
    ],
  },

  {
    id: "reaction-utilities",
    title: "Utilities",
    repeatable: false,
    fields: [
      createField(
        "reaction-chb",
        "chb",
        "CHB",
        "checkbox"
      ),
      createField(
        "reaction-ctw",
        "ctw",
        "CTW",
        "checkbox"
      ),
      createField(
        "reaction-steam",
        "steam",
        "Steam",
        "checkbox"
      ),
      createField(
        "reaction-others",
        "others",
        "Others",
        "checkbox"
      ),
    ],
  },

  {
    id: "reaction-process-details",
    tableLayout: "REACTION_ACTIVITY",
    title: "Process Details",
    repeatable: false,
    fields: [
      createField(
        "reaction-addition-completed",
        "additionCompletedAt",
        "Addition Completed at :",
        "time"
      ),
      createField(
        "reaction-sample-qc",
        "sampleGivenToQC",
        "Sample Given to QC:"
      ),
      createField(
        "reaction-sample-gc",
        "sampleGivenToGC",
        "Sample given to GC:"
      ),
      createField(
        "reaction-completed",
        "reactionCompletedAt",
        "Reaction completed at:",
        "time"
      ),
      createField(
        "reaction-total-hours",
        "totalReactionHours",
        "Total No. of reaction hours:",
        "number"
      ),
      createField(
        "reaction-report",
        "report",
        "Report:",
        "textarea"
      ),
      createField(
        "reaction-shift-wise-timings",
        "shiftWiseTimings",
        "Shift wise timings:",
        "textarea"
      ),
    ],
  },

  {
    id: "reaction-deviations",
    title: "Deviations / Remarks",
    repeatable: false,
    fields: [
      createField(
        "reaction-deviations-remarks",
        "deviationsRemarks",
        "Deviations / Remarks",
        "textarea"
      ),
    ],
  },

  createCheckedBySection("reaction"),
  createApprovedBySection("reaction"),
];

/*
 * ============================================================
 * WASHING
 * ============================================================
 */

const washingForm: TechnicalFormSection[] = [
  {
    id: "washing-header",
    title: "Washing Details",
    repeatable: false,
    fields: [
      createField(
        "washing-product-name",
        "productName",
        "Product Name",
        "text",
        true
      ),
      createField(
        "washing-date",
        "date",
        "Date",
        "date",
        true
      ),
      createField(
        "washing-ta-pd-w",
        "taPdW",
        "TA / PD / W-"
      ),
      createField(
        "washing-lot-number",
        "washingLotNo",
        "Washing Lot No",
        "text",
        true
      ),
      createField(
        "washing-reaction-lot",
        "reactionLotNo",
        "Reaction Lot No"
      ),
      createField(
        "washing-operator",
        "operator",
        "Operator",
        "text",
        true
      ),
    ],
  },

  {
    id: "washing-process-table",
    tableLayout: "GRID",
    title: "Washing Process",
    repeatable: true,
    fields: [
      createField(
        "washing-h2o",
        "h2o",
        "H2O",
        "number"
      ),
      createField(
        "washing-salt",
        "salt",
        "SALT",
        "number"
      ),
      createField(
        "washing-soda-ash",
        "sodaAsh",
        "SODA ASH",
        "number"
      ),
      createField(
        "washing-naoh-33",
        "naoh33",
        "NAOH 33%",
        "number"
      ),
      createField(
        "washing-acid",
        "acid",
        "ACID",
        "number"
      ),
      createField(
        "washing-ph-monitoring",
        "phMonitoring",
        "pH MONITORING",
        "number"
      ),
      createField(
        "washing-time",
        "time",
        "TIME",
        "time"
      ),
      createField(
        "washing-sign",
        "sign",
        "SIGN"
      ),
      createField(
        "washing-remarks",
        "remarks",
        "REMARKS",
        "textarea"
      ),
    ],
  },

  {
    id: "washing-crude-mass",
    title: "Crude Mass",
    repeatable: false,
    fields: [
      createField(
        "washing-crude-instruction",
        "crudeMassInstruction",
        "Unload the crude mass. Check the crude mass for acid value, pH, GC purity and remaining parameters.",
        "textarea"
      ),
      createField(
        "washing-product-purity",
        "productPurity",
        "Product purity"
      ),
      createField(
        "washing-rm-content",
        "rmContent",
        "RM content"
      ),
      createField(
        "washing-impurity-profile",
        "impurityProfile",
        "Impurity profile"
      ),
    ],
  },

  {
    id: "washing-output-details",
    title: "Output Details",
    repeatable: false,
    fields: [
      createField(
        "washing-crude-qty",
        "crudeQty",
        "Crude Qty",
        "number"
      ),
      createField(
        "washing-std-qty",
        "stdQty",
        "Std Qty",
        "number"
      ),
      createField(
        "washing-crude-yield",
        "crudeYield",
        "Crude Yield",
        "number"
      ),
      createField(
        "washing-std-yield",
        "stdYield",
        "Std Yield",
        "number"
      ),
      createField(
        "washing-crude-purity",
        "crudePurity",
        "Crude Purity",
        "number"
      ),
      createField(
        "washing-std-purity",
        "stdPurity",
        "Std Purity",
        "number"
      ),
    ],
  },

  {
    id: "washing-deviations",
    title: "Deviations / Remarks",
    repeatable: false,
    fields: [
      createField(
        "washing-deviations",
        "deviationsRemarks",
        "Deviations / Remarks",
        "textarea"
      ),
    ],
  },

  createCheckedBySection("washing"),
  createApprovedBySection("washing"),
];

/*
 * ============================================================
 * RECOVERY
 * ============================================================
 */

const recoveryForm: TechnicalFormSection[] = [
  {
    id: "recovery-header",
    title: "Recovery Details",
    repeatable: false,
    fields: [
      createField(
        "recovery-title",
        "recoveryTitle",
        "RECOVERY OF SOLVENT / ACID"
      ),
      createField(
        "recovery-product-name",
        "productName",
        "Product Name"
      ),
      createField(
        "recovery-date",
        "date",
        "Date",
        "date",
        true
      ),
      createField(
        "recovery-ta-pd",
        "taPdRecovery",
        "TA / PD / Recovery-"
      ),
      createField(
        "recovery-lot",
        "recoveryLotNo",
        "Recovery Lot No"
      ),
      createField(
        "recovery-operator",
        "operator",
        "Operator"
      ),
    ],
  },

  {
    id: "recovery-activity",
    tableLayout: "ACTIVITY",
    title: "Recovery Activity",
    repeatable: true,
    fields: [
      createActivityField(
        "recovery-cleanliness",
        "cleanliness",
        "Cleanliness of the reactor checked by:"
      ),
      createActivityField(
        "recovery-crude-charged",
        "crudeCharged",
        "Crude charged by:"
      ),
      createActivityField(
        "recovery-charging-completed",
        "chargingCompleted",
        "Charging completed by:"
      ),
      createActivityField(
        "recovery-ctw-chb",
        "ctwChb",
        "CTW, CHB circulation checked by:"
      ),
      createActivityField(
        "recovery-heating",
        "heatingStarted",
        "Heating started at:",
        "time"
      ),
      createActivityField(
        "recovery-started",
        "recoveryStarted",
        "Recovery started at:",
        "time"
      ),
      createActivityField(
        "recovery-completed",
        "recoveryCompleted",
        "Recovery completed at:",
        "time"
      ),
      createActivityField(
        "recovery-vacuum",
        "vacuum",
        "Vacuum applied:"
      ),
      createActivityField(
        "recovery-total-completed",
        "totalRecoveryCompleted",
        "Total recovery completed at:",
        "time"
      ),
      createActivityField(
        "recovery-crude-drained",
        "crudeDrainedBy",
        "CRUDE DRAINED BY:"
      ),
      createActivityField(
        "recovery-total-recovered",
        "totalRecovered",
        "Total Recovered"
      ),
    ],
  },

  {
    id: "recovery-report",
    title: "Report",
    repeatable: false,
    fields: [
      createField(
        "recovery-qty-crude",
        "qtyOfCrude",
        "Qty of crude",
        "number"
      ),
      createField(
        "recovery-sample-analysis",
        "sampleGivenForAnalysis",
        "Sample given for analysis"
      ),
    ],
  },

  {
    id: "recovery-deviations",
    title: "Deviations / Remarks",
    repeatable: false,
    fields: [
      createField(
        "recovery-deviations",
        "deviationsRemarks",
        "Deviations / Remarks",
        "textarea"
      ),
    ],
  },

  createCheckedBySection("recovery"),
  createApprovedBySection("recovery"),
];

/*
 * ============================================================
 * DISTILLATION
 * ============================================================
 */

const distillationForm: TechnicalFormSection[] = [
  {
    id: "distillation-header",
    title: "Header Information",
    repeatable: false,
    fields: [
      createField(
        "distillation-product-name",
        "productName",
        "Product Name",
        "text",
        true
      ),
      createField(
        "distillation-date",
        "date",
        "Date",
        "date",
        true
      ),
      createField(
        "distillation-ta-pd-d",
        "taPdD",
        "TA / PD / D-"
      ),
      createField(
        "distillation-lot",
        "distillationLotNo",
        "Distillation Lot No",
        "text",
        true
      ),
      createField(
        "distillation-reaction-lot",
        "reactionLotNo",
        "Reaction Lot No"
      ),
      createField(
        "distillation-quantity",
        "quantityKgs",
        "Qty in KGs",
        "number"
      ),
      createField(
        "distillation-operator",
        "operator",
        "Operator",
        "text",
        true
      ),
    ],
  },

  {
    id: "distillation-activities-part-1",
    tableLayout: "ACTIVITY",
    title: "Activities - Part 1",
    repeatable: true,
    fields: [
      createActivityField(
        "distillation-cleanliness",
        "cleanliness",
        "Cleanliness of the distillation unit checked by:"
      ),
      createActivityField(
        "distillation-crude-start",
        "crudeChargingStarted",
        "Crude charging started by:"
      ),
      createActivityField(
        "distillation-crude-completed",
        "crudeChargingCompleted",
        "Crude charging completed by:"
      ),
      createActivityField(
        "distillation-rejected-fraction",
        "rejectedFractionCharged",
        "Rejected fraction charged by:"
      ),
      createActivityField(
        "distillation-sample-drawn",
        "sampleDrawn",
        "Sample drawn by:"
      ),
      createActivityField(
        "distillation-ctw",
        "ctwCirculation",
        "CTW circulation given by:"
      ),
      createActivityField(
        "distillation-steam-hot-oil",
        "steamHotOil",
        "Steam / hot oil given by:"
      ),
      createActivityField(
        "distillation-wje-vacuum",
        "wjeVacuum",
        "WJE vacuum"
      ),
      createActivityField(
        "distillation-steam-jet",
        "steamJetHighVacuum",
        "Steam jet / high vacuum"
      ),
      createActivityField(
        "distillation-tops-separation",
        "topsSeparation",
        "Tops separation"
      ),
      createActivityField(
        "distillation-inside-outside-sample",
        "insideOutsideSample",
        "Inside / outside sample"
      ),
      createActivityField(
        "distillation-mf-collection",
        "mfCollection",
        "MF collection"
      ),
    ],
  },

  {
    id: "distillation-temperature-log",
    tableLayout: "GRID",
    title: "Temperature Log",
    repeatable: true,
    fields: [
      createField(
        "distillation-log-sl-no",
        "slNo",
        "Sl. No.",
        "number"
      ),
      createField(
        "distillation-log-time",
        "time",
        "Time",
        "time"
      ),
      createField(
        "distillation-log-temperature",
        "temperature",
        "Temp °C",
        "number"
      ),
      createField(
        "distillation-log-vacuum",
        "vacuum",
        "Vacuum",
        "number"
      ),
      createField(
        "distillation-log-bt",
        "bt",
        "B.T.",
        "number"
      ),
      createField(
        "distillation-log-vt",
        "vt",
        "V.T.",
        "number"
      ),
      createField(
        "distillation-log-remarks",
        "remarks",
        "Remarks",
        "textarea"
      ),
    ],
  },

  {
    id: "distillation-activities-part-2",
    tableLayout: "ACTIVITY",
    title: "Activities - Part 2",
    repeatable: true,
    fields: [
      createActivityField(
        "distillation-steam-cutoff",
        "steamCutOff",
        "Steam cut-off"
      ),
      createActivityField(
        "distillation-residue-draining",
        "residueDraining",
        "Residue draining"
      ),
      createField(
        "distillation-residue-quantity",
        "residueQuantity",
        "Residue Quantity",
        "number"
      ),
    ],
  },

  {
    id: "distillation-input-output",
    title: "Input / Output",
    repeatable: false,
    fields: [
      createField(
        "distillation-crude",
        "crude",
        "Crude",
        "number"
      ),
      createField(
        "distillation-tops",
        "tops",
        "Tops",
        "number"
      ),
      createField(
        "distillation-rejected-fractions",
        "rejectedFractions",
        "Rejected fractions",
        "number"
      ),
      createField(
        "distillation-main-fractions",
        "mainFractions",
        "Main Fractions",
        "number"
      ),
      createField(
        "distillation-last-fractions",
        "lastFractions",
        "Last Fractions",
        "number"
      ),
      createField(
        "distillation-residue",
        "residue",
        "Residue",
        "number"
      ),
      createField(
        "distillation-loss",
        "distillationLoss",
        "Distillation Loss",
        "number"
      ),
      createField(
        "distillation-total-gc-ok-mf",
        "totalGcOkMf",
        "TOTAL (GC OK MF)",
        "number"
      ),
      createField(
        "distillation-total-gc-rej-mf",
        "totalGcRejMf",
        "TOTAL (GC REJ MF)",
        "number"
      ),
      createField(
        "distillation-odor-rej-fractions",
        "odorRejFractions",
        "ODOR REJ FRACTIONS",
        "number"
      ),
      createField(
        "distillation-total",
        "total",
        "TOTAL",
        "number"
      ),
      createField(
        "distillation-completed-at",
        "distillationCompletedAt",
        "Distillation completed at",
        "time"
      ),
    ],
  },

  {
    id: "distillation-deviations",
    title: "Deviations / Remarks",
    repeatable: false,
    fields: [
      createField(
        "distillation-deviations",
        "deviationsRemarks",
        "Deviations / Remarks",
        "textarea"
      ),
    ],
  },

  createCheckedBySection("distillation"),
  createApprovedBySection("distillation"),
];

/*
 * ============================================================
 * BLENDING
 * ============================================================
 */

const blendingForm: TechnicalFormSection[] = [
  {
    id: "blending-header",
    title: "Header Information",
    repeatable: false,
    fields: [
      createField(
        "blending-product-name",
        "productName",
        "Name of the Product",
        "text",
        true
      ),
      createField(
        "blending-date",
        "date",
        "Date",
        "date",
        true
      ),
      createField(
        "blending-ta-pd-bl",
        "taPdBl",
        "TA/PD/BL-"
      ),
      createField(
        "blending-distillation-lot",
        "distillationLotNo",
        "Distillation Lot No."
      ),
      createField(
        "blending-reaction-lot",
        "reactionLotNo",
        "Reaction Lot No."
      ),
      createField(
        "blending-lot-number",
        "blendingLotNo",
        "Blending Lot No.",
        "text",
        true
      ),
      createField(
        "blending-lot-qty",
        "lotQty",
        "Lot Qty",
        "number"
      ),
      createField(
        "blending-qty-charged",
        "qtyCharged",
        "Qty. in Kgs Charged",
        "number"
      ),
      createField(
        "blending-total-qty-charged",
        "totalQtyCharged",
        "Total Qty Charged in Kgs",
        "number"
      ),
      createField(
        "blending-operator",
        "operator",
        "Operator",
        "text",
        true
      ),
    ],
  },

  {
    id: "blending-activity",
    tableLayout: "ACTIVITY",
    title: "Activity",
    repeatable: true,
    fields: [
      createActivityField(
        "blending-cleanliness",
        "cleanliness",
        "Cleanliness of the blending unit checked by:"
      ),
      createActivityField(
        "blending-mf-charging-start",
        "mfChargingStarted",
        "MF charging started by:"
      ),
      createActivityField(
        "blending-old-material",
        "oldMaterialFgBlended",
        "Any old material FG blended:"
      ),
      createActivityField(
        "blending-mf-charging-completion",
        "mfChargingCompleted",
        "MF charging completed by:"
      ),
      createActivityField(
        "blending-sample-drawn",
        "sampleDrawn",
        "Sample drawn by:"
      ),
      createActivityField(
        "blending-sample-accepted",
        "sampleAccepted",
        "Sample accepted by:"
      ),
    ],
  },

  {
    id: "blending-deviations",
    title: "Deviations / Remarks",
    repeatable: false,
    fields: [
      createField(
        "blending-deviations",
        "deviationsRemarks",
        "Deviations / Remarks",
        "textarea"
      ),
    ],
  },

  createCheckedBySection("blending"),
  createApprovedBySection("blending"),
];

/*
 * ============================================================
 * PACKAGING
 * ============================================================
 */

const packagingForm: TechnicalFormSection[] = [
  {
    id: "packaging-header",
    title: "Header Information",
    repeatable: false,
    fields: [
      createField(
        "packaging-product-name",
        "productName",
        "Name of the Product",
        "text",
        true
      ),
      createField(
        "packaging-date",
        "date",
        "Date",
        "date",
        true
      ),
      createField(
        "packaging-ta-pd-p",
        "taPdP",
        "TA/PD/P-"
      ),
      createField(
        "packaging-distillation-lot",
        "distillationLotNo",
        "Distillation Lot No."
      ),
      createField(
        "packaging-reaction-lot",
        "reactionLotNo",
        "Reaction Lot No."
      ),
      createField(
        "packaging-blending-lot",
        "blendingLotNo",
        "Blending Lot No."
      ),
      createField(
        "packaging-packing-lot",
        "packingLotNo",
        "Packing Lot No.",
        "text",
        true
      ),
      createField(
        "packaging-qty-charged",
        "qtyCharged",
        "Qty. in Kgs Charged",
        "number"
      ),
      createField(
        "packaging-operator",
        "operator",
        "Operator",
        "text",
        true
      ),
    ],
  },

  {
    id: "packaging-activity",
    tableLayout: "ACTIVITY",
    title: "Activity",
    repeatable: true,
    fields: [
      createActivityField(
        "packaging-cleanliness",
        "cleanliness",
        "Cleanliness of the packing material checked by:"
      ),
      createActivityField(
        "packaging-fg-start",
        "fgPackingStarted",
        "FG Packing started by:"
      ),
      createActivityField(
        "packaging-fg-completed",
        "fgPackingCompleted",
        "FG Packing completed by:"
      ),
      createActivityField(
        "packaging-fg-sample-given",
        "fgSampleGiven",
        "FG sample given by:"
      ),
      createActivityField(
        "packaging-fg-sample-accepted",
        "fgSampleAccepted",
        "FG sample accepted by:"
      ),
      createActivityField(
        "packaging-total-time",
        "totalTimeTaken",
        "Total time taken:",
        "time"
      ),
      createActivityField(
        "packaging-total-fg-quantity",
        "totalFgQuantity",
        "Total FG Qty."
      ),
      createActivityField(
        "packaging-leftover",
        "totalFgLeftover",
        "Total FG leftover any:"
      ),
    ],
  },

  {
    id: "packaging-description",
    tableLayout: "GRID",
    title: "Packing Description",
    repeatable: true,
    fields: [
      createField(
        "packaging-description",
        "description",
        "Packing Description"
      ),
      createField(
        "packaging-std-qty",
        "stdQty",
        "Std Qty",
        "number"
      ),
      createField(
        "packaging-req-qty",
        "reqQty",
        "Req Qty",
        "number"
      ),
      createField(
        "packaging-nos",
        "nos",
        "Nos",
        "number"
      ),
      createField(
        "packaging-total-qty",
        "totalQty",
        "Total Qty",
        "number"
      ),
    ],
  },

  {
    id: "packaging-deviations",
    title: "Deviations / Remarks",
    repeatable: false,
    fields: [
      createField(
        "packaging-deviations",
        "deviationsRemarks",
        "Deviations / Remarks",
        "textarea"
      ),
    ],
  },

  createCheckedBySection("packaging"),
  createApprovedBySection("packaging"),
];

/*
 * ============================================================
 * CENTRIFUGE
 * ============================================================
 */

const centrifugeForm: TechnicalFormSection[] = [
  {
    id: "centrifuge-header",
    title: "Product Information",
    repeatable: false,
    fields: [
      createField(
        "centrifuge-product-name",
        "productName",
        "Name of Product",
        "text",
        true
      ),
      createField(
        "centrifuge-date",
        "date",
        "Date",
        "date",
        true
      ),
      createField(
        "centrifuge-ta-pd-cf",
        "taPdCf",
        "TA/PD/CF-"
      ),
      createField(
        "centrifuge-reaction-lot",
        "reactionLotNo",
        "Reaction Lot No."
      ),
      createField(
        "centrifuge-lot",
        "centrifugeLotNo",
        "Centrifuge Lot No.",
        "text",
        true
      ),
      createField(
        "centrifuge-qty-loaded",
        "qtyLoaded",
        "Qty in Kgs Loaded",
        "number"
      ),
      createField(
        "centrifuge-operator",
        "operator",
        "Operator",
        "text",
        true
      ),
    ],
  },

  {
    id: "centrifuge-activity",
    tableLayout: "ACTIVITY",
    title: "Activity",
    repeatable: true,
    fields: [
      createActivityField(
        "centrifuge-cleanliness",
        "cleanliness",
        "Cleanliness of the Centrifuge unit checked by:"
      ),
      createActivityField(
        "centrifuge-started",
        "centrifugationStarted",
        "Centrifugation started by:"
      ),
      createActivityField(
        "centrifuge-completed",
        "centrifugationCompleted",
        "Centrifugation completed by:"
      ),
      createActivityField(
        "centrifuge-water-wash",
        "waterWash",
        "Water wash given by:"
      ),
      createActivityField(
        "centrifuge-acid-alkali",
        "acidAlkaliWash",
        "Acid/Alkali wash given by:"
      ),
      createActivityField(
        "centrifuge-solvent-wash",
        "solventWash",
        "Solvent wash given by:"
      ),
      createActivityField(
        "centrifuge-sample-given",
        "sampleGiven",
        "Centrifuged sample given by:"
      ),
      createActivityField(
        "centrifuge-sample-accepted",
        "sampleAccepted",
        "Centrifuged sample accepted by:"
      ),
      createActivityField(
        "centrifuge-total-time",
        "totalTimeTaken",
        "Total time taken:"
      ),
      createActivityField(
        "centrifuge-wet-cake",
        "wetCakeQuantity",
        "Total Wet cake Qty."
      ),
    ],
  },

  {
    id: "centrifuge-deviations",
    title: "Deviations / Remarks",
    repeatable: false,
    fields: [
      createField(
        "centrifuge-deviations",
        "deviationsRemarks",
        "Deviations / Remarks",
        "textarea"
      ),
    ],
  },

  createCheckedBySection("centrifuge"),
  createApprovedBySection("centrifuge"),
];

/*
 * ============================================================
 * FBD
 * ============================================================
 */

const fbdForm: TechnicalFormSection[] = [
  {
    id: "fbd-header",
    title: "Product Information",
    repeatable: false,
    fields: [
      createField(
        "fbd-product-name",
        "productName",
        "Name of Product",
        "text",
        true
      ),
      createField(
        "fbd-date",
        "date",
        "Date",
        "date",
        true
      ),
      createField(
        "fbd-ta-pd-fbd",
        "taPdFbd",
        "TA/PD/FBD-"
      ),
      createField(
        "fbd-reaction-lot",
        "reactionLotNo",
        "Reaction Lot No."
      ),
      createField(
        "fbd-centrifuge-lot",
        "centrifugeLotNo",
        "Centrifuge Lot No."
      ),
      createField(
        "fbd-lot",
        "fbdLotNo",
        "FBD Lot No.",
        "text",
        true
      ),
      createField(
        "fbd-qty-loaded",
        "qtyLoaded",
        "Qty Loaded",
        "number"
      ),
      createField(
        "fbd-operator",
        "operator",
        "Operator",
        "text",
        true
      ),
    ],
  },

  {
    id: "fbd-activity",
    tableLayout: "ACTIVITY",
    title: "Activity",
    repeatable: true,
    fields: [
      createActivityField(
        "fbd-cleanliness",
        "cleanliness",
        "Cleanliness of the FBD unit checked by:"
      ),
      createActivityField(
        "fbd-started",
        "fbdStarted",
        "FBD started by:"
      ),
      createActivityField(
        "fbd-completed",
        "fbdCompleted",
        "FBD completed by:"
      ),
      createActivityField(
        "fbd-sample-given",
        "sampleGiven",
        "FBD sample given by:"
      ),
      createActivityField(
        "fbd-sample-accepted",
        "sampleAccepted",
        "FBD sample accepted by:"
      ),
      createActivityField(
        "fbd-total-time",
        "totalTimeTaken",
        "Total time taken:"
      ),
      createActivityField(
        "fbd-dry-cake",
        "dryCakeQuantity",
        "Total Dry cake Qty.:"
      ),
    ],
  },

  {
    id: "fbd-deviations",
    title: "Deviations / Remarks",
    repeatable: false,
    fields: [
      createField(
        "fbd-deviations",
        "deviationsRemarks",
        "Deviations / Remarks",
        "textarea"
      ),
    ],
  },

  createCheckedBySection("fbd"),
  createApprovedBySection("fbd"),
];

/*
 * ============================================================
 * FORM CONFIG FACTORY
 * ============================================================
 *
 * Product + Stage production forms are independently
 * configurable.
 *
 * Example:
 *
 * Product A → Distillation
 * Product B → Distillation
 *
 * are separate configurations.
 */

const cloneSections = (
  sections: TechnicalFormSection[]
): TechnicalFormSection[] =>
  sections.map((section) => ({
    ...section,

    fields: section.fields.map(
      (field) => ({
        ...field,
        options: [
          ...field.options,
        ],
      })
    ),

    tableColumns:
      section.tableColumns?.map(
        (column) => ({
          ...column,
          options: [
            ...(column.options ?? []),
          ],
        })
      ),
  }));

const createFormConfig = (
  id: string,
  productCode: string,
  stageId: string,
  stageName: string,
  sections: TechnicalFormSection[]
): TechnicalFormConfig => ({
  id,
  productCode,
  stageId,
  stageName,
  scope: "PRODUCT_STAGE",
  formType: "PRODUCTION",
  version: 1,
  status: "PUBLISHED",
  sections:
    cloneSections(sections),
  createdAt:
    "2026-08-01T09:00:00",
  updatedAt:
    "2026-08-01T09:00:00",
  publishedAt:
    "2026-08-01T09:00:00",
});

/*
 * ============================================================
 * GLOBAL QA/QC FORM
 * ============================================================
 *
 * There is ONE QA/QC form for the entire application.
 *
 * It is shared by:
 *
 * Product A → Every Stage
 * Product B → Every Stage
 * Product C → Every Stage
 * Product D → Every Stage
 *
 * Technical Team configures this form once.
 *
 * It is NOT duplicated per Product or Stage.
 */

const qaQcForm: TechnicalFormSection[] = [
  {
    id: "qa-qc-review-information",
    title: "Review Information",
    repeatable: false,
    fields: [
      createField(
        "qa-product-name",
        "productName",
        "Product Name",
        "text",
        true
      ),
      createField(
        "qa-product-code",
        "productCode",
        "Product Code",
        "text",
        true
      ),
      createField(
        "qa-process-stage",
        "processStage",
        "Process Stage",
        "text",
        true
      ),
      createField(
        "qa-lot-number",
        "lotNumber",
        "Lot Number",
        "text",
        true
      ),
      createField(
        "qa-operator",
        "operator",
        "Operator (QA/QC)",
        "text",
        true
      ),
      createField(
        "qa-sample-no",
        "qcSampleNo",
        "QC Sample No.",
        "text"
      ),
      createField(
        "qa-inspection-date",
        "inspectionDate",
        "Inspection Date",
        "date",
        true
      ),
    ],
  },

  {
    id: "qa-qc-inspection-parameters",
    tableLayout: "QA_INSPECTION",
    title: "QC Inspection Parameters",
    repeatable: true,

    fields: [
      createField(
        "qa-quantity",
        "quantity",
        "Quantity"
      ),
      createField(
        "qa-yield",
        "yield",
        "Yield (%)"
      ),
      createField(
        "qa-purity",
        "purity",
        "Purity (%)"
      ),
      createField(
        "qa-process-parameters",
        "processParameters",
        "Process Parameters"
      ),
      createField(
        "qa-specification",
        "specification",
        "Specification"
      ),
      createField(
        "qa-form-appearance",
        "formAppearance",
        "Form / Appearance"
      ),
      createField(
        "qa-test-results",
        "testResults",
        "Test Results"
      ),
      createField(
        "qa-equipment-used",
        "equipmentUsed",
        "Equipment Used"
      ),
      createField(
        "qa-method",
        "method",
        "Method"
      ),
      createField(
        "qa-column",
        "column",
        "Column"
      ),
    ],

    tableColumns: [
      createField(
        "qa-check-parameter",
        "qcCheckParameter",
        "QC Check / Parameter"
      ),
      createField(
        "qa-standard-specification",
        "standardSpecification",
        "Standard / Specification"
      ),
      createField(
        "qa-status",
        "status",
        "Status",
        "text"
      ),
      createField(
        "qa-remarks",
        "remarks",
        "Remarks",
        "textarea"
      ),
    ],
  },

  {
    id: "qa-qc-decision",
    title: "QC Decision",
    repeatable: false,
    fields: [
      createField(
        "qa-decision",
        "decision",
        "QC Decision",
        "radio",
        true,
        [
          "Approved",
          "Hold",
          "Rejected",
        ]
      ),
      createField(
        "qa-remarks",
        "qaQcRemarks",
        "QA/QC Remarks",
        "textarea",
        true
      ),
      createField(
        "qa-rejection-reason",
        "rejectionReason",
        "Rejection Reason",
        "textarea"
      ),
    ],
  },

  {
    id: "qa-qc-verification",
    title: "Verification & Approval",
    repeatable: false,
    fields: [
      createField(
        "qa-checked-name",
        "checkedByName",
        "Checked By - Name"
      ),
      createField(
        "qa-checked-signature",
        "checkedBySignature",
        "Checked By - Signature"
      ),
      createField(
        "qa-checked-date",
        "checkedByDate",
        "Checked By - Date",
        "date"
      ),
      createField(
        "qa-checked-time",
        "checkedByTime",
        "Checked By - Time",
        "time"
      ),
      createField(
        "qa-checked-remarks",
        "checkedByRemarks",
        "Checked By - Remarks",
        "textarea"
      ),
      createField(
        "qa-approved-name",
        "approvedByName",
        "Approved By - Name"
      ),
      createField(
        "qa-approved-signature",
        "approvedBySignature",
        "Approved By - Signature"
      ),
      createField(
        "qa-approved-date",
        "approvedByDate",
        "Approved By - Date",
        "date"
      ),
      createField(
        "qa-approved-time",
        "approvedByTime",
        "Approved By - Time",
        "time"
      ),
      createField(
        "qa-approved-remarks",
        "approvedByRemarks",
        "Approved By - Remarks",
        "textarea"
      ),
    ],
  },
];

/*
 * ============================================================
 * INITIAL TECHNICAL FORM CONFIGURATIONS
 * ============================================================
 *
 * Product A:
 * - Reaction
 * - Washing
 * - Recovery
 * - Distillation
 * - Blending
 * - Packaging
 * - Centrifuge
 * - FBD
 *
 * Product B:
 * - Reaction
 * - Distillation
 * - Blending
 * - Packaging
 *
 * Products C and D can be configured later.
 */

export const initialTechnicalFormConfigs: TechnicalFormConfig[] = [
  /*
   * ----------------------------------------------------------
   * PRODUCT 001
   * ----------------------------------------------------------
   */

  createFormConfig(
    "FORM-PROD001-REACTION",
    "PROD001",
    "REACTION",
    "Reaction",
    reactionForm
  ),

  createFormConfig(
    "FORM-PROD001-WASHING",
    "PROD001",
    "WASHING",
    "Washing",
    washingForm
  ),

  createFormConfig(
    "FORM-PROD001-RECOVERY",
    "PROD001",
    "RECOVERY",
    "Recovery",
    recoveryForm
  ),

  createFormConfig(
    "FORM-PROD001-DISTILLATION",
    "PROD001",
    "DISTILLATION",
    "Distillation",
    distillationForm
  ),

  createFormConfig(
    "FORM-PROD001-BLENDING",
    "PROD001",
    "BLENDING",
    "Blending",
    blendingForm
  ),

  createFormConfig(
    "FORM-PROD001-PACKAGING",
    "PROD001",
    "PACKAGING",
    "Packaging",
    packagingForm
  ),

  createFormConfig(
    "FORM-PROD001-CENTRIFUGE",
    "PROD001",
    "CENTRIFUGE",
    "Centrifuge",
    centrifugeForm
  ),

  createFormConfig(
    "FORM-PROD001-FBD",
    "PROD001",
    "FBD",
    "FBD",
    fbdForm
  ),

  /*
   * ----------------------------------------------------------
   * PRODUCT 002
   * ----------------------------------------------------------
   */

  createFormConfig(
    "FORM-PROD002-REACTION",
    "PROD002",
    "REACTION",
    "Reaction",
    reactionForm
  ),

  createFormConfig(
    "FORM-PROD002-DISTILLATION",
    "PROD002",
    "DISTILLATION",
    "Distillation",
    distillationForm
  ),

  createFormConfig(
    "FORM-PROD002-BLENDING",
    "PROD002",
    "BLENDING",
    "Blending",
    blendingForm
  ),

  createFormConfig(
    "FORM-PROD002-PACKAGING",
    "PROD002",
    "PACKAGING",
    "Packaging",
    packagingForm
  ),

  /*
   * ----------------------------------------------------------
   * GLOBAL QA/QC
   * ----------------------------------------------------------
   *
   * One configuration shared across every product and stage.
   */

  {
    id: "FORM-QA-QC-GLOBAL",

    productCode: "__GLOBAL__",

    stageId: "QA_QC",

    stageName: "QA/QC",

    scope: "GLOBAL",

    formType: "QA_QC",

    version: 1,

    status: "PUBLISHED",

    sections:
      cloneSections(qaQcForm),

    createdAt:
      "2026-08-01T09:00:00",

    updatedAt:
      "2026-08-01T09:00:00",

    publishedAt:
      "2026-08-01T09:00:00",
  },
];