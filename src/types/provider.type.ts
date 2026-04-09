export interface IProviderRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ICreateProviderProfile {
  businessName: string;
  businessCategory: "RESTAURANT" | "SHOP" | "HOME_KITCHEN" | "STREET_FOOD";
  phone: string;
  bio?: string;
  binNumber?: string;
  imageURL?: string;

  nidImageFront_and_BackURL?: string;
  businessMainGateURL?: string;
  businessKitchenURL?: string;
  
  city: string;
  street: string;
  houseNumber: string;
  apartment?: string;
  postalCode: string;
}

export interface IUpdateProviderProfile extends Partial<ICreateProviderProfile> { }