"use client";

import { Component, memo, useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import type { Room } from "@/types/floorPlan";
import { createPlanGeometry } from "@/lib/floorPlanGeometry";
import { WALL_HEIGHT, WALL_THICKNESS, SLAB_THICKNESS, DOOR_HEIGHT, WINDOW_SILL, WINDOW_HEIGHT, RAIL_HEIGHT } from "@/lib/floorPlan3DConfig";
import { useTouchOrbit } from "@/lib/useTouchOrbit";

type Props = { rooms: Room[]; hoveredRoom: string | null; onHover: (id: string | null) => void; onSelect?: (id: string) => void; fillContainer?: boolean; onReady?: () => void };
type Plan = ReturnType<typeof createPlanGeometry>;
const slabOptions = { depth: SLAB_THICKNESS, bevelEnabled: false };

const Block = memo(function Block({ position, size, color = "#d8d4c9", glass = false }: {
  position: [number,number,number]; size: [number,number,number]; color?: string; glass?: boolean;
}) {
  return <mesh position={position}><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={glass ? 0.2 : 0.85} transparent={glass} opacity={glass ? 0.22 : 1} depthWrite={!glass}/></mesh>;
});

const RoomSlab = memo(function RoomSlab({ shape, color }: { shape: Plan["rooms"][number]["shape"]; color: string }) {
  return <mesh rotation={[-Math.PI/2,0,0]} position={[0,-SLAB_THICKNESS,0]}>
    <extrudeGeometry args={[shape,slabOptions]}/>
    <meshStandardMaterial color={color} roughness={0.9}/>
  </mesh>;
});

const Wall = memo(function Wall({ wall }: { wall: Plan["walls"][number] }) {
  const dx=wall.to[0]-wall.from[0], dz=wall.to[1]-wall.from[1];
  const length=Math.hypot(dx,dz);
  const thickness=wall.roomIds.length===1 ? WALL_THICKNESS*1.5 : WALL_THICKNESS;
  const window=wall.opening==="window", sliding=wall.opening==="sliding";
  const sill=window ? WINDOW_SILL : 0;
  const top=window ? WINDOW_SILL+WINDOW_HEIGHT : DOOR_HEIGHT;
  return <group position={[(wall.from[0]+wall.to[0])/2,0,(wall.from[1]+wall.to[1])/2]} rotation={[0,-Math.atan2(dz,dx),0]}>
    {wall.railing ? <>
      <Block position={[0,RAIL_HEIGHT/2,0]} size={[length,RAIL_HEIGHT,0.035]} color="#b3c8cc" glass/>
      <Block position={[0,RAIL_HEIGHT,0]} size={[length,0.045,0.055]} color="#938c7d"/>
      {[-1,1].map(side=><Block key={side} position={[side*length/2,RAIL_HEIGHT/2,0]} size={[0.04,RAIL_HEIGHT,0.04]} color="#938c7d"/>)}
    </> : wall.opening ? <>
      {sill>0 && <Block position={[0,sill/2,0]} size={[length,sill,thickness]}/>}
      <Block position={[0,(WALL_HEIGHT+top)/2,0]} size={[length,WALL_HEIGHT-top,thickness]}/>
      {(window||sliding) && <>
        <Block position={[0,(sill+top)/2,0]} size={[length,top-sill,0.025]} color="#abc8d1" glass/>
        {[sill,top].map(y=><Block key={y} position={[0,y,0]} size={[length,0.045,0.06]} color="#817d72"/>)}
        {[-1,0,1].map(side=><Block key={side} position={[side*length/2,(sill+top)/2,0]} size={[0.035,top-sill,0.06]} color="#817d72"/>)}
      </>}
    </> : <Block position={[0,WALL_HEIGHT/2,0]} size={[length,WALL_HEIGHT,thickness]}/>}
  </group>;
});

function CameraControls({ plan }: { plan: Plan }) {
  const aspect=useThree(state=>state.size.width/state.size.height);
  const radius=Math.hypot(plan.width,plan.depth,WALL_HEIGHT)/2;
  const halfFov=Math.min(Math.PI/8,Math.atan(Math.tan(Math.PI/8)*aspect));
  const distance=radius/Math.sin(halfFov)*1.06;
  // A keyed camera rig refits on resize without resetting the user's orbit on hover.
  return <CameraRig key={distance.toFixed(3)} distance={distance}/>;
}

function CameraRig({ distance }: { distance: number }) {
  const invalidate=useThree(state=>state.invalidate);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  useTouchOrbit(controlsRef);
  const initialize=useCallback((controls: OrbitControlsImpl | null)=> {
    controlsRef.current = controls;
    if (!controls) return;
    const camera=controls.object;
    camera.position.set(distance*0.46,distance*0.72,distance*0.52);
    controls.target.set(0,0.7,0);
    controls.update();
    invalidate();
  },[distance,invalidate]);
  return <OrbitControls makeDefault ref={initialize} enablePan={false} minDistance={distance*0.72} maxDistance={distance*1.45} minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/2.7} enableDamping dampingFactor={0.08}/>;
}

