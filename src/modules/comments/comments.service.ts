import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async createComment(
    postId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('ID de publicación inválido');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const newComment = new this.commentModel({
      text: createCommentDto.text,
      post: postId,
      user: userId,
      parent: null,
    });

    const savedComment = await newComment.save();

    // Increment comments count on post
    post.comments_count++;
    await post.save();

    return {
      id: (savedComment as any)._id.toString(),
      message: 'Comentario agregado con éxito.',
    };
  }

  async replyToComment(
    commentId: string,
    userId: string,
    replyCommentDto: ReplyCommentDto,
  ) {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('ID de comentario inválido');
    }

    const parentComment = await this.commentModel.findById(commentId);

    if (!parentComment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    const reply = new this.commentModel({
      text: replyCommentDto.text,
      post: parentComment.post,
      user: userId,
      parent: commentId,
    });

    const savedReply = await reply.save();

    // Increment comments count on post
    const post = await this.postModel.findById(parentComment.post);
    if (post) {
      post.comments_count++;
      await post.save();
    }

    return {
      id: (savedReply as any)._id.toString(),
      message: 'Respuesta publicada.',
    };
  }

  async likeComment(commentId: string, userId: string) {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('ID de comentario inválido');
    }

    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    const userObjectId = new Types.ObjectId(userId);

    // Check if user already liked
    const alreadyLiked = comment.likes.some(
      (like) => like.toString() === userId,
    );

    if (alreadyLiked) {
      throw new ConflictException('Ya has dado like a este comentario');
    }

    comment.likes.push(userObjectId);
    comment.likes_count++;
    await comment.save();

    return {
      message: 'Like agregado al comentario.',
    };
  }
}
