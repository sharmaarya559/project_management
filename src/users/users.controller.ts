import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UserGuard } from 'src/guards/user.auth.guard';

@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*****************************SIGNUP*************************************/
  @Post('signup')
  @ApiOperation({ summary: 'Signup' })
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    return await this.usersService.signUp(body, res);
  }
  /*----------------------------------------------------------------------*/

  /******************************LOGIN*************************************/
  @Post('login')
  @ApiOperation({ summary: `User's Login` })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    return await this.usersService.login(body, res);
  }
  /*----------------------------------------------------------------------*/

  /**************************CREATE PROJECT********************************/
  @Post('create-project')
  @ApiOperation({ summary: `Create Project` })
  @UseGuards(UserGuard)
  async createProject(
    @Req() req: Request,
    @Body() body: CreateProjectDto,
    @Res() res: Response,
  ) {
    return await this.usersService.createProject(req, body, res);
  }
  /*----------------------------------------------------------------------*/

  /**************************UPDATE PROJECT********************************/
  @Post('update-project/:project_id')
  @ApiOperation({ summary: `Update Project` })
  @ApiParam({ name: 'project_id', required: true })
  @UseGuards(UserGuard)
  async updateProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
    @Body() body: UpdateProjectDto,
    @Res() res: Response,
  ) {
    return await this.usersService.updateProject(req, project_id, body, res);
  }
  /*----------------------------------------------------------------------*/

  /**************************DELETE PROJECT********************************/
  @Delete('delete-project/:project_id')
  @ApiOperation({ summary: `Delete Project` })
  @ApiParam({ name: 'project_id', required: true })
  @UseGuards(UserGuard)
  async deleteProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
    @Res() res: Response,
  ) {
    return await this.usersService.deleteProject(req, project_id, res);
  }
  /*----------------------------------------------------------------------*/

  /*****************************CREATE TASK********************************/
  @Post('create-task')
  @ApiOperation({ summary: `Create Task` })
  @UseGuards(UserGuard)
  async createTask(
    @Req() req: Request,
    @Body() body: CreateTaskDto,
    @Res() res: Response,
  ) {
    return await this.usersService.createTask(req, body, res);
  }
  /*----------------------------------------------------------------------*/

  /*****************************UPDATE TASK********************************/
  @Post('update-task/:task_id')
  @ApiOperation({ summary: `Update Task` })
  @ApiParam({ name: 'task_id', required: true })
  @UseGuards(UserGuard)
  async updateTask(
    @Req() req: Request,
    @Param('task_id') task_id: string,
    @Body() body: UpdateProjectDto,
    @Res() res: Response,
  ) {
    return await this.usersService.updateTask(req, task_id, body, res);
  }
  /*----------------------------------------------------------------------*/

  /*****************************DELETE TASK********************************/
  @Delete('delete-task/:task_id')
  @ApiOperation({ summary: `Delete Task` })
  @ApiParam({ name: 'task_id', required: true })
  @UseGuards(UserGuard)
  async deleteTask(
    @Req() req: Request,
    @Param('task_id') task_id: string,
    @Res() res: Response,
  ) {
    return await this.usersService.deleteTask(req, task_id, res);
  }
  /*----------------------------------------------------------------------*/

  /*****************************ASSIGN TASK********************************/
  @Post('assign-task/:task_id')
  @ApiOperation({ summary: `Assign Task` })
  @ApiParam({ name: 'task_id', required: true })
  @UseGuards(UserGuard)
  async assignTask(
    @Req() req: Request,
    @Param('task_id') task_id: string,
    @Body() body: AssignTaskDto,
    @Res() res: Response,
  ) {
    return await this.usersService.assignTask(req, task_id, body, res);
  }
  /*----------------------------------------------------------------------*/

  /*******************************MY TASKS*********************************/
  @Get('get-my-tasks')
  @ApiOperation({ summary: `Get my all tasks` })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UseGuards(UserGuard)
  async getMyTasks(
    @Req() req: Request,
    @Query('search') search = '',
    @Query('status') status = '',
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    return await this.usersService.getMyTasks(
      req,
      search,
      status,
      page,
      limit,
      res,
    );
  }
  /*----------------------------------------------------------------------*/

  /******************************MY PROJECTS*******************************/
  @Get('get-my-projects')
  @ApiOperation({ summary: `Get my all projects` })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UseGuards(UserGuard)
  async getMyProjects(
    @Req() req: Request,
    @Query('search') search = '',
    @Query('status') status = '',
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    return await this.usersService.getMyProjects(
      req,
      search,
      status,
      page,
      limit,
      res,
    );
  }
  /*----------------------------------------------------------------------*/
}
