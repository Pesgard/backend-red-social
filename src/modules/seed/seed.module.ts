import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import { Favorite, FavoriteSchema } from '../favorites/schemas/favorite.schema';
import { HashUtils } from 'src/common/utils/hashUtils';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
  ],
  providers: [SeedService, HashUtils],
  exports: [SeedService],
})
export class SeedModule {}




