import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Task, TaskSchema } from 'src/schema/task.schema';
import { Project, ProjectSchema } from 'src/schema/project.schema';
import {
  MapUserTask,
  MapUserTaskSchema,
} from 'src/schema/map-user-task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: MapUserTask.name, schema: MapUserTaskSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
