import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const uploadsDir = join(process.cwd(), "uploads", "proofs");
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:
      process.env.CORS_ORIGIN?.split(",").map((value) => value.trim()) || true,
    credentials: true,
  });

  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, "0.0.0.0");
  console.log(
    `Coffee admin backend running on http://localhost:${port}/api/v1`,
  );
}

bootstrap();
