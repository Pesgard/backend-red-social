import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    MinLength, 
    Matches, 
    IsOptional,
    MaxLength 
  } from 'class-validator';
  
  export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @MaxLength(50, { message: 'El nombre no debe exceder 50 caracteres' })
    first_name: string;
  
    @IsString()
    @IsNotEmpty({ message: 'El apellido es requerido' })
    @MaxLength(50, { message: 'El apellido no debe exceder 50 caracteres' })
    last_name: string;
  
    @IsEmail({}, { message: 'Correo electrónico inválido' })
    @IsNotEmpty({ message: 'El correo es requerido' })
    email: string;
  
    @IsString()
    @MinLength(10, { message: 'La contraseña debe tener al menos 10 caracteres' })
    @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      { message: 'La contraseña debe incluir al menos una mayúscula, una minúscula y un número' }
    )
    password: string;
  
    @IsOptional()
    @IsString()
    @Matches(/^\d{10}$/, { message: 'El teléfono debe tener 10 dígitos' })
    phone?: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(200, { message: 'La dirección no debe exceder 200 caracteres' })
    address?: string;
  
    @IsString()
    @IsNotEmpty({ message: 'El alias es requerido' })
    @MinLength(3, { message: 'El alias debe tener al menos 3 caracteres' })
    @MaxLength(20, { message: 'El alias no debe exceder 20 caracteres' })
    @Matches(/^[a-zA-Z0-9_]+$/, { 
      message: 'El alias solo puede contener letras, números y guiones bajos' 
    })
    alias: string;
  
    @IsOptional()
    @IsString()
    avatar_url?: string;
  }