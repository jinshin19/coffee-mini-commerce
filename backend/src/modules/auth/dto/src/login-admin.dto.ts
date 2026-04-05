import { IsNotEmpty, IsString } from "class-validator";

export class LoginAdminDTO {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
