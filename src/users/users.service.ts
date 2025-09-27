import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomException } from 'src/exception/custom.exception';
import { SignUpDto } from './dto/signup.dto';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Task, TaskDocument } from 'src/schema/task.schema';
import { Project, ProjectDocument } from 'src/schema/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import {
  MapUserTask,
  MapUserTaskDocument,
} from 'src/schema/map-user-task.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(MapUserTask.name)
    private readonly mapUserTaskModel: Model<MapUserTaskDocument>,
    private readonly jwtService: JwtService,
  ) {}
  /*****************************SIGNUP*************************************/
  async signUp(body: SignUpDto, res: Response) {
    try {
      if (body?.password !== body?.confirm_password) {
        throw new BadRequestException(
          'Password and confirm password must be same.',
          {
            cause: new Error('Password and confirm password must be same.'),
          },
        );
      }
      const findUser = await this.userModel.findOne({
        email: body?.email,
        deleted_at: null,
      });
      if (findUser) {
        throw new BadRequestException('User exists with this email.', {
          cause: new Error('User exists with this email.'),
        });
      }
      const hashedPassword = await bcrypt.hash(body?.password, 10);
      await new this.userModel({
        first_name: body?.first_name,
        last_name: body?.last_name,
        email: body?.email,
        password: hashedPassword,
      }).save();
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Signup successfull.',
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /******************************LOGIN*************************************/
  async login(body: LoginDto, res: Response) {
    try {
      const user = await this.userModel.findOne({
        email: body?.email,
        deleted_at: null,
      });
      if (!user) {
        throw new BadRequestException('User not registered with this email.', {
          cause: new Error('User not registered with this email.'),
        });
      }
      const isMatch = await bcrypt.compare(body?.password, user?.password);
      if (!isMatch) {
        throw new BadRequestException('Wrong password entered.', {
          cause: new Error('Wrong password entered.'),
        });
      }
      const token = await this.jwtService.sign(
        { id: user?._id, role: 'user' },
        { secret: process.env.JWT_SECRET_KEY },
      );
      await this.userModel.findByIdAndUpdate(user?._id, {
        last_login: new Date(),
      });
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Login successfully.',
        token,
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /**************************CREATE PROJECT********************************/
  async createProject(req: Request, body: CreateProjectDto, res: Response) {
    try {
      const project = await new this.projectModel({
        title: body?.title,
        description: body?.description,
        created_by: new mongoose.Types.ObjectId(req['user']['_id']),
      }).save();
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Project created successfully.',
        project,
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /**************************UPDATE PROJECT********************************/
  async updateProject(
    req: Request,
    project_id: string,
    body: UpdateProjectDto,
    res: Response,
  ) {
    try {
      const project = await this.projectModel.findOne({
        _id: new mongoose.Types.ObjectId(project_id),
        created_by: new mongoose.Types.ObjectId(req['user']['_id']),
      });
      if (!project) {
        throw new BadRequestException('Project not found.', {
          cause: new Error('Project not found.'),
        });
      }
      await this.projectModel.findByIdAndUpdate(project_id, { $set: body });
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Project updated successfully.',
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /**************************DELETE PROJECT********************************/
  async deleteProject(req: Request, project_id: string, res: Response) {
    try {
      const project = await this.projectModel.findOne({
        _id: new mongoose.Types.ObjectId(project_id),
        created_by: new mongoose.Types.ObjectId(req['user']['_id']),
      });
      if (!project) {
        throw new BadRequestException('Project not found.', {
          cause: new Error('Project not found.'),
        });
      }
      await this.projectModel.findByIdAndUpdate(project_id, {
        $set: { is_deleted: true },
      });
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Project deleted successfully.',
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /*****************************CREATE TASK********************************/
  async createTask(req: Request, body: CreateTaskDto, res: Response) {
    try {
      const task = await new this.taskModel({
        title: body?.title,
        description: body?.description,
        project_id: new mongoose.Types.ObjectId(body?.project_id),
        created_by: new mongoose.Types.ObjectId(req['user']['_id']),
      }).save();
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Task created successfully.',
        task,
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /*****************************UPDATE TASK********************************/
  async updateTask(
    req: Request,
    task_id: string,
    body: UpdateProjectDto,
    res: Response,
  ) {
    try {
      const task = await this.taskModel.findOne({
        _id: new mongoose.Types.ObjectId(task_id),
        created_by: new mongoose.Types.ObjectId(req['user']['_id']),
      });
      if (!task) {
        throw new BadRequestException('Task not found.', {
          cause: new Error('Task not found.'),
        });
      }
      await this.projectModel.findByIdAndUpdate(task_id, { $set: body });
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Task updated successfully.',
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /*****************************DELETE TASK********************************/
  async deleteTask(req: Request, task_id: string, res: Response) {
    try {
      const task = await this.taskModel.findOne({
        _id: new mongoose.Types.ObjectId(task_id),
        created_by: new mongoose.Types.ObjectId(req['user']['_id']),
      });
      if (!task) {
        throw new BadRequestException('Task not found.', {
          cause: new Error('Task not found.'),
        });
      }
      await this.taskModel.findByIdAndUpdate(task_id, {
        $set: { is_deleted: true },
      });
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Task deleted successfully.',
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /*****************************ASSIGN TASK********************************/
  async assignTask(
    req: Request,
    task_id: string,
    body: AssignTaskDto,
    res: Response,
  ) {
    try {
      const task = await this.taskModel.findOne({
        _id: new mongoose.Types.ObjectId(task_id),
        created_by: new mongoose.Types.ObjectId(req['user']['_id']),
      });
      if (!task) {
        throw new BadRequestException('Task not found.', {
          cause: new Error('Task not found.'),
        });
      }
      await new this.mapUserTaskModel({
        user_id: new mongoose.Types.ObjectId(body?.user_id),
        task_id: new mongoose.Types.ObjectId(task_id),
      }).save();
      return res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: 201,
        message: 'Task assigned successfully.',
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /*******************************MY TASKS*********************************/
  async getMyTasks(
    req: Request,
    search = '',
    status = '',
    page = 1,
    limit = 10,
    res: Response,
  ) {
    try {
      const data = await this.mapUserTaskModel.aggregate([
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(req['user']['_id']),
          },
        },
        {
          $lookup: {
            from: 'tasks',
            as: 'task',
            let: { task_id: '$task_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$task_id'] },
                  is_deleted: false,
                },
              },
              {
                $lookup: {
                  from: 'projects',
                  as: 'project',
                  let: { project_id: '$project_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$project_id'] },
                        is_deleted: false,
                      },
                    },
                  ],
                },
              },
              { $unwind: { path: '$project' } },
            ],
          },
        },
        { $unwind: { path: '$task' } },
        {
          $replaceRoot: { newRoot: '$task' },
        },
        {
          $match: {
            $or: [
              { title: { $regex: `.*${search}.*`, $options: 'i' } },
              { description: { $regex: `.*${search}.*`, $options: 'i' } },
            ],
            status: { $regex: `.*${status}.*`, $options: 'i' },
          },
        },
        {
          $facet: {
            paginatedResults: [
              { $sort: { createdAt: -1 } },
              { $skip: (Number(page) - 1) * Number(limit) },
              { $limit: Number(limit) },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
        {
          $addFields: {
            total: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
          },
        },
        { $project: { paginatedResults: 1, total: 1 } },
      ]);
      return res.status(HttpStatus.OK).json({
        success: true,
        statusCode: 200,
        current_page: Number(page),
        total_pages: Math.ceil(Number(data[0].total) / Number(limit)) || 0,
        limit: Number(limit),
        total: Number(data[0].total),
        data: data[0].paginatedResults,
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/

  /******************************MY PROJECTS*******************************/
  async getMyProjects(
    req: Request,
    search = '',
    status = '',
    page = 1,
    limit = 10,
    res: Response,
  ) {
    try {
      const tasks = (await this.mapUserTaskModel
        .find({
          user_id: new mongoose.Types.ObjectId(req['user']['_id']),
        })
        .populate('task_id')) as any;
      const project_ids = tasks.reduce((acc, cur) => {
        if (!acc.includes(cur?.task_id?.project_id)) {
          acc.push(cur?.task_id?.project_id);
        }
        return acc;
      }, []);
      const data = await this.projectModel
        .find({
          _id: { $in: project_ids },
          is_deleted: false,
          $or: [
            { title: { $regex: `.*${search}.*`, $options: 'i' } },
            { description: { $regex: `.*${search}.*`, $options: 'i' } },
          ],
          status: { $regex: `.*${status}.*`, $options: 'i' },
        })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      const total = await this.projectModel
        .countDocuments({
          _id: { $in: project_ids },
          is_deleted: false,
          $or: [
            { title: { $regex: `.*${search}.*`, $options: 'i' } },
            { description: { $regex: `.*${search}.*`, $options: 'i' } },
          ],
          status: { $regex: `.*${status}.*`, $options: 'i' },
        })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      return res.status(HttpStatus.OK).json({
        success: true,
        statusCode: 200,
        current_page: Number(page),
        total_pages: Math.ceil(Number(total) / Number(limit)) || 0,
        limit: Number(limit),
        total,
        data,
      });
    } catch (error) {
      throw new CustomException(error, error.status, error);
    }
  }
  /*----------------------------------------------------------------------*/
}
