import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleFavoriteDto {
  @IsNotEmpty()
  @IsBoolean()
  favorite: boolean;
}
