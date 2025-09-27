import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { Task } from './task.schema';

@Schema({ timestamps: true })
export class MapUserTask {
  @Prop({ required: true, ref: User.name })
  user_id: mongoose.Types.ObjectId;

  @Prop({ required: true, ref: Task.name })
  task_id: mongoose.Types.ObjectId;
}

export const MapUserTaskSchema = SchemaFactory.createForClass(MapUserTask);
export type MapUserTaskDocument = MapUserTask & Document;
