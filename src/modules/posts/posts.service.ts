import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { VotePostDto } from './dto/vote-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import { Favorite, FavoriteDocument } from '../favorites/schemas/favorite.schema';

interface QueryParams {
  search?: string;
  author?: string;
  order_by?: string;
  direction?: string;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const newPost = new this.postModel({
      ...createPostDto,
      author: userId,
    });

    const savedPost = await newPost.save();

    return {
      id: (savedPost as any)._id.toString(),
      message: 'Publicación creada exitosamente.',
    };
  }

  async findAll(queryParams: QueryParams) {
    const {
      search,
      author,
      order_by = 'date',
      direction = 'desc',
    } = queryParams;

    const filter: any = {};

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by author alias
    if (author) {
      // We need to populate and filter, but it's better to do it with aggregation
      // For now, we'll keep it simple - assuming we pass userId instead
      filter.author = author;
    }

    // Sorting
    let sortField = 'created_at';
    if (order_by === 'title') sortField = 'title';
    else if (order_by === 'user') sortField = 'author';

    const sortDirection = direction === 'asc' ? 1 : -1;

    const posts = await this.postModel
      .find(filter)
      .populate('author', 'alias avatar_url')
      .sort({ [sortField]: sortDirection })
      .exec();

    return posts.map((post: any) => ({
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      author: {
        id: post.author._id.toString(),
        alias: post.author.alias,
        avatar_url: post.author.avatar_url,
      },
      images: post.images,
      likes: post.likes,
      dislikes: post.dislikes,
      created_at: post.created_at,
      updated_at: post.updated_at,
    }));
  }

  async findOne(postId: string, userId: string) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('ID de publicación inválido');
    }

    const post = await this.postModel
      .findById(postId)
      .populate('author', 'alias avatar_url')
      .exec();

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Check user interactions with the post
    const userObjectId = new Types.ObjectId(userId);
    const hasLiked = post.votes.some(
      (v) => v.user.toString() === userId && v.vote === 'like',
    );
    const hasDisliked = post.votes.some(
      (v) => v.user.toString() === userId && v.vote === 'dislike',
    );
    const isFavorite = !!(await this.favoriteModel.findOne({
      user: userObjectId,
      post: postId,
    }));
    const canEdit = post.author.toString() === userId;
    const canDelete = post.author.toString() === userId;

    // Get all comments for this post
    const comments = await this.commentModel
      .find({ post: postId, parent: null })
      .populate('user', 'alias avatar_url')
      .sort({ created_at: -1 })
      .exec();

    // Get replies for each comment with full information
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment: any) => {
        const replies = await this.commentModel
          .find({ parent: comment._id })
          .populate('user', 'alias avatar_url')
          .sort({ created_at: 1 })
          .exec();

        // Check if user liked this comment
        const userHasLikedComment = comment.likes.some(
          (like: any) => like.toString() === userId,
        );
        const canEditComment = comment.user._id.toString() === userId;
        const canDeleteComment = comment.user._id.toString() === userId;

        return {
          id: comment._id.toString(),
          user: {
            id: comment.user._id.toString(),
            alias: comment.user.alias,
            avatar_url: comment.user.avatar_url,
          },
          text: comment.text,
          likes: comment.likes_count,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          user_interaction: {
            has_liked: userHasLikedComment,
            can_edit: canEditComment,
            can_delete: canDeleteComment,
          },
          replies: replies.map((reply: any) => {
            const userHasLikedReply = reply.likes.some(
              (like: any) => like.toString() === userId,
            );
            const canEditReply = reply.user._id.toString() === userId;
            const canDeleteReply = reply.user._id.toString() === userId;

            return {
              id: reply._id.toString(),
              user: {
                id: reply.user._id.toString(),
                alias: reply.user.alias,
                avatar_url: reply.user.avatar_url,
              },
              text: reply.text,
              likes: reply.likes_count,
              created_at: reply.created_at,
              updated_at: reply.updated_at,
              user_interaction: {
                has_liked: userHasLikedReply,
                can_edit: canEditReply,
                can_delete: canDeleteReply,
              },
            };
          }),
        };
      }),
    );

    const postAuthor = post.author as any;

    // Calculate metadata
    const totalComments = commentsWithReplies.reduce(
      (acc, c) => acc + 1 + (c.replies?.length || 0),
      0,
    );

    return {
      id: (post as any)._id.toString(),
      title: post.title,
      description: post.description,
      author: {
        id: postAuthor._id.toString(),
        alias: postAuthor.alias,
        avatar_url: postAuthor.avatar_url,
      },
      images: post.images,
      likes: post.likes,
      dislikes: post.dislikes,
      created_at: post.created_at,
      updated_at: post.updated_at,
      user_interaction: {
        has_liked: hasLiked,
        has_disliked: hasDisliked,
        is_favorite: isFavorite,
        can_edit: canEdit,
        can_delete: canDelete,
      },
      metadata: {
        comments_count: commentsWithReplies.length,
        total_comments: totalComments,
        has_images: post.images.length > 0,
        image_count: post.images.length,
      },
      comments: commentsWithReplies,
    };
  }

  async update(postId: string, userId: string, updatePostDto: UpdatePostDto) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('ID de publicación inválido');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Verify ownership
    if (post.author.toString() !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta publicación',
      );
    }

    Object.assign(post, updatePostDto);
    await post.save();

    return {
      message: 'Publicación actualizada correctamente.',
    };
  }

  async remove(postId: string, userId: string) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('ID de publicación inválido');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Verify ownership
    if (post.author.toString() !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta publicación',
      );
    }

    await this.postModel.findByIdAndDelete(postId);

    // Also delete all comments associated with this post
    await this.commentModel.deleteMany({ post: postId });

    return {
      message: 'Publicación eliminada.',
    };
  }

  async vote(postId: string, userId: string, votePostDto: VotePostDto) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('ID de publicación inválido');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const userObjectId = new Types.ObjectId(userId);

    // Check if user already voted
    const existingVoteIndex = post.votes.findIndex(
      (v) => v.user.toString() === userId,
    );

    if (existingVoteIndex !== -1) {
      // User already voted, update the vote
      const oldVote = post.votes[existingVoteIndex].vote;

      // Update counters
      if (oldVote === 'like') {
        post.likes--;
      } else {
        post.dislikes--;
      }

      // Remove old vote
      post.votes.splice(existingVoteIndex, 1);
    }

    // Add new vote
    post.votes.push({
      user: userObjectId,
      vote: votePostDto.vote,
      created_at: new Date(),
    });

    // Update counters
    if (votePostDto.vote === 'like') {
      post.likes++;
    } else {
      post.dislikes++;
    }

    await post.save();

    return {
      likes: post.likes,
      dislikes: post.dislikes,
    };
  }

  /**
   * Obtiene todos los posts de un usuario específico
   * @param userId ID del usuario cuyos posts se quieren obtener
   * @param currentUserId ID del usuario actual (para determinar interacciones)
   */
  async findByUserId(userId: string, currentUserId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID de usuario inválido');
    }

    const posts = await this.postModel
      .find({ author: userId })
      .populate('author', 'alias avatar_url')
      .sort({ created_at: -1 })
      .exec();

    const userObjectId = new Types.ObjectId(currentUserId);

    // Obtener favoritos del usuario actual
    const favorites = await this.favoriteModel
      .find({ user: userObjectId })
      .exec();
    const favoritePostIds = new Set(
      favorites.map((f) => f.post.toString()),
    );

    return posts.map((post: any) => {
      const postId = post._id.toString();
      const hasLiked = post.votes.some(
        (v) => v.user.toString() === currentUserId && v.vote === 'like',
      );
      const hasDisliked = post.votes.some(
        (v) => v.user.toString() === currentUserId && v.vote === 'dislike',
      );
      const isFavorite = favoritePostIds.has(postId);
      const canEdit = post.author.toString() === currentUserId;
      const canDelete = post.author.toString() === currentUserId;

      const postAuthor = post.author as any;

      return {
        id: postId,
        title: post.title,
        description: post.description,
        author: {
          id: postAuthor._id.toString(),
          alias: postAuthor.alias,
          avatar_url: postAuthor.avatar_url,
        },
        images: post.images,
        likes: post.likes,
        dislikes: post.dislikes,
        created_at: post.created_at,
        updated_at: post.updated_at,
        user_interaction: {
          has_liked: hasLiked,
          has_disliked: hasDisliked,
          is_favorite: isFavorite,
          can_edit: canEdit,
          can_delete: canDelete,
        },
      };
    });
  }
}
