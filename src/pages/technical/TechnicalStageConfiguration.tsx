import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTechnicalData } from "../../context/TechnicalDataContext";
import "./TechnicalStageConfiguration.css";

/* ==================================================
   STAGE MASTER
================================================== */

interface StageMaster {
  id: string;
  name: string;
  mandatory?: boolean;
}

const FINAL_BATCH_STAGE_ID = "FINAL_BATCH_SHEET";

const STAGES: StageMaster[] = [
  {
    id: "REACTION",
    name: "Reaction",
  },
  {
    id: "WASHING",
    name: "Washing",
  },
  {
    id: "RECOVERY",
    name: "Recovery",
  },
  {
    id: "DISTILLATION",
    name: "Distillation",
  },
  {
    id: "BLENDING",
    name: "Blending",
  },
  {
    id: "PACKAGING",
    name: "Packing",
  },
  {
    id: "CENTRIFUGE",
    name: "Centrifuge",
  },
  {
    id: "FBD",
    name: "FBD",
  },
  {
    id: FINAL_BATCH_STAGE_ID,
    name: "Generate Final Batch Sheet for Admin",
    mandatory: true,
  },
];

/* ==================================================
   NORMAL PRODUCTION STAGES
================================================== */

const PRODUCTION_STAGES = STAGES.filter(
  (stage) => stage.id !== FINAL_BATCH_STAGE_ID
);

/* ==================================================
   COMPONENT
================================================== */

