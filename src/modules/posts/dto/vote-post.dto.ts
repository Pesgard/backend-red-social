import { IsEnum, IsNotEmpty } from 'class-validator';

export class VotePostDto {
  @IsNotEmpty()
  @IsEnum(['like', 'dislike'], {
    message: 'vote must be either "like" or "dislike"',
  })
  vote: 'like' | 'dislike';
}
