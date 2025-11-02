import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}