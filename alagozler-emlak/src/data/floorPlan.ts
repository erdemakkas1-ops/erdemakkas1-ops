import type { Room } from "@/types/floorPlan";

// Shared, unscaled demo layout. Room areas are illustrative, not apartment totals.
export const floorPlanRooms: Room[] = [
  { id: "living", name: "Salon", area: 42, x: 60, y: 250, width: 270, height: 260, labelX: 220, labelY: 430 },
  { id: "kitchen", name: "Mutfak", area: 18, x: 60, y: 70, width: 220, height: 180, labelX: 185, labelY: 205 },
  { id: "primary", name: "Ebeveyn Yatak Odası", area: 21, x: 380, y: 380, width: 310, height: 190, path: "M380 380H690V570H510V470H380Z", labelX: 595, labelY: 515 },
  { id: "bedroom-2", name: "Yatak Odası 2", area: 14, x: 380, y: 70, width: 103, height: 230, labelX: 432, labelY: 239 },
  { id: "bedroom-3", name: "Yatak Odası 3", area: 13, x: 483, y: 70, width: 104, height: 230, labelX: 535, labelY: 239 },
  { id: "bedroom-4", name: "Yatak Odası 4", area: 14, x: 587, y: 70, width: 103, height: 230, labelX: 639, labelY: 239 },
  { id: "bath", name: "Banyo", area: 5, x: 280, y: 70, width: 100, height: 110, labelX: 330, labelY: 149 },
  { id: "ensuite", name: "Ebeveyn Banyo", area: 6, x: 380, y: 470, width: 130, height: 100, labelX: 445, labelY: 538 },
  { id: "entrance", name: "Antre", area: 10, x: 280, y: 180, width: 410, height: 390, path: "M280 180H380V300H690V380H380V570H330V250H280Z", labelX: 493, labelY: 337 },
  { id: "balcony", name: "Balkon", area: 14, x: 60, y: 510, width: 210, height: 120, path: "M60 510H270V630H85L60 605Z", labelX: 175, labelY: 588 },
];

export type FloorPlanType = "2+1" | "3+1" | "4+1";

// Keep the exterior, balcony and corridor intact. Merge surplus bedrooms rather
// than leaving holes in the slab; both renderers consume these same polygons.
function createRooms(type: "2+1" | "3+1", areas: Record<string, number>): Room[] {
  return floorPlanRooms.filter(room => room.id in areas).map(room => {
    const updated = { ...room, area: areas[room.id] };
    if (type === "3+1" && room.id === "bedroom-3") {
      return { ...updated, width: 207, labelX: 586 };
    }
    if (type === "2+1" && room.id === "bedroom-2") {
      return { ...updated, width: 310, labelX: 535 };
    }
    if (type === "2+1" && room.id === "primary") {
      return { ...updated, path: undefined };
    }
    return updated;
  });
}

export const floorPlanTemplates: Record<FloorPlanType, { rooms: Room[]; netArea: number }> = Object.fromEntries(
  Object.entries({
    "2+1": createRooms("2+1", { living: 26, kitchen: 11, primary: 16, "bedroom-2": 12, bath: 5, entrance: 10, balcony: 10 }),
    "3+1": createRooms("3+1", { living: 32, kitchen: 14, primary: 18, "bedroom-2": 13, "bedroom-3": 12, bath: 5, ensuite: 5, entrance: 12, balcony: 12 }),
    "4+1": floorPlanRooms,
  }).map(([type, rooms]) => [type, { rooms, netArea: rooms.reduce((sum, room) => sum + room.area, 0) }]),
) as Record<FloorPlanType, { rooms: Room[]; netArea: number }>;

export function getFloorPlanTemplate(type: string) {
  return floorPlanTemplates[type as FloorPlanType] ?? { rooms: [], netArea: 0 };
}

export function isSupportedFloorPlanType(type: string): type is FloorPlanType {
  return type === "2+1" || type === "3+1" || type === "4+1";
}
