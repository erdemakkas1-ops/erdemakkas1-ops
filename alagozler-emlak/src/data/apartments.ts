import type { Apartment } from "@/types/apartment";
import { getApartmentPrice } from "../lib/paymentConfig";
import { FLOOR_COUNT } from "../lib/buildingConfig";

const floorTemplates: Array<Pick<Apartment, "type" | "area" | "status">> = [
  { type: "3+1", area: 165, status: "available" },
  { type: "2+1", area: 118, status: "sold" },
  { type: "4+1", area: 210, status: "available" },
];

export const apartmentsByFloor: Record<number, Apartment[]> = Object.fromEntries(
  Array.from({ length: FLOOR_COUNT }, (_, index) => {
    const floor = index + 1;
    return [floor, floorTemplates.map((apartment, apartmentIndex) => ({
      ...apartment,
      id: `${floor}${String.fromCharCode(65 + apartmentIndex)}`,
      price: getApartmentPrice(apartment.type, floor),
    }))];
  }),
);

export function getApartmentsForFloor(floor: number | null) {
  return floor === null ? [] : apartmentsByFloor[floor] ?? [];
}

export function findApartment(id: string): { apartment: Apartment; floor: number } | null {
  for (const [floor, apartments] of Object.entries(apartmentsByFloor)) {
    const apartment = apartments.find(item => item.id === id);
    if (apartment) return { apartment, floor: Number(floor) };
  }
  return null;
}

export function countAvailable(floor: number) {
  return getApartmentsForFloor(floor).filter(apartment => apartment.status === "available").length;
}
