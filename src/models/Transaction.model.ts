import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {}

const TransactionSchema = new Schema(
  {},
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Transaction = mongoose.model<TransactionDoc>(
  "transaction",
  TransactionSchema
);
export { Transaction };
