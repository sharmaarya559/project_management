import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Project } from './project.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['todo', 'in-progress', 'completed'], default: 'todo' })
  status: string;

  @Prop({ ref: Project.name, required: true })
  project_id: mongoose.Types.ObjectId;

  @Prop({ required: true, ref: User.name })
  created_by: mongoose.Types.ObjectId;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
export type TaskDocument = Task & Document;
