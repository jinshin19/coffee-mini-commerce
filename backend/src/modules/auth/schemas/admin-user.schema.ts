import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SYSTEM_ID } from 'src/common/utils/id.utils';

export type AdminUserDocument = HydratedDocument<AdminUser>;

@Schema({ timestamps: true, versionKey: false })
export class AdminUser {
  @Prop({ type: String, default: () => SYSTEM_ID() })
  public _id: string;

  @Prop({ required: true, unique: true, trim: true })
  public username: string;

  @Prop({ required: true })
  public passwordHash: string;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
