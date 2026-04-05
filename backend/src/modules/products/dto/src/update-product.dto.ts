// Packages
import { PartialType } from "@nestjs/mapped-types";
// DTOs
import { CreateProductDTO } from "./create-product.dto";

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
