import { Types } from 'mongoose';

export type Vote = {
  user: Types.ObjectId; // User ID
  vote: 'like' | 'dislike';
  created_at: Date;
};
