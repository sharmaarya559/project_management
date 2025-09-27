import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['active', 'completed'], default: 'active' })
  status: string;

  @Prop({ required: true, ref: User.name })
  created_by: mongoose.Types.ObjectId;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export type ProjectDocument = Project & Document;
