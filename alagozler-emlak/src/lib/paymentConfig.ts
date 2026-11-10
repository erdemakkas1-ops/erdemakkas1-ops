export const BASE_PRICES = {
  "2+1": 18_500_000,
  "3+1": 23_500_000,
  "4+1": 28_500_000,
} as const;

export const FLOOR_PRICE_INCREMENT = 150_000;
export const DOWN_PAYMENT = { min: 25, max: 60, step: 5, default: 50 };
export const PAYMENT_TERM = { min: 12, max: 60, step: 6, default: 36 };

export function getApartmentPrice(type: string, floor: number): number {
  if (type !== "2+1" && type !== "3+1" && type !== "4+1") {
    return 0;
  }
  return BASE_PRICES[type] + (floor - 1) * FLOOR_PRICE_INCREMENT;
}