function Dollhouse({ plan, hoveredRoom, onHover, onSelect }: Props & { plan: Plan }) {
  const canvas = useThree(state => state.gl.domElement);
  const gesture = useRef({ pointers: new Set<number>(), x: 0, y: 0, dragged: false });
  useEffect(() => {
    const state = gesture.current;
    const down = (event: PointerEvent) => {
      if (!state.pointers.size) { state.x = event.clientX; state.y = event.clientY; state.dragged = false; }
      state.pointers.add(event.pointerId);
      if (state.pointers.size > 1) state.dragged = true;
    };
    const move = (event: PointerEvent) => {
      if (state.pointers.has(event.pointerId) && Math.hypot(event.clientX - state.x, event.clientY - state.y) > 5) state.dragged = true;
    };
    const up = (event: PointerEvent) => { move(event); state.pointers.delete(event.pointerId); };
    const cancel = () => { state.pointers.clear(); state.dragged = true; onHover(null); };
    canvas.addEventListener("pointerdown", down, true);
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", cancel, true);
    window.addEventListener("blur", cancel);
    return () => {
      canvas.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", cancel, true);
      window.removeEventListener("blur", cancel);
    };
  }, [canvas, onHover]);
  return <>
    <ambientLight intensity={0.85}/>
    <hemisphereLight args={["#f6f0df","#364459",1.5]}/>
    <directionalLight position={[6,14,8]} intensity={2}/>
    <directionalLight position={[-8,8,-5]} intensity={0.7}/>
    {plan.rooms.map(({room,shape,label})=> <group key={room.id}>
      <RoomSlab shape={shape} color={room.id==="balcony" ? "#a49d8d" : room.id.includes("bath")||room.id==="ensuite" ? "#bbbdb9" : "#d2c8b5"}/>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.012,0]} onPointerOver={event=>{event.stopPropagation();if (event.pointerType !== "touch") onHover(room.id);}} onPointerMove={event=>{event.stopPropagation();if (event.pointerType !== "touch" && !gesture.current.pointers.size) onHover(room.id);}} onPointerOut={()=>onHover(null)} onClick={event => { event.stopPropagation(); if (!gesture.current.dragged && event.delta <= 5) onSelect?.(room.id); }}>
        <shapeGeometry args={[shape]}/>
        <meshBasicMaterial color="#d8b879" transparent opacity={hoveredRoom===room.id ? 0.42 : 0} depthWrite={false}/>
      </mesh>
      {hoveredRoom===room.id && <Html position={[label[0],0.5,label[1]]} center style={{pointerEvents:"none",whiteSpace:"nowrap"}}>
        <div className="rounded-md border border-[#d8b879]/30 bg-[#080e19]/95 px-3 py-2 text-center shadow-lg"><div className="text-[11px] tracking-widest text-[#e7cf9e]">{room.name.toLocaleUpperCase("tr-TR")}</div><div className="mt-1 text-[11px] text-slate-300">{room.area} m²</div></div>
      </Html>}
    </group>)}
    {plan.walls.map((wall,i)=><Wall key={i} wall={wall}/>)}
    <CameraControls plan={plan}/>
  </>;
}

class PlanErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state={failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() { return this.state.failed ? <p role="alert" className="p-8 text-center text-sm text-slate-400">3D plan gösterilemedi. 2D PLAN ile devam edebilirsiniz.</p> : this.props.children; }
}

export default function FloorPlan3D(props: Props) {
  const plan=useMemo(()=>createPlanGeometry(props.rooms),[props.rooms]);
  return <div role="img" aria-label="İnteraktif 3D daire planı" className={`scrollable-canvas ${props.fillContainer ? "absolute inset-0" : "relative aspect-[700/630] w-full lg:aspect-auto lg:h-[max(340px,calc(100dvh-190px))]"}`} style={{cursor:props.hoveredRoom ? "pointer" : "grab"}} onPointerLeave={()=>props.onHover(null)}>
    <PlanErrorBoundary><Canvas onCreated={() => props.onReady?.()} frameloop="demand" shadows={false} gl={{ preserveDrawingBuffer: false }} dpr={[1,1.5]} camera={{fov:45,near:0.1,far:300}} fallback={<p className="p-8 text-sm text-slate-400">3D plan için WebGL destekli bir tarayıcı gerekiyor.</p>}>
      <Dollhouse {...props} plan={plan}/>
    </Canvas></PlanErrorBoundary>
  </div>;
}