const TechnicalStageConfiguration = () => {
  const navigate = useNavigate();

  const {
    products,
    productStageConfigurations,
    updateProductStageConfiguration,
  } = useTechnicalData();

  /* ==================================================
     STATE
  ================================================== */

  const [selectedProductCode, setSelectedProductCode] =
    useState("");

  const [selectedStages, setSelectedStages] = useState<string[]>(
    []
  );

  const [showSavePopup, setShowSavePopup] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

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
     CURRENT PRODUCT CONFIGURATION
  ================================================== */

  const currentConfiguration = useMemo(
    () =>
      productStageConfigurations.find(
        (configuration) =>
          configuration.productCode === selectedProductCode
      ),
    [
      productStageConfigurations,
      selectedProductCode,
    ]
  );

  /* ==================================================
     LOAD CONFIGURATION WHEN PRODUCT CHANGES
  ================================================== */

  useEffect(() => {
    if (!selectedProductCode) {
      setSelectedStages([]);
      return;
    }

    const configuration =
      productStageConfigurations.find(
        (item) =>
          item.productCode === selectedProductCode
      );

    /*
     * Always make sure the mandatory final batch-sheet
     * action exists and remains the final item.
     *
     * Existing configurations are preserved.
     */
    const configuredStages =
      configuration?.stages
        ? [...configuration.stages]
        : [];

    const productionStages = configuredStages.filter(
      (stageId) =>
        stageId !== FINAL_BATCH_STAGE_ID
    );

    setSelectedStages([
      ...productionStages,
      FINAL_BATCH_STAGE_ID,
    ]);
  }, [
    selectedProductCode,
    productStageConfigurations,
  ]);

  /* ==================================================
     PRODUCT CHANGE
  ================================================== */

  const handleProductChange = (
    productCode: string
  ) => {
    setSelectedProductCode(productCode);
    setShowSavePopup(false);
  };

  /* ==================================================
     STAGE TOGGLE
  ================================================== */

  const handleStageToggle = (
    stageId: string
  ) => {
    if (isSaving) return;

    /*
     * Generate Final Batch Sheet for Admin is mandatory
     * for every product and therefore cannot be removed.
     */
    if (stageId === FINAL_BATCH_STAGE_ID) {
      return;
    }

    setSelectedStages((currentStages) => {
      if (currentStages.includes(stageId)) {
        return currentStages.filter(
          (id) => id !== stageId
        );
      }

      /*
       * Always insert normal stages before the mandatory
       * final batch-sheet action.
       */
      const withoutFinalBatch =
        currentStages.filter(
          (id) => id !== FINAL_BATCH_STAGE_ID
        );

      return [
        ...withoutFinalBatch,
        stageId,
        FINAL_BATCH_STAGE_ID,
      ];
    });
  };

  /* ==================================================
     MOVE STAGE UP
  ================================================== */

  const handleMoveUp = (
    index: number
  ) => {
    if (index === 0 || isSaving) return;

    /*
     * The mandatory final batch-sheet action must always
     * remain at the end of the sequence.
     */
    if (
      selectedStages[index] ===
      FINAL_BATCH_STAGE_ID
    ) {
      return;
    }

    const currentFinalIndex =
      selectedStages.indexOf(
        FINAL_BATCH_STAGE_ID
      );

    if (
      currentFinalIndex !== -1 &&
      index >= currentFinalIndex
    ) {
      return;
    }

    setSelectedStages((currentStages) => {
      const updatedStages = [...currentStages];

      [
        updatedStages[index - 1],
        updatedStages[index],
      ] = [
        updatedStages[index],
        updatedStages[index - 1],
      ];

      return updatedStages;
    });
  };

  /* ==================================================
     MOVE STAGE DOWN
  ================================================== */

  const handleMoveDown = (
    index: number
  ) => {
    if (
      index ===
        selectedStages.length - 1 ||
      isSaving
    ) {
      return;
    }

    /*
     * The mandatory final batch-sheet action must always
     * remain at the end of the sequence.
     */
    if (
      selectedStages[index] ===
      FINAL_BATCH_STAGE_ID
    ) {
      return;
    }

    if (
      selectedStages[index + 1] ===
      FINAL_BATCH_STAGE_ID
    ) {
      return;
    }

    setSelectedStages((currentStages) => {
      const updatedStages = [...currentStages];

      [
        updatedStages[index],
        updatedStages[index + 1],
      ] = [
        updatedStages[index + 1],
        updatedStages[index],
      ];

      return updatedStages;
    });
  };

  /* ==================================================
     SAVE CONFIGURATION
  ================================================== */

  const handleSaveConfiguration = () => {
    if (
      !selectedProductCode ||
      isSaving
    ) {
      return;
    }

    setIsSaving(true);
    setShowSavePopup(false);

    /*
     * Always save the mandatory final batch-sheet action
     * as the final item.
     */
    const productionStages =
      selectedStages.filter(
        (stageId) =>
          stageId !== FINAL_BATCH_STAGE_ID
      );

    const stagesToSave = [
      ...productionStages,
      FINAL_BATCH_STAGE_ID,
    ];

    /*
     * Save the configuration.
     *
     * The current frontend context update is
     * synchronous. A short delay is used here only
     * to provide clear visual feedback to the user.
     */
    setTimeout(() => {
      updateProductStageConfiguration(
        selectedProductCode,
        stagesToSave
      );

      setSelectedStages(stagesToSave);

      setIsSaving(false);
      setShowSavePopup(true);
    }, 500);
  };

  /* ==================================================
     HELPERS
  ================================================== */

  const getStageName = (
    stageId: string
  ) => {
    return (
      STAGES.find(
        (stage) => stage.id === stageId
      )?.name ?? stageId
    );
  };

  const selectedProduct = products.find(
    (product) =>
      product.productCode ===
      selectedProductCode
  );

  /*
   * A product is considered configured only when
   * a configuration exists AND at least one normal
   * production stage has been saved.
   *
   * The mandatory final batch-sheet action itself
   * does not count as a production stage.
   */
  const isConfigured =
    (currentConfiguration?.stages?.filter(
      (stageId) =>
        stageId !== FINAL_BATCH_STAGE_ID
    ).length ?? 0) > 0;

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div className="technical-stage-page">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="technical-stage-header">
        <div>
          <h1>Process / Stage Configuration</h1>

          <p>
            Configure the applicable production stages
            and their normal process sequence for each
            product.
          </p>
        </div>

        <button
          type="button"
          className="technical-stage-back-button"
          onClick={() => navigate("/technical")}
          disabled={isSaving}
        >
          Back
        </button>
      </div>

      {/* ==================================================
          PRODUCT SELECTION
      ================================================== */}

      <section className="technical-stage-card product-selection-card">
        <div className="technical-stage-card-title">
          <div>
            <h2>Select Product</h2>

            <p>
              Select a product to configure its
              production process.
            </p>
          </div>
        </div>

        <div className="technical-stage-card-body">
          <div className="technical-stage-field">
            <label htmlFor="stage-product-select">
              Product
            </label>

            <select
              id="stage-product-select"
              value={selectedProductCode}
              onChange={(event) =>
                handleProductChange(
                  event.target.value
                )
              }
              disabled={isSaving}
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

          {selectedProduct && (
            <div className="selected-product-info">
              <div>
                <span className="selected-product-label">
                  Product Code
                </span>

                <strong>
                  {selectedProduct.productCode}
                </strong>
              </div>

              <div>
                <span className="selected-product-label">
                  Product Name
                </span>

                <strong>
                  {selectedProduct.productName}
                </strong>
              </div>

              <div>
                <span className="selected-product-label">
                  Configuration
                </span>

                <span
                  className={`configuration-status ${
                    isConfigured
                      ? "configured"
                      : "not-configured"
                  }`}
                >
                  {isConfigured
                    ? "Configured"
                    : "Not Configured"}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          STAGE CONFIGURATION
      ================================================== */}

      {selectedProductCode && (
        <>
          <section className="technical-stage-card">
            <div className="technical-stage-card-title">
              <div>
                <h2>Applicable Stages</h2>

                <p>
                  Select the stages that are applicable
                  to this product.
                </p>
              </div>

              <span className="stage-count">
                {
                  selectedStages.filter(
                    (stageId) =>
                      stageId !==
                      FINAL_BATCH_STAGE_ID
                  ).length
                }{" "}
                {
                  selectedStages.filter(
                    (stageId) =>
                      stageId !==
                      FINAL_BATCH_STAGE_ID
                  ).length === 1
                    ? "Stage"
                    : "Stages"
                }
              </span>
            </div>

            <div className="technical-stage-card-body">
              <div className="stage-checkbox-grid">
                {PRODUCTION_STAGES.map((stage) => {
                  const isSelected =
                    selectedStages.includes(
                      stage.id
                    );

                  return (
                    <label
                      key={stage.id}
                      className={`stage-checkbox-item ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleStageToggle(
                            stage.id
                          )
                        }
                        disabled={isSaving}
                      />

                      <span className="stage-checkbox-content">
                        <span className="stage-checkbox-name">
                          {stage.name}
                        </span>

                        <span className="stage-checkbox-id">
                          {stage.id}
                        </span>
                      </span>
                    </label>
                  );
                })}

                {/* ==================================================
                    MANDATORY FINAL BATCH SHEET
                ================================================== */}

                <label
                  className="stage-checkbox-item selected mandatory-stage-item"
                >
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    readOnly
                  />

                  <span className="stage-checkbox-content">
                    <span className="stage-checkbox-name">
                      Generate Final Batch Sheet
                      for Admin
                    </span>

                    <span className="stage-checkbox-id">
                      {FINAL_BATCH_STAGE_ID}
                    </span>

                    <span className="mandatory-stage-note">
                      Mandatory for all products
                    </span>
                  </span>
                </label>
              </div>

              {/* ==================================================
                  MANDATORY NOTE
              ================================================== */}

              <div className="mandatory-stage-information">
                <strong>Note:</strong> Generate Final
                Batch Sheet for Admin is mandatory for
                all products and must be included in
                every product's process configuration.
              </div>
            </div>
          </section>

          {/* ==================================================
              PROCESS SEQUENCE
          ================================================== */}

          <section className="technical-stage-card sequence-card">
            <div className="technical-stage-card-title">
              <div>
                <h2>Process Sequence</h2>

                <p>
                  Arrange the selected stages in the
                  normal production sequence.
                </p>
              </div>

              <span className="sequence-info">
                {selectedStages.length > 0
                  ? `${selectedStages.length} items in sequence`
                  : "No stages selected"}
              </span>
            </div>

            <div className="technical-stage-card-body">
              {selectedStages.length === 0 ? (
                <div className="sequence-empty-state">
                  <h3>
                    No Stages Selected
                  </h3>

                  <p>
                    Select applicable stages above to
                    create the normal production
                    sequence.
                  </p>
                </div>
              ) : (
                <div className="sequence-list">
                  {selectedStages.map(
                    (stageId, index) => {
                      const isFinalBatchStage =
                        stageId ===
                        FINAL_BATCH_STAGE_ID;

                      return (
                        <div
                          key={stageId}
                          className={`sequence-item ${
                            isFinalBatchStage
                              ? "mandatory-sequence-item"
                              : ""
                          }`}
                        >
                          <div className="sequence-number">
                            {index + 1}
                          </div>

                          <div className="sequence-stage-info">
                            <strong>
                              {getStageName(
                                stageId
                              )}
                            </strong>

                            <span>
                              {stageId}
                            </span>

                            {isFinalBatchStage && (
                              <small className="mandatory-sequence-note">
                                Mandatory final
                                action for all
                                products
                              </small>
                            )}
                          </div>

                          <div className="sequence-actions">
                            {isFinalBatchStage ? (
                              <span className="sequence-locked-label">
                                🔒 Final
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="sequence-move-button"
                                  onClick={() =>
                                    handleMoveUp(
                                      index
                                    )
                                  }
                                  disabled={
                                    index === 0 ||
                                    isSaving
                                  }
                                  aria-label={`Move ${getStageName(
                                    stageId
                                  )} up`}
                                >
                                  ↑
                                </button>

                                <button
                                  type="button"
                                  className="sequence-move-button"
                                  onClick={() =>
                                    handleMoveDown(
                                      index
                                    )
                                  }
                                  disabled={
                                    index ===
                                      selectedStages.length -
                                        1 ||
                                    selectedStages[
                                      index + 1
                                    ] ===
                                      FINAL_BATCH_STAGE_ID ||
                                    isSaving
                                  }
                                  aria-label={`Move ${getStageName(
                                    stageId
                                  )} down`}
                                >
                                  ↓
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              SAVE AREA
          ================================================== */}

          <div className="technical-stage-actions">
            <button
              type="button"
              className="technical-stage-cancel-button"
              onClick={() =>
                navigate("/technical")
              }
              disabled={isSaving}
            >
              Back
            </button>

            <div className="technical-stage-save-area">
              <button
                type="button"
                className="technical-stage-save-button"
                onClick={
                  handleSaveConfiguration
                }
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : "Save Configuration"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ==================================================
          SAVE CONFIRMATION POPUP
      ================================================== */}

      {showSavePopup && (
        <div className="technical-stage-popup-overlay">
          <div className="technical-stage-popup">
            <div className="technical-stage-popup-icon">
              ✓
            </div>

            <h3>Configuration Saved</h3>

            <p>
              Process / Stage Configuration has been
              saved successfully.
            </p>

            <button
              type="button"
              className="technical-stage-popup-button"
              onClick={() =>
                setShowSavePopup(false)
              }
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalStageConfiguration;