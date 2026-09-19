import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  initialTechnicalEmployees,
  initialProductEmployeeAssignments,
  initialProductStageConfigurations,
  initialTechnicalFormConfigs,
  type Product,
  type TechnicalEmployee,
  type ProductEmployeeAssignment,
  type ProductStageConfiguration,
  type TechnicalFormConfig,
} from "../data/technicalData";

import {
  useProductData,
  type ProductOperationResult,
} from "./ProductContext";

/*
 * ============================================================
 * TECHNICAL REACTOR MACHINE
 * ============================================================
 */

export interface TechnicalReactorMachine {
  id: number;
  machineName: string;
  status: "ACTIVE" | "INACTIVE";
}

/*
 * ============================================================
 * PRODUCT → MACHINE ASSIGNMENT
 * ============================================================
 */

export interface ProductMachineAssignment {
  productCode: string;
  machineIds: number[];
}

/*
 * ============================================================
 * CONTEXT TYPE
 * ============================================================
 */

interface TechnicalDataContextType {
  /*
   * Shared Product Master
   *
   * Product data is owned by ProductContext.
   * These values are exposed here as compatibility access
   * for existing Technical pages.
   */
  products: Product[];

  /*
   * Employee Master
   *
   * Employees are created and maintained by Admin.
   */
  employees: TechnicalEmployee[];

  /*
   * Technical configuration
   */
  machines: TechnicalReactorMachine[];

  productMachineAssignments: ProductMachineAssignment[];

  productEmployeeAssignments: ProductEmployeeAssignment[];

  productStageConfigurations: ProductStageConfiguration[];

  formConfigs: TechnicalFormConfig[];

  /*
   * ==========================================================
   * PRODUCT MASTER
   * ==========================================================
   */

  addProduct: (
    product: Product
  ) => ProductOperationResult;

  updateProduct: (
    productId: string,
    updatedProduct: Partial<Product>
  ) => ProductOperationResult;

  /*
   * ==========================================================
   * MACHINES
   * ==========================================================
   */

  addMachine: (
    machine: TechnicalReactorMachine
  ) => void;

  updateMachine: (
    machineId: number,
    updatedMachine: Partial<TechnicalReactorMachine>
  ) => void;

  /*
   * ==========================================================
   * PRODUCT → MACHINE
   * ==========================================================
   */

  updateProductMachineAssignment: (
    productCode: string,
    machineIds: number[]
  ) => void;

  /*
   * ==========================================================
   * PRODUCT → EMPLOYEE
   * ==========================================================
   */

  updateProductEmployeeAssignment: (
    productCode: string,
    employeeIds: string[]
  ) => void;

  /*
   * ==========================================================
   * PRODUCT → STAGES
   * ==========================================================
   */

  updateProductStageConfiguration: (
    productCode: string,
    stages: string[]
  ) => void;

  /*
   * ==========================================================
   * FORM CONFIGURATION
   * ==========================================================
   */

  saveFormDraft: (
    formConfig: TechnicalFormConfig
  ) => TechnicalFormConfig;

  publishForm: (
    formConfig: TechnicalFormConfig
  ) => TechnicalFormConfig;

  getFormConfig: (
    productCode: string,
    stageId: string
  ) => TechnicalFormConfig | undefined;
}

/*
 * ============================================================
 * CONTEXT
 * ============================================================
 */

const TechnicalDataContext =
  createContext<
    TechnicalDataContextType | undefined
  >(undefined);

/*
 * ============================================================
 * PRODUCT CODE NORMALIZATION
 * ============================================================
 */

const normalizeProductCode = (
  productCode: string
): string =>
  productCode.trim().toUpperCase();

/*
 * ============================================================
 * FORM CLONING
 * ============================================================
 */

const cloneFormConfig = (
  formConfig: TechnicalFormConfig
): TechnicalFormConfig => ({
  ...formConfig,

  sections:
    formConfig.sections.map(
      (section) => ({
        ...section,

        fields:
          section.fields.map(
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
                ...column.options,
              ],
            })
          ),
      })
    ),
});

/*
 * ============================================================
 * FORM SCOPE MATCHING
 * ============================================================
 */

const isSameFormConfiguration = (
  config: TechnicalFormConfig,
  incoming: TechnicalFormConfig
): boolean => {
  /*
   * Global QA/QC form
   */
  if (
    incoming.scope === "GLOBAL" &&
    incoming.formType === "QA_QC"
  ) {
    return (
      config.scope === "GLOBAL" &&
      config.formType === "QA_QC"
    );
  }

  /*
   * Product + Stage Production form
   */
  return (
    config.scope ===
      "PRODUCT_STAGE" &&
    config.formType ===
      "PRODUCTION" &&
    config.productCode ===
      incoming.productCode &&
    config.stageId ===
      incoming.stageId
  );
};

