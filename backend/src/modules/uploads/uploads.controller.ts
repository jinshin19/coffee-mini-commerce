// NestJs Imports
import {
  Post,
  HttpCode,
  Controller,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { extname, join } from "path";
import { diskStorage } from "multer";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseHandlerService } from "@src/common/services";

function sanitizeBaseName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
@ApiTags("Uploads")
@Controller("uploads")
export class UploadsController {
  @Post("proof")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Uploads file in backend app" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: join(process.cwd(), "uploads", "proofs"),
        filename: (_request, file, callback) => {
          const extension =
            extname(file.originalname || "").toLowerCase() || ".png";
          const baseName = sanitizeBaseName(
            file.originalname.replace(extname(file.originalname), "") ||
              "proof",
          );
          callback(null, `${Date.now()}-${baseName}${extension}`);
        },
      }),
      fileFilter: (_request, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          callback(
            new BadRequestException(
              "Only image uploads are allowed.",
            ) as unknown as null,
            false,
          );
          return;
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadProof(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Please attach an image file.");
    }

    // return {
    //   message: "Proof of payment uploaded successfully.",
    //   fileName: file.filename,
    //   fileUrl: `/uploads/proofs/${file.filename}`,
    // };

    return ResponseHandlerService({
      success: true,
      httpCode: HttpStatus.CREATED,
      message: "Proof of payment uploaded successfully.",
      data: {
        fileName: file.fieldname,
        fileUrl: `${process.env.JINSHIN_COFFEE_UPLOAD_PATH}${file.filename}`,
      },
    });
  }
}
