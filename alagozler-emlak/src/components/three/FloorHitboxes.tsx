"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import type { BuildingFloor } from "@/lib/buildingLayout";
import FloorHighlight from "./FloorHighlight";

export type FloorInteractionProps = {
  hoveredFloor: number | null;
  selectedFloor: number | null;
  onHoverChange: Dispatch<SetStateAction<number | null>>;
  onSelect: (floorNumber: number) => void;
};

const CLICK_TOLERANCE_PX = 5;

export default function FloorHitboxes({
  floors, getLabel, hoveredFloor, selectedFloor, onHoverChange, onSelect,
}: FloorInteractionProps & { floors: BuildingFloor[]; getLabel: (floorNumber: number) => { title: string; detail: string } }) {
  const { gl } = useThree();
  const gesture = useRef({
    pointers: new Set<number>(),
    startX: 0,
    startY: 0,
    dragged: false,
    downFloor: null as number | null,
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const state = gesture.current;

    const start = (event: PointerEvent) => {
      if (state.pointers.size === 0) {
        state.startX = event.clientX;
        state.startY = event.clientY;
        state.dragged = false;
        state.downFloor = null;
      }
      state.pointers.add(event.pointerId);
      if (state.pointers.size > 1) {
        state.dragged = true;
        onHoverChange(null);
      }
    };
    const move = (event: PointerEvent) => {
      if (!state.pointers.has(event.pointerId)) return;
      // Keep the maximum displacement: dragging away and back is still an orbit.
      if (Math.hypot(event.clientX - state.startX, event.clientY - state.startY) > CLICK_TOLERANCE_PX) {
        state.dragged = true;
        onHoverChange(null);
      }
    };
    const end = (event: PointerEvent) => {
      move(event);
      state.pointers.delete(event.pointerId);
    };
    const cancel = () => {
      state.pointers.clear();
      state.dragged = true;
      state.downFloor = null;
      onHoverChange(null);
    };
    const leave = () => onHoverChange(null);

    // Observe without preventing DOM events or taking pointer capture away from OrbitControls.
    canvas.addEventListener("pointerdown", start, true);
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", end, true);
    window.addEventListener("pointercancel", cancel, true);
    window.addEventListener("blur", cancel);
    canvas.addEventListener("pointerleave", leave);
    return () => {
      canvas.removeEventListener("pointerdown", start, true);
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", cancel, true);
      window.removeEventListener("blur", cancel);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [gl, onHoverChange]);

  useEffect(() => {
    const canvas = gl.domElement;
    const previous = canvas.style.cursor;
    canvas.style.setProperty("cursor", hoveredFloor === null ? "auto" : "pointer");
    return () => { canvas.style.setProperty("cursor", previous); };
  }, [gl, hoveredFloor]);

  const hover = (event: ThreeEvent<PointerEvent>, floorNumber: number) => {
    // R3F propagation only: select the nearest box, not the boxes behind it.
    event.stopPropagation();
    if (event.pointerType === "touch" || (gesture.current.pointers.size > 0 && gesture.current.dragged)) return;
    onHoverChange(floorNumber);
  };

  return (
    <group name="residential-floor-hitboxes">
      {floors.map((floor) => (
        <mesh
          key={floor.floorNumber}
          name={`floor-hitbox-${String(floor.floorNumber).padStart(2, "0")}`}
          position={floor.center}
          userData={{ floorNumber: floor.floorNumber }}
          onPointerOver={(event) => hover(event, floor.floorNumber)}
          onPointerMove={(event) => hover(event, floor.floorNumber)}
          onPointerOut={() => onHoverChange((current) => current === floor.floorNumber ? null : current)}
          onPointerDown={(event) => {
            event.stopPropagation();
            if (event.button === 0 && !gesture.current.dragged) gesture.current.downFloor = floor.floorNumber;
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (event.button === 0 && !gesture.current.dragged && event.delta <= CLICK_TOLERANCE_PX && gesture.current.downFloor === floor.floorNumber) {
              onSelect(floor.floorNumber);
            }
          }}
        >
          <boxGeometry args={floor.size} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      ))}
      {floors.map((floor) => (
        <FloorHighlight key={floor.floorNumber} floor={floor} active={floor.floorNumber === selectedFloor || floor.floorNumber === hoveredFloor} label={floor.floorNumber === hoveredFloor ? getLabel(floor.floorNumber) : null} />
      ))}
    </group>
  );
}
