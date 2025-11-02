import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { HashUtils } from 'src/common/utils/hashUtils';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private hashUtils: HashUtils,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingEmail = await this.userModel.findOne({
      email: registerDto.email.toLowerCase(),
    });

    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashUtils.hash(registerDto.password);

    const newUser = new this.userModel({
      ...registerDto,
      email: registerDto.email.toLowerCase(), // corregido typo emaoil -> email
      password: hashedPassword,
    });

    await newUser.save();

    const token = this.generateToken(newUser);

    return {
      id: newUser._id.toString(),
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      alias: newUser.alias,
      avatar_url: newUser.avatar_url,
      created_at: newUser.createdAt,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      email: loginDto.email.toLowerCase(),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await this.hashUtils.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        alias: user.alias,
        avatar_url: user.avatar_url,
      },
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      alias: user.alias,
    };
    return this.jwtService.sign(payload);
  }
}
