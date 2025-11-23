import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SyncPostsDto } from './dto/sync-posts.dto';
import { Post, PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class SyncService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async syncPosts(userId: string, syncPostsDto: SyncPostsDto) {
    const synced: Array<{ local_id: string; server_id: string }> = [];

    for (const pendingPost of syncPostsDto.pending_posts) {
      try {
        // Create the post
        const newPost = new this.postModel({
          title: pendingPost.title,
          description: pendingPost.description,
          images: pendingPost.images || [],
          author: userId,
        });

        const savedPost = await newPost.save();

        synced.push({
          local_id: pendingPost.local_id,
          server_id: (savedPost as any)._id.toString(),
        });
      } catch (error) {
        // Log error but continue with other posts
        console.error(`Error syncing post ${pendingPost.local_id}:`, error);
      }
    }

    return {
      synced,
    };
  }
}
