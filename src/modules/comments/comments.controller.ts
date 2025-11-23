import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:id/comments')
  @HttpCode(HttpStatus.CREATED)
  createComment(
    @Param('id') postId: string,
    @CurrentUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(postId, userId, createCommentDto);
  }

  @Post('comments/:id/replies')
  @HttpCode(HttpStatus.CREATED)
  replyToComment(
    @Param('id') commentId: string,
    @CurrentUser('id') userId: string,
    @Body() replyCommentDto: ReplyCommentDto,
  ) {
    return this.commentsService.replyToComment(
      commentId,
      userId,
      replyCommentDto,
    );
  }

  @Post('comments/:id/like')
  @HttpCode(HttpStatus.OK)
  likeComment(
    @Param('id') commentId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentsService.likeComment(commentId, userId);
  }
}
