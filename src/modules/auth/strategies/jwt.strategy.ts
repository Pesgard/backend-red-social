import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  alias: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel.findById(payload.sub);

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    // Este objeto se añadirá a request.user
    return {
      id: user._id.toString(),
      email: user.email,
      alias: user.alias,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
    };
  }
}