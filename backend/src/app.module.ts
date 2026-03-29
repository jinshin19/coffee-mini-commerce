import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./modules/auth/auth.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { ProductsModule } from "./modules/products/products.module";
import { SeedModule } from "./modules/seed/seed.module";
import { UploadsModule } from "./modules/uploads/uploads.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "env/.env.local",
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>("MONGODB_URI") ||
          "mongodb://localhost:27017/coffee_admin",
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
    AuthModule,
    ProductsModule,
    OrdersModule,
    DashboardModule,
    UploadsModule,
    SeedModule,
  ],
})
export class AppModule {}

