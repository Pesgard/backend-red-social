import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
