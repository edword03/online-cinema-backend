import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.UserService.getUserById(_id);
  }

  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.UserService.updateProfile(_id, dto);
  }

  @Get('profile/favorites')
  @Auth()
  async getFavoriteMovies(@User('_id') _id: Types.ObjectId) {
    return this.UserService.getFavoriteMovies(_id);
  }

  @Put('profile/favorites')
  @HttpCode(200)
  @Auth()
  async toggleFavorites(
    @Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User() user: UserModel,
  ) {
    return this.UserService.toggleFavorites(movieId, user);
  }

  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.UserService.updateProfile(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.UserService.deleteUser(id);
  }

  @Get('count')
  @HttpCode(200)
  @Auth('admin')
  async getCountUsers() {
    return this.UserService.getCount();
  }

  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm: string) {
    return this.UserService.getAllUsers(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.UserService.getUserById(id);
  }
}
