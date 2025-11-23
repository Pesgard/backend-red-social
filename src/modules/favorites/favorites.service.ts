import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { Favorite, FavoriteDocument } from './schemas/favorite.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async toggleFavorite(
    postId: string,
    userId: string,
    toggleFavoriteDto: ToggleFavoriteDto,
  ) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('ID de publicación inválido');
    }

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const existingFavorite = await this.favoriteModel.findOne({
      user: userId,
      post: postId,
    });

    if (toggleFavoriteDto.favorite) {
      // Add to favorites
      if (existingFavorite) {
        return {
          message: 'Publicación ya está en favoritos.',
        };
      }

      const newFavorite = new this.favoriteModel({
        user: userId,
        post: postId,
      });

      await newFavorite.save();

      return {
        message: 'Publicación agregada a favoritos.',
      };
    } else {
      // Remove from favorites
      if (!existingFavorite) {
        return {
          message: 'Publicación no está en favoritos.',
        };
      }

      await this.favoriteModel.findByIdAndDelete(existingFavorite._id);

      return {
        message: 'Publicación removida de favoritos.',
      };
    }
  }

  async getFavorites(userId: string) {
    const favorites = await this.favoriteModel
      .find({ user: userId })
      .populate({
        path: 'post',
        populate: {
          path: 'author',
          select: 'alias avatar_url',
        },
      })
      .sort({ created_at: -1 })
      .exec();

    return favorites
      .filter((fav) => fav.post !== null) // Filter out deleted posts
      .map((fav: any) => ({
        id: fav.post._id.toString(),
        title: fav.post.title,
        description: fav.post.description,
        author: {
          id: fav.post.author._id.toString(),
          alias: fav.post.author.alias,
          avatar_url: fav.post.author.avatar_url,
        },
        images: fav.post.images,
        likes: fav.post.likes,
        dislikes: fav.post.dislikes,
        created_at: fav.post.created_at,
        updated_at: fav.post.updated_at,
      }));
  }
}
