// NestJs Imports
import { join } from "path";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule, ConfigService } from "@nestjs/config";
// Modules
import { AuthModule } from "./modules/auth/auth.module";
import { SeedModule } from "./modules/seed/seed.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { HealthModule } from "./modules/health/health.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { ProductsModule } from "./modules/products/products.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI") || "",
      }),
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), "public"),
        serveRoot: "/",
      },
      {
        rootPath: join(process.cwd(), "uploads"),
        serveRoot: "/uploads",
      },
    ),
    // --- MODULES ---- //
    AuthModule,
    SeedModule,
    OrdersModule,
    HealthModule,
    UploadsModule,
    ProductsModule,
    DashboardModule,
  ],
})
export class AppModule {}
