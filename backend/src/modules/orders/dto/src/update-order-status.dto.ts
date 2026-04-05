// Packages
import { IsIn } from "class-validator";

export class UpdateOrderStatusDTO {
  @IsIn(["confirmed", "rejected"])
  status!: "confirmed" | "rejected";
}
