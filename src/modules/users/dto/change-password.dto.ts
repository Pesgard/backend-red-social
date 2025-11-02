import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  current_password: string;

  @IsString()
  @MinLength(10, { message: 'La nueva contraseña debe tener al menos 10 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    { message: 'La nueva contraseña debe incluir al menos una mayúscula, una minúscula y un número' }
  )
  new_password: string;
}