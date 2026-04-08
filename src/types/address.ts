import { HouseType } from "../../generated/prisma/enums";

export type TAddress = {
  city: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  apartment?: string | null;
  label: HouseType;
  isDefault?: boolean;
};