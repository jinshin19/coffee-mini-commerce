export const RoastLevelsC = [
  "light",
  "medium-light",
  "medium",
  "medium-dark",
  "dark",
  "espresso",
] as const;

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { SYSTEM_ID } from "src/common/utils/id.utils";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ type: String, default: () => SYSTEM_ID() })
  public _id: string;

  @Prop({ type: String, required: true, trim: true })
  public slug: string;

  @Prop({ type: String, required: true, trim: true })
  public name: string;

  @Prop({ type: String, required: true, trim: true })
  public category: string;

  @Prop({ type: String, required: true, trim: true })
  public shortDescription: string;

  @Prop({ type: String, default: null, trim: true })
  public description: string;

  @Prop({ type: String, required: true, min: 0 })
  public price: number;

  @Prop({ type: String, required: true, trim: true })
  public image: string;

  @Prop({ type: String, required: true, enum: RoastLevelsC, trim: true })
  public roastLevel: RoastLevelsT;

  @Prop({ type: String, default: null, trim: true })
  public origin: string;

  @Prop({ default: false })
  public bestSeller: boolean;

  @Prop({ default: false })
  public featured: boolean;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  public stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type RoastLevelsT = (typeof RoastLevelsC)[number];
