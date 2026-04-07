// Services
import { ApiService, OrdersService } from "@/services";
import { ErrorResponseHandlerService } from "@/services/handlers";

const apiService = new ApiService();
const ordersService = new OrdersService(apiService);

export const UploadProofOfPaymentH = async (file: File | null) => {
  if (!file) {
    throw new ErrorResponseHandlerService(
      400,
      "POST",
      "Please select a file",
      "upload/proofs",
    );
  }

  return await ordersService.uploadOrderPOP(file);
};
