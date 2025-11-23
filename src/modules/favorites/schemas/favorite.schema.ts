import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Favorite {
  // User who favorited
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  // Post that was favorited
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post: Types.ObjectId;

  created_at?: Date;
  updated_at?: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

// Compound index to ensure a user can only favorite a post once
FavoriteSchema.index({ user: 1, post: 1 }, { unique: true });
FavoriteSchema.index({ user: 1 });
FavoriteSchema.index({ created_at: -1 });
