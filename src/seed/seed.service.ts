import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  MapUserTask,
  MapUserTaskDocument,
} from 'src/schema/map-user-task.schema';
import { Project, ProjectDocument } from 'src/schema/project.schema';
import { Task, TaskDocument } from 'src/schema/task.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(MapUserTask.name)
    private readonly mapUserTaskModel: Model<MapUserTaskDocument>,
  ) {}

  async run() {
    try {
      console.log('Seeding user, tasks and projects...');

      let adminUser = {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: 'Admin@123',
      };

      let findAdminUser = await this.userModel.findOne({
        email: adminUser.email,
      });
      if (!findAdminUser) {
        const hashedPassword = await bcrypt.hash(adminUser.password, 10);
        findAdminUser = await new this.userModel({
          ...adminUser,
          password: hashedPassword,
        }).save();
      }

      let user = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'Test@123',
      };

      let findUser = await this.userModel.findOne({
        email: user.email,
      });
      if (!findUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        findUser = await new this.userModel({
          ...user,
          password: hashedPassword,
        }).save();
      }

      for (let i = 1; i <= 2; i++) {
        const project = await new this.projectModel({
          title: `Project Title ${i}`,
          description: `Project Description ${i}`,
          created_by: new mongoose.Types.ObjectId(findAdminUser?._id),
        }).save();
        for (let j = 1; j <= 3; j++) {
          const task = await new this.taskModel({
            title: `Project ${i} Task Title ${j}`,
            description: `Project ${i} Task Description ${j}`,
            project_id: new mongoose.Types.ObjectId(project._id),
            created_by: new mongoose.Types.ObjectId(findAdminUser?._id),
          }).save();
          await new this.mapUserTaskModel({
            user_id: new mongoose.Types.ObjectId(findUser?._id),
            task_id: new mongoose.Types.ObjectId(task?._id),
          }).save();
        }
      }

      console.log('Seeding finished.');
    } catch (error) {
      console.log(error);
    }
  }
}
