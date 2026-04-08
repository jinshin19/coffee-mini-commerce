// Next Imports
import {
  Post,
  HttpCode,
  Controller,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  BadGatewayException,
  BadRequestException,
} from "@nestjs/common";
import { extname } from "path";
import { memoryStorage } from "multer";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
// Commons
import { ResponseHandlerService } from "@src/common/services";

function sanitizeBaseName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function buildSafeFileName(originalName: string) {
  const extension = extname(originalName || "").toLowerCase() || ".png";
  const rawBaseName = originalName?.replace(extname(originalName), "") || "proof";
  const baseName = sanitizeBaseName(rawBaseName) || "proof";

  return `${Date.now()}-${baseName}${extension}`;
}

@ApiTags("Uploads")
@Controller("uploads")
export class UploadsController {
  @Post("proof")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Upload proof image to ImageKit" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      fileFilter: (_request, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          callback(
            new BadRequestException("Only image uploads are allowed.") as unknown as null,
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
  async uploadProof(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Please attach an image file.");
    }

    const imageKitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const imageKitUploadUrl =
      process.env.IMAGEKIT_UPLOAD_URL;
    const imageKitFolder = process.env.IMAGEKIT_PROOFS_FOLDER;

    if (!imageKitPrivateKey) {
      throw new BadRequestException("IMAGEKIT_PRIVATE_KEY is not configured.");
    }

    const fileName = buildSafeFileName(file.originalname);

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
      fileName,
    );
    formData.append("fileName", fileName);
    formData.append("folder", imageKitFolder);
    formData.append("useUniqueFileName", "false");

    const basicAuth = Buffer.from(`${imageKitPrivateKey}:`).toString("base64");

    const response = await fetch(imageKitUploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      body: formData,
    });

    const result = (await response.json().catch(() => null)) as
      | {
          url?: string;
          name?: string;
          fileId?: string;
          message?: string;
        }
      | null;

    if (!response.ok || !result?.url) {
      throw new BadGatewayException(
        result?.message || "Failed to upload proof image to ImageKit.",
      );
    }

    return ResponseHandlerService({
      success: true,
      httpCode: HttpStatus.CREATED,
      message: "Proof of payment uploaded successfully.",
      data: {
        fileName: result.name ?? fileName,
        fileUrl: result.url,
        fileId: result.fileId ?? null,
      },
    });
  }
}