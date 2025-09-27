import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { Task, TaskSchema } from 'src/schema/task.schema';
import { Project, ProjectSchema } from 'src/schema/project.schema';
import {
  MapUserTask,
  MapUserTaskSchema,
} from 'src/schema/map-user-task.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.DB_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: MapUserTask.name, schema: MapUserTaskSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
