// Utils
import { SYSTEM_ID } from "@src/common/utils";
// NestJs Imports
import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type OrderDocument = HydratedDocument<Order>;
export type OrderStatus = "pending" | "confirmed" | "rejected";
export type PaymentMethod = "gcash" | "cod";

@Schema({ _id: false, versionKey: false })
export class OrderItem {
  @Prop({ type: String, default: () => SYSTEM_ID() })
  public _id: string;

  @Prop({ type: String, required: true, trim: true })
  public productId: string;

  @Prop({ type: String, required: true, trim: true })
  public name: string;

  @Prop({ type: String, required: true, trim: true })
  public image: string;

  @Prop({ type: Number, required: true, min: 0 })
  public price: number;

  @Prop({ type: Number, required: true, min: 1 })
  public quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
export class Order {
  @Prop({ type: String, default: () => SYSTEM_ID() })
  public _id: string;

  @Prop({ type: String, required: true, trim: true })
  public name: string;

  @Prop({ type: String, required: true, trim: true })
  public contactNumber: string;

  @Prop({ type: String, required: true, trim: true })
  public address: string;

  @Prop({ type: String, required: true, enum: ["gcash", "cod"] })
  public paymentMethod: PaymentMethod;

  @Prop({ type: String, default: null })
  public proofOfPayment: string | null;

  @Prop({
    type: String,
    required: true,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  })
  status: OrderStatus;

  @Prop({ type: [OrderItemSchema], default: [] })
  public items: OrderItem[];

  @Prop({ type: Number, required: true, min: 0 })
  public subtotal: number;

  @Prop({ type: Number, required: true, min: 0 })
  public total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
