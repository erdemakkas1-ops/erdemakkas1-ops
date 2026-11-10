export type ApartmentStatus = "available" | "sold";
export type ApartmentType = "2+1" | "3+1" | "4+1";

export type Apartment = {
  id: string;
  type: ApartmentType;
  area: number;
  price: number;
  status: ApartmentStatus;
};
