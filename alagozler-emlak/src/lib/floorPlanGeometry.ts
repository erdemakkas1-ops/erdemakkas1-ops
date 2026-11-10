import { Shape } from "three";
import type { Room } from "@/types/floorPlan";
import { PLAN_SCALE } from "./floorPlan3DConfig";

export type Point = [number, number];
export type Opening = { from: Point; to: Point; kind: "door" | "window" | "sliding" };

// Openings follow the door and window gaps in the shared SVG plan coordinates.
export const planOpenings: Opening[] = [
  { from: [300,180], to: [335,180], kind: "door" },
  { from: [280,195], to: [280,235], kind: "door" },
  { from: [330,280], to: [330,325], kind: "door" },
  { from: [395,300], to: [430,300], kind: "door" },
  { from: [499,300], to: [534,300], kind: "door" },
  { from: [603,300], to: [638,300], kind: "door" },
  { from: [410,380], to: [450,380], kind: "door" },
  { from: [510,490], to: [510,530], kind: "door" },
  { from: [335,570], to: [375,570], kind: "door" },
  { from: [90,70], to: [220,70], kind: "window" },
  { from: [405,70], to: [458,70], kind: "window" },
  { from: [508,70], to: [562,70], kind: "window" },
  { from: [612,70], to: [665,70], kind: "window" },
  { from: [690,400], to: [690,460], kind: "window" },
  { from: [60,285], to: [60,410], kind: "window" },
  { from: [110,510], to: [235,510], kind: "sliding" },
];

// The demo paths use straight, absolute M/L/H/V/Z commands only.
export function roomPolygon(room: Room): Point[] {
  if (!room.path) return [[room.x,room.y],[room.x+room.width,room.y],[room.x+room.width,room.y+room.height],[room.x,room.y+room.height]];
  const points: Point[] = [];
  let x = 0, y = 0;
  for (const match of room.path.matchAll(/([MLHVZ])([^MLHVZ]*)/g)) {
    const values = match[2].trim().split(/[\s,]+/).map(Number);
    if (match[1] === "Z") continue;
    if (match[1] === "M" || match[1] === "L") [x,y] = values;
    if (match[1] === "H") x = values[0];
    if (match[1] === "V") y = values[0];
    points.push([x,y]);
  }
  return points;
}

const onSegment = (p: Point, a: Point, b: Point) =>
  Math.abs((p[0]-a[0])*(b[1]-a[1])-(p[1]-a[1])*(b[0]-a[0])) < 0.001 &&
  p[0] >= Math.min(a[0],b[0]) && p[0] <= Math.max(a[0],b[0]) &&
  p[1] >= Math.min(a[1],b[1]) && p[1] <= Math.max(a[1],b[1]);

export function createPlanGeometry(rooms: Room[]) {
  const roomIds = new Set(rooms.map(room => room.id));
  const openings = planOpenings.filter(opening => {
    if (opening.kind !== "door") return true;
    if (opening.from[0] === 499) return roomIds.has("bedroom-3");
    if (opening.from[0] === 603) return roomIds.has("bedroom-4");
    if (opening.from[0] === 510) return roomIds.has("ensuite");
    return true;
  });
  const polygons = rooms.map(roomPolygon);
  const vertices = polygons.flat();
  const minX = Math.min(...vertices.map(p=>p[0])), maxX = Math.max(...vertices.map(p=>p[0]));
  const minY = Math.min(...vertices.map(p=>p[1])), maxY = Math.max(...vertices.map(p=>p[1]));
  const toWorld = ([x,y]: Point): Point => [(x-(minX+maxX)/2)*PLAN_SCALE,(y-(minY+maxY)/2)*PLAN_SCALE];
  const splitPoints = [...vertices,...openings.flatMap(o=>[o.from,o.to])];
  const edges = new Map<string, { from: Point; to: Point; roomIds: string[]; opening?: Opening["kind"] }>();
  polygons.forEach((polygon, index) => polygon.forEach((a,i)=> {
    const b = polygon[(i+1)%polygon.length];
    const points = splitPoints.filter(p=>onSegment(p,a,b));
    const unique = [...new Map(points.map(p=>[p.join(","),p])).values()].sort((p,q)=>p[0]-q[0] || p[1]-q[1]);
    for (let j=0;j<unique.length-1;j++) {
      const from=unique[j],to=unique[j+1],key=`${from.join(",")}:${to.join(",")}`;
      const existing=edges.get(key);
      if (existing) existing.roomIds.push(rooms[index].id);
      else edges.set(key,{from,to,roomIds:[rooms[index].id],opening:openings.find(o=>onSegment(from,o.from,o.to)&&onSegment(to,o.from,o.to))?.kind});
    }
  }));
  return {
    toWorld,
    width:(maxX-minX)*PLAN_SCALE,
    depth:(maxY-minY)*PLAN_SCALE,
    rooms:rooms.map((room,i)=> {
      const shape=new Shape();
      polygons[i].forEach((p,j)=> { const [x,z]=toWorld(p); if(j===0) shape.moveTo(x,-z); else shape.lineTo(x,-z); });
      shape.closePath();
      return {room,shape,label:toWorld([room.labelX??room.x+room.width/2,room.labelY??room.y+room.height/2])};
    }),
    walls:[...edges.values()].map(edge=> ({...edge,from:toWorld(edge.from),to:toWorld(edge.to),railing:edge.roomIds.length===1&&edge.roomIds[0]==="balcony"})),
  };
}
