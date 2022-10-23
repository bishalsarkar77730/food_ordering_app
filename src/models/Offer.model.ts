import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {
  offerType: string; // Vendor , Generic
  vendors: [any]; // Vendors id
  title: string;
  description: string;
  minValue: number; // min order amount
  offerAmount: number; // 200
  startValidity: Date;
  endValidity: Date;
  promocode: string;
  promoType: string; // User, All, Bank, card
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}

const OfferSchema = new Schema(
  {
    offerType: { type: String, require: true },
    vendors: [
      {
        type: Schema.Types.ObjectId,
        ref: "vandor",
      },
    ],
    title: { type: String, require: true },
    description: { type: String },
    minValue: { type: Number, require: true },
    offerAmount: { type: Number, require: true },
    startValidity: { type: Date },
    endValidity: { type: Date },
    promocode: { type: String, require: true },
    promoType: { type: String, require: true },
    bank: [{ type: String }],
    bins: [{ type: Number }],
    pincode: { type: String, require: true },
    isActive: { type: Boolean },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);
export { Offer };
