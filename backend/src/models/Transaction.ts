import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  description: string;
  category: 'Food' | 'Shopping' | 'Transportation' | 'Events' | 'Recurring' | 'Services' | 'Travel';
}

const TransactionSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Food', 'Transportation', 'Shopping', 'Events', 'Recurring','Services','Travel'], 
    default: 'Recurring' 
  },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
