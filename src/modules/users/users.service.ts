import { 
  ConflictException, 
  HttpStatus, 
  Injectable, 
  NotFoundException,
  UnauthorizedException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashUtils } from '../../common/utils/hashUtils';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashUtils: HashUtils,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      alias: user.alias,
      phone: user.phone,
      address: user.address,
      avatar_url: user.avatar_url,
      created_at: user.createdAt,
    };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el alias ya existe
    if (updateUserDto.alias && updateUserDto.alias !== user.alias) {
      const existingAlias = await this.userModel.findOne({
        alias: updateUserDto.alias,
        _id: { $ne: userId },
      });

      if (existingAlias) {
        throw new ConflictException('El alias ya está en uso');
      }
    }

    Object.assign(user, updateUserDto);
    await user.save();

    return {
      message: 'Perfil actualizado correctamente.',
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // ✅ CRÍTICO: Verificar la contraseña actual primero
    const isCurrentPasswordValid = await this.hashUtils.compare(
      changePasswordDto.current_password,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // ✅ Verificar que la nueva contraseña sea diferente
    const isSamePassword = await this.hashUtils.compare(
      changePasswordDto.new_password,
      user.password,
    );

    if (isSamePassword) {
      throw new ConflictException('La nueva contraseña debe ser diferente a la actual');
    }

    // Hash de la nueva contraseña
    const hashedPassword = await this.hashUtils.hash(changePasswordDto.new_password);
    user.password = hashedPassword;
    await user.save();

    return {
      message: 'Contraseña actualizada con éxito.',
    };
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }
}