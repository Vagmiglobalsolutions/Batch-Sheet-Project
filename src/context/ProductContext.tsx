import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  initialProducts,
  type Product,
} from "../data/technicalData";

/*
 * ============================================================
 * PRODUCT OPERATION RESULT
 * ============================================================
 *
 * Shared by Admin and Technical Product Master.
 */

export interface ProductOperationResult {
  success: boolean;
  message?: string;
}

/*
 * ============================================================
 * CONTEXT TYPE
 * ============================================================
 */

interface ProductContextType {
  /*
   * Shared Product Master
   */
  products: Product[];

  /*
   * Product Master operations
   */
  addProduct: (
    product: Product
  ) => ProductOperationResult;

  updateProduct: (
    productId: string,
    updatedProduct: Partial<Product>
  ) => ProductOperationResult;
}

/*
 * ============================================================
 * CONTEXT
 * ============================================================
 */

const ProductContext =
  createContext<ProductContextType | undefined>(
    undefined
  );

/*
 * ============================================================
 * PRODUCT CODE NORMALIZATION
 * ============================================================
 *
 * Product Code is the unique identity.
 *
 * Example:
 *
 * "prod005"
 * " PROD005 "
 *
 * are treated as the same Product Code.
 */

const normalizeProductCode = (
  productCode: string
): string =>
  productCode.trim().toUpperCase();

/*
 * ============================================================
 * PROVIDER
 * ============================================================
 *
 * This is the single Product Master source of truth.
 *
 * Both Admin and Technical will use this same provider.
 */

export const ProductProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [products, setProducts] =
    useState<Product[]>(
      initialProducts
    );

  /*
   * ==========================================================
   * ADD PRODUCT
   * ==========================================================
   */

  const addProduct = (
    product: Product
  ): ProductOperationResult => {
    const normalizedProductCode =
      normalizeProductCode(
        product.productCode
      );

    /*
     * Product Code cannot be empty.
     */

    if (!normalizedProductCode) {
      return {
        success: false,
        message:
          "Product Code is required.",
      };
    }

    /*
     * Product Name cannot be empty.
     */

    if (
      !product.productName.trim()
    ) {
      return {
        success: false,
        message:
          "Product Name is required.",
      };
    }

    /*
     * Product Code must be unique.
     */

    const existingProduct =
      products.find(
        (existingProduct) =>
          normalizeProductCode(
            existingProduct.productCode
          ) ===
          normalizedProductCode
      );

    if (existingProduct) {
      return {
        success: false,
        message: `Product Code ${normalizedProductCode} already exists in the Product Master. Please select the existing product instead.`,
      };
    }

    /*
     * Store Product Code in normalized form.
     */

    const productToAdd: Product = {
      ...product,
      productCode:
        normalizedProductCode,
    };

    setProducts(
      (currentProducts) => [
        ...currentProducts,
        productToAdd,
      ]
    );

    return {
      success: true,
      message:
        "Product added successfully.",
    };
  };

  /*
   * ==========================================================
   * UPDATE PRODUCT
   * ==========================================================
   *
   * Product Code remains unique even when editing.
   */

  const updateProduct = (
    productId: string,
    updatedProduct: Partial<Product>
  ): ProductOperationResult => {
    /*
     * Find the product being edited.
     */

    const existingProduct =
      products.find(
        (product) =>
          product.id === productId
      );

    if (!existingProduct) {
      return {
        success: false,
        message:
          "Product could not be found.",
      };
    }

    /*
     * Normalize the Product Code.
     */

    const updatedProductCode =
      updatedProduct.productCode !==
      undefined
        ? normalizeProductCode(
            updatedProduct.productCode
          )
        : normalizeProductCode(
            existingProduct.productCode
          );

    if (!updatedProductCode) {
      return {
        success: false,
        message:
          "Product Code is required.",
      };
    }

    /*
     * Product Name validation.
     */

    const updatedProductName =
      updatedProduct.productName !==
      undefined
        ? updatedProduct.productName.trim()
        : existingProduct.productName;

    if (!updatedProductName) {
      return {
        success: false,
        message:
          "Product Name is required.",
      };
    }

    /*
     * Check duplicate Product Code.
     */

    const duplicateProduct =
      products.find(
        (product) =>
          product.id !== productId &&
          normalizeProductCode(
            product.productCode
          ) === updatedProductCode
      );

    if (duplicateProduct) {
      return {
        success: false,
        message: `Product Code ${updatedProductCode} already belongs to another product.`,
      };
    }

    /*
     * Update the shared Product Master.
     */

    setProducts(
      (currentProducts) =>
        currentProducts.map(
          (product) =>
            product.id === productId
              ? {
                  ...product,
                  ...updatedProduct,
                  productCode:
                    updatedProductCode,
                  productName:
                    updatedProductName,
                }
              : product
        )
    );

    return {
      success: true,
      message:
        "Product updated successfully.",
    };
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

/*
 * ============================================================
 * HOOK
 * ============================================================
 */

export const useProductData = () => {
  const context =
    useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProductData must be used within ProductProvider"
    );
  }

  return context;
};