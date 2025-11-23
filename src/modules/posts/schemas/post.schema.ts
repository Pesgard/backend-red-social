import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vote } from '../types/vote.type';

export type PostDocument = Post & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Post {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  // Images stored as full urls
  @Prop({ type: [String], default: [] })
  images: string[];

  // Author ref to users collection
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  // Votes stored as subdocuments to prevent duplicate votes
  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        vote: { type: String, enum: ['like', 'dislike'], required: true },
        created_at: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  votes: Vote[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  dislikes: number;

  @Prop({ default: 0 })
  comments_count: number;

  created_at?: Date;
  updated_at?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Create text index for search on title and description
PostSchema.index({ title: 'text', description: 'text' });
PostSchema.index({ author: 1 });
PostSchema.index({ created_at: -1 });
