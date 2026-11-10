export type ApartmentDetailMode = "2d" | "3d";

export type Room = {
  id: string;
  name: string;
  area: number;
  x: number;
  y: number;
  width: number;
  height: number;
  path?: string;
  labelX?: number;
  labelY?: number;
};
