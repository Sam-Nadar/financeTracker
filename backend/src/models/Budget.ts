import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  category: 'Food' | 'Shopping' | 'Transportation' | 'Events' | 'Recurring' | 'Services' | 'Travel';
  month: number;
  year: number;
  budget: number;
}

const BudgetSchema: Schema = new Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Food', 'Transportation', 'Shopping', 'Events', 'Recurring','Services','Travel'], 
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  budget: { type: Number, required: true },
});

export default mongoose.model<IBudget>('Budget', BudgetSchema);
