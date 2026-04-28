import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags: mongoose.Types.ObjectId[];
  dueDate?: Date;
  order: number;
  subtasks: { title: string; completed: boolean }[];
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    dueDate: { type: Date },
    order: { type: Number, default: 0 },
    subtasks: [{
      title: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }],
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
