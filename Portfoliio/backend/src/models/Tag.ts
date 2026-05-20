import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
  color: string;
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
  color: { type: String, default: '#3B82F6' },
});

export default mongoose.model<ITag>('Tag', TagSchema);