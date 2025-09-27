import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, lowercase: true })
  first_name: string;

  @Prop({ default: '', lowercase: true })
  last_name: string;

  @Prop({ required: true, collation: { locale: 'en', strength: 2 } })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop({ default: null })
  last_login: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
