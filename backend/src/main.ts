import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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

  const config = new DocumentBuilder()
    .setTitle("Coffee Admin API")
    .setDescription("API documentation for Jinshin19 Brew Reserve backend")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port =
    process.env.NODE_ENV === "developement"
      ? Number(process.env.PORT!)
      : Number(process.env.PORT!);
  await app.listen(port, "0.0.0.0");

  console.log(
    `Coffee admin backend running on http://localhost:${port}/api/v1`,
  );
  console.log(`Swagger docs running on http://localhost:${port}/docs`);
}

bootstrap();
