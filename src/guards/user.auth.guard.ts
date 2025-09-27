import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CustomException } from 'src/exception/custom.exception';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      if (!request?.headers || !request?.headers?.authorization) {
        throw new UnauthorizedException('Authetication failed.', {
          cause: new Error('Authetication failed.'),
        });
      }
      const token = request.headers.authorization.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Authetication failed.', {
          cause: new Error('Authetication failed.'),
        });
      }
      const decode = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      if (!decode) {
        throw new UnauthorizedException('Authetication failed.', {
          cause: new Error('Authetication failed.'),
        });
      }
      if (decode?.role && decode?.role === 'user') {
        const user = await this.userModel.findOne({
          _id: new mongoose.Types.ObjectId(decode?.id),
          deleted_at: null,
        });
        if (user) {
          request['user'] = user;
          return true;
        } else {
          throw new UnauthorizedException('Authetication failed.', {
            cause: new Error('Authetication failed.'),
          });
        }
      } else {
        throw new UnauthorizedException('Authetication failed.', {
          cause: new Error('Authetication failed.'),
        });
      }
    } catch (error) {
      throw new CustomException('Unauthorized', 401, error);
    }
  }
}
