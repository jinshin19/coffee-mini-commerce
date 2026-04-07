export const OrderModelsC = {
  getOrders: { url: "/orders", method: "GET" },
  getOrderById: { url: "/orders/:id", method: "GET" },
  createOrder: { url: "/orders", method: "POST" },
  uploadOrderPOP: { url: "/uploads/proof", method: "POST" },
  confirmOrderById: { url: "/orders/:id/confirm", method: "PATCH" },
  rejectOrderById: { url: "/orders/:id/reject", method: "PATCH" },
  updateOrderById: { url: "/orders/:id/status", method: "PATCH" },
  deleteOrderById: { url: "/orders/:id", method: "DELETE" },
};