/*
 * ============================================================
 * PROVIDER
 * ============================================================
 */

export const TechnicalDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  /*
   * ==========================================================
   * SHARED PRODUCT MASTER
   * ==========================================================
   *
   * Product state is now owned by ProductContext.
   *
   * Existing Technical pages can continue using:
   *
   * useTechnicalData().products
   * useTechnicalData().addProduct
   * useTechnicalData().updateProduct
   *
   * while Admin and Technical ultimately share the same
   * Product Master.
   */

  const {
    products,
    addProduct,
    updateProduct,
  } = useProductData();

  /*
   * ==========================================================
   * EMPLOYEE MASTER
   * ==========================================================
   */

  const [employees] =
    useState<TechnicalEmployee[]>(
      initialTechnicalEmployees
    );

  /*
   * ==========================================================
   * REACTOR MACHINES
   * ==========================================================
   */

  const [machines, setMachines] =
    useState<
      TechnicalReactorMachine[]
    >([
      {
        id: 1,
        machineName: "Reactor-101",
        status: "ACTIVE",
      },
      {
        id: 2,
        machineName: "Reactor-102",
        status: "ACTIVE",
      },
      {
        id: 3,
        machineName: "Reactor-103",
        status: "ACTIVE",
      },
      {
        id: 4,
        machineName: "Reactor-104",
        status: "INACTIVE",
      },
    ]);

  /*
   * ==========================================================
   * PRODUCT → MACHINE
   * ==========================================================
   */

  const [
    productMachineAssignments,
    setProductMachineAssignments,
  ] =
    useState<
      ProductMachineAssignment[]
    >([
      {
        productCode: "PROD001",
        machineIds: [1, 2],
      },
      {
        productCode: "PROD002",
        machineIds: [2, 3],
      },
      {
        productCode: "PROD003",
        machineIds: [],
      },
      {
        productCode: "PROD004",
        machineIds: [],
      },
    ]);

  /*
   * ==========================================================
   * PRODUCT → EMPLOYEE
   * ==========================================================
   */

  const [
    productEmployeeAssignments,
    setProductEmployeeAssignments,
  ] =
    useState<
      ProductEmployeeAssignment[]
    >(
      initialProductEmployeeAssignments
    );

  /*
   * ==========================================================
   * PRODUCT → STAGES
   * ==========================================================
   */

  const [
    productStageConfigurations,
    setProductStageConfigurations,
  ] =
    useState<
      ProductStageConfiguration[]
    >(
      initialProductStageConfigurations
    );

  /*
   * ==========================================================
   * FORM CONFIGURATIONS
   * ==========================================================
   */

  const [
    formConfigs,
    setFormConfigs,
  ] =
    useState<
      TechnicalFormConfig[]
    >(
      initialTechnicalFormConfigs
    );

  /*
   * ==========================================================
   * MACHINES
   * ==========================================================
   */

  const addMachine = (
    machine: TechnicalReactorMachine
  ) => {
    setMachines(
      (currentMachines) => [
        ...currentMachines,
        machine,
      ]
    );
  };

  const updateMachine = (
    machineId: number,
    updatedMachine: Partial<TechnicalReactorMachine>
  ) => {
    setMachines(
      (currentMachines) =>
        currentMachines.map(
          (machine) =>
            machine.id === machineId
              ? {
                  ...machine,
                  ...updatedMachine,
                }
              : machine
        )
    );
  };

  /*
   * ==========================================================
   * PRODUCT → MACHINE
   * ==========================================================
   */

  const updateProductMachineAssignment = (
    productCode: string,
    machineIds: number[]
  ) => {
    const normalizedProductCode =
      normalizeProductCode(
        productCode
      );

    setProductMachineAssignments(
      (currentAssignments) => {
        const existingAssignment =
          currentAssignments.find(
            (assignment) =>
              normalizeProductCode(
                assignment.productCode
              ) ===
              normalizedProductCode
          );

        if (existingAssignment) {
          return currentAssignments.map(
            (assignment) =>
              normalizeProductCode(
                assignment.productCode
              ) ===
              normalizedProductCode
                ? {
                    ...assignment,
                    productCode:
                      normalizedProductCode,
                    machineIds: [
                      ...machineIds,
                    ],
                  }
                : assignment
          );
        }

        return [
          ...currentAssignments,
          {
            productCode:
              normalizedProductCode,
            machineIds: [
              ...machineIds,
            ],
          },
        ];
      }
    );
  };

  /*
   * ==========================================================
   * PRODUCT → EMPLOYEE
   * ==========================================================
   */

  const updateProductEmployeeAssignment = (
    productCode: string,
    employeeIds: string[]
  ) => {
    const normalizedProductCode =
      normalizeProductCode(
        productCode
      );

    setProductEmployeeAssignments(
      (currentAssignments) => {
        const existingAssignment =
          currentAssignments.find(
            (assignment) =>
              normalizeProductCode(
                assignment.productCode
              ) ===
              normalizedProductCode
          );

        if (existingAssignment) {
          return currentAssignments.map(
            (assignment) =>
              normalizeProductCode(
                assignment.productCode
              ) ===
              normalizedProductCode
                ? {
                    ...assignment,
                    productCode:
                      normalizedProductCode,
                    employeeIds: [
                      ...employeeIds,
                    ],
                  }
                : assignment
          );
        }

        return [
          ...currentAssignments,
          {
            productCode:
              normalizedProductCode,
            employeeIds: [
              ...employeeIds,
            ],
          },
        ];
      }
    );
  };

  /*
   * ==========================================================
   * PRODUCT → STAGES
   * ==========================================================
   */

  const updateProductStageConfiguration = (
    productCode: string,
    stages: string[]
  ) => {
    const normalizedProductCode =
      normalizeProductCode(
        productCode
      );

    setProductStageConfigurations(
      (currentConfigurations) => {
        const existingConfiguration =
          currentConfigurations.find(
            (configuration) =>
              normalizeProductCode(
                configuration.productCode
              ) ===
              normalizedProductCode
          );

        if (existingConfiguration) {
          return currentConfigurations.map(
            (configuration) =>
              normalizeProductCode(
                configuration.productCode
              ) ===
              normalizedProductCode
                ? {
                    ...configuration,
                    productCode:
                      normalizedProductCode,
                    stages: [
                      ...stages,
                    ],
                  }
                : configuration
          );
        }

        return [
          ...currentConfigurations,
          {
            productCode:
              normalizedProductCode,
            stages: [
              ...stages,
            ],
          },
        ];
      }
    );
  };

  /*
   * ==========================================================
   * FORM CONFIGURATION
   * ==========================================================
   */

  const saveFormDraft = (
    incomingFormConfig: TechnicalFormConfig
  ): TechnicalFormConfig => {
    const now =
      new Date().toISOString();

    let savedDraft:
      | TechnicalFormConfig
      | undefined;

    setFormConfigs(
      (currentConfigs) => {
        const existingDraft =
          currentConfigs.find(
            (config) =>
              isSameFormConfiguration(
                config,
                incomingFormConfig
              ) &&
              config.status ===
                "DRAFT"
          );

        if (existingDraft) {
          savedDraft = {
            ...cloneFormConfig(
              incomingFormConfig
            ),

            id: existingDraft.id,

            status: "DRAFT",

            version:
              existingDraft.version,

            createdAt:
              existingDraft.createdAt,

            updatedAt: now,

            publishedAt:
              undefined,
          };

          return currentConfigs.map(
            (config) =>
              config.id ===
              existingDraft.id
                ? cloneFormConfig(
                    savedDraft!
                  )
                : config
          );
        }

        const publishedVersions =
          currentConfigs
            .filter(
              (config) =>
                isSameFormConfiguration(
                  config,
                  incomingFormConfig
                ) &&
                config.status ===
                  "PUBLISHED"
            )
            .map(
              (config) =>
                config.version
            );

        const latestPublishedVersion =
          publishedVersions.length >
          0
            ? Math.max(
                ...publishedVersions
              )
            : 0;

        const newDraftVersion =
          latestPublishedVersion +
          1;

        const formIdentifier =
          incomingFormConfig.scope ===
          "GLOBAL"
            ? "QA-QC-GLOBAL"
            : `${incomingFormConfig.productCode}-${incomingFormConfig.stageId}`;

        savedDraft = {
          ...cloneFormConfig(
            incomingFormConfig
          ),

          id: `FORM-${formIdentifier}-DRAFT-V${newDraftVersion}-${Date.now()}`,

          version:
            newDraftVersion,

          status: "DRAFT",

          createdAt: now,

          updatedAt: now,

          publishedAt:
            undefined,
        };

        return [
          ...currentConfigs,
          cloneFormConfig(
            savedDraft
          ),
        ];
      }
    );

    return cloneFormConfig(
      savedDraft ??
        incomingFormConfig
    );
  };

  /*
   * ==========================================================
   * PUBLISH FORM
   * ==========================================================
   */

  const publishForm = (
    incomingFormConfig: TechnicalFormConfig
  ): TechnicalFormConfig => {
    const now =
      new Date().toISOString();

    let publishedConfig:
      | TechnicalFormConfig
      | undefined;

    setFormConfigs(
      (currentConfigs) => {
        const publishedVersions =
          currentConfigs
            .filter(
              (config) =>
                isSameFormConfiguration(
                  config,
                  incomingFormConfig
                ) &&
                config.status ===
                  "PUBLISHED"
            )
            .map(
              (config) =>
                config.version
            );

        const latestPublishedVersion =
          publishedVersions.length >
          0
            ? Math.max(
                ...publishedVersions
              )
            : 0;

        const newVersion =
          Math.max(
            incomingFormConfig.version,
            latestPublishedVersion +
              1
          );

        const formIdentifier =
          incomingFormConfig.scope ===
          "GLOBAL"
            ? "QA-QC-GLOBAL"
            : `${incomingFormConfig.productCode}-${incomingFormConfig.stageId}`;

        publishedConfig = {
          ...cloneFormConfig(
            incomingFormConfig
          ),

          id: `FORM-${formIdentifier}-V${newVersion}`,

          version:
            newVersion,

          status: "PUBLISHED",

          createdAt:
            incomingFormConfig.createdAt ||
            now,

          updatedAt: now,

          publishedAt: now,
        };

        return [
          ...currentConfigs.filter(
            (config) =>
              !(
                isSameFormConfiguration(
                  config,
                  incomingFormConfig
                ) &&
                config.status ===
                  "DRAFT"
              )
          ),

          cloneFormConfig(
            publishedConfig
          ),
        ];
      }
    );

    return cloneFormConfig(
      publishedConfig ??
        incomingFormConfig
    );
  };

  /*
   * ==========================================================
   * GET FORM CONFIGURATION
   * ==========================================================
   */

  const getFormConfig = (
    productCode: string,
    stageId: string
  ): TechnicalFormConfig | undefined => {
    const isGlobalQaQc =
      stageId === "QA_QC";

    const matchingConfigs =
      formConfigs.filter(
        (config) => {
          if (isGlobalQaQc) {
            return (
              config.scope ===
                "GLOBAL" &&
              config.formType ===
                "QA_QC"
            );
          }

          return (
            config.scope ===
              "PRODUCT_STAGE" &&
            config.formType ===
              "PRODUCTION" &&
            normalizeProductCode(
              config.productCode
            ) ===
              normalizeProductCode(
                productCode
              ) &&
            config.stageId ===
              stageId
          );
        }
      );

    /*
     * Latest Draft
     */

    const draft =
      matchingConfigs
        .filter(
          (config) =>
            config.status ===
            "DRAFT"
        )
        .sort(
          (a, b) =>
            b.version -
            a.version
        )[0];

    if (draft) {
      return cloneFormConfig(
        draft
      );
    }

    /*
     * Latest Published
     */

    const published =
      matchingConfigs
        .filter(
          (config) =>
            config.status ===
            "PUBLISHED"
        )
        .sort(
          (a, b) =>
            b.version -
            a.version
        )[0];

    if (!published) {
      return undefined;
    }

    return cloneFormConfig(
      published
    );
  };

  /*
   * ==========================================================
   * PROVIDER VALUE
   * ==========================================================
   */

  return (
    <TechnicalDataContext.Provider
      value={{
        /*
         * Shared Product Master
         */
        products,

        /*
         * Employee Master
         */
        employees,

        /*
         * Technical configuration
         */
        machines,

        productMachineAssignments,

        productEmployeeAssignments,

        productStageConfigurations,

        formConfigs,

        /*
         * Product Master operations
         *
         * These are delegated to the shared ProductContext.
         */
        addProduct,
        updateProduct,

        /*
         * Machine operations
         */
        addMachine,
        updateMachine,

        /*
         * Assignment operations
         */
        updateProductMachineAssignment,

        updateProductEmployeeAssignment,

        /*
         * Stage configuration
         */
        updateProductStageConfiguration,

        /*
         * Form configuration
         */
        saveFormDraft,
        publishForm,

        getFormConfig,
      }}
    >
      {children}
    </TechnicalDataContext.Provider>
  );
};

/*
 * ============================================================
 * HOOK
 * ============================================================
 */

export const useTechnicalData =
  () => {
    const context =
      useContext(
        TechnicalDataContext
      );

    if (!context) {
      throw new Error(
        "useTechnicalData must be used within TechnicalDataProvider"
      );
    }

    return context;
  };