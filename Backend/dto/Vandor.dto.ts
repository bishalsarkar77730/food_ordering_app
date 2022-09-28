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
