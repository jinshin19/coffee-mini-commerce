export const ProductModelsC = {
  getProducts: { url: "/products", method: "GET" },
  getProductById: { url: "/products", method: "GET" },
  createProduct: { url: "/products", method: "POST" },
  updateProductById: { url: "/products/:id", method: "PATCH" },
  restockProductById: { url: "/products/:id/stock", method: "PATCH" },
  deleteProductById: { url: "/products/:id", method: "DELETE" },
};
