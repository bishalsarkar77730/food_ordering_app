export interface CreateVandorInput {
  name: string;
  OwnerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface EditVandorInput {
  name: string;
  foodType: [string];
  address: string;
  phone: string;
}

export interface VandorLoginInputs {
  email: string;
  password: string;
}

export interface VandorPayload {
  _id: string;
  name: string;
  foodType: [string];
  email: string;
}

export interface CreateOfferInputs {
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
