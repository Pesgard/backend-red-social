import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'El alias debe tener al menos 3 caracteres' })
    @MaxLength(20, { message: 'El alias no debe exceder 20 caracteres' })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'El alias solo puede contener letras, números y guiones bajos'
    })
    alias?: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{10}$/, { message: 'El teléfono debe tener 10 dígitos' })
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200, { message: 'La dirección no debe exceder 200 caracteres' })
    address?: string;
}
