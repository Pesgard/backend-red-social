import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PendingPostDto {
  @IsNotEmpty()
  @IsString()
  local_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsNotEmpty()
  @IsDateString()
  created_at: string;
}

export class SyncPostsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PendingPostDto)
  pending_posts: PendingPostDto[];
}
