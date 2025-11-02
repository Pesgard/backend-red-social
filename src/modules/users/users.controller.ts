import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@CurrentUser('id') userId: string, @Body() updateProfileDto: UpdateUserDto) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Put('me/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, changePasswordDto);
  }
}
