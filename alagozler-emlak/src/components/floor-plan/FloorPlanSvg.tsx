import type { Room } from "@/types/floorPlan";
import { useSvgScale } from "@/lib/useSvgScale";

// Warm floors for living spaces, cool tones for wet areas and the balcony.
function roomFill(id: string, active: boolean) {
  if (id === "balcony") return active ? "#a3bacb" : "#8299ad";
  if (id === "bath" || id === "ensuite") return active ? "#bcd2e0" : "#9db6c8";
  if (id === "entrance") return active ? "#f0dfc2" : "#e3d1b2";
  return active ? "#ecd3a8" : "#d6bd95";
}

export default function FloorPlanSvg({ rooms, hoveredRoom, selectedRoom = null, onSelect, onHover, fillContainer = false }: {
  fillContainer?: boolean;
  rooms: Room[];
  hoveredRoom: string | null;
  selectedRoom?: string | null;
  onSelect?: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const hasRoom = (id: string) => rooms.some(room => room.id === id);
  const { ref, scale } = useSvgScale(700, 630);
  const compactLabels = scale < 0.75;
  const fontSize = Math.max(11, 11 / scale);
  return (
    <svg ref={ref} viewBox="25 35 700 630" className={fillContainer ? "absolute inset-0 h-full w-full" : "mx-auto w-full lg:h-[max(340px,calc(100dvh-190px))]"} role="group" aria-label="İnteraktif 2D daire planı">
      <title>Demo daire planı — odaları seçerek veya üzerlerine gelerek inceleyin</title>
      {rooms.map((room) => {
        const active = hoveredRoom === room.id;
        const path = room.path ?? `M${room.x} ${room.y}h${room.width}v${room.height}h${-room.width}Z`;
        return (
          <g
            key={room.id}
            role="button"
            tabIndex={0}
            aria-label={`${room.name}, ${room.area} m²`}
            aria-pressed={selectedRoom === room.id}
            data-room-shape={room.id}
            data-highlighted={active}
            onPointerEnter={event => { if (event.pointerType !== "touch") onHover(room.id); }}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(room.id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect?.(room.id)}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!event.repeat) onSelect?.(room.id);
              }
            }}
            className="cursor-pointer outline-none"
          >
            <path d={path} fill={roomFill(room.id, active)} stroke="#f3ede2" strokeWidth={active ? 4 : 3} strokeLinejoin="round" className="transition-[fill,stroke-width] duration-200" />
          </g>
        );
      })}
      {/* Architectural details are decorative and never intercept room events. */}
      <g pointerEvents="none" fill="none" strokeLinecap="square" strokeLinejoin="round">
        <path d="M60 70H90 M220 70H405 M458 70H508 M562 70H612 M665 70H690V400 M690 460V570H375 M335 570H330V510H235 M110 510H60V410 M60 285V70" stroke="#f3ede2" strokeWidth="8" />
        {/* Glazing, sliding balcony doors, and a light balcony balustrade. */}
        <g stroke="#7fa6c0" strokeWidth="1.6">
          <path d="M90 67H220M90 73H220M155 67V73 M405 67H458M405 73H458 M508 67H562M508 73H562 M612 67H665M612 73H665 M687 400V460M693 400V460 M57 285V410M63 285V410" />
          <path d="M110 507H235M110 513H235M165 507V513M180 507V513" />
          <path d="M66 518V602L89 624H264V518 M60 510V605L85 630H270V510" strokeOpacity="0.6" />
        </g>
        {/* Openings mask the room boundary; arcs suggest the door leaf swing. */}
        <g stroke="#d6bd95" strokeWidth="7">
          <path d={`M300 180H335 M280 195V235 M330 280V325 M395 300H430 ${hasRoom("bedroom-3") ? "M499 300H534" : ""} ${hasRoom("bedroom-4") ? "M603 300H638" : ""} M410 380H450 ${hasRoom("ensuite") ? "M510 490V530" : ""} M335 570H375`} />
        </g>
        <g stroke="#6d5d45" strokeOpacity="0.55" strokeWidth="1.1">
          <path d="M300 180V145M335 180A35 35 0 0 0 300 145 M280 235H240M280 195A40 40 0 0 0 240 235 M330 325H285M330 280A45 45 0 0 0 285 325" />
          <path d={`M395 300V265M430 300A35 35 0 0 0 395 265 ${hasRoom("bedroom-3") ? "M499 300V265M534 300A35 35 0 0 0 499 265" : ""} ${hasRoom("bedroom-4") ? "M603 300V265M638 300A35 35 0 0 0 603 265" : ""} M450 380V420M410 380A40 40 0 0 0 450 420 ${hasRoom("ensuite") ? "M510 530H470M510 490A40 40 0 0 0 470 530" : ""} M335 570V530M375 570A40 40 0 0 0 335 530`} />
        </g>
        {/* Quiet furniture silhouettes add scale without covering room labels. */}
        <g stroke="#6d5d45" strokeOpacity="0.4" strokeWidth="1.2">
          <rect x="83" y="305" width="47" height="142" rx="5" />
          <path d="M91 314H122V437H91Z M91 355H122M91 397H122" />
          <rect x="157" y="331" width="67" height="52" rx="12" />
          <path d="M305 350V415M299 354V411" />
          <rect x="174" y="465" width="88" height="23" rx="4" />
          <path d="M195 460V465M241 460V465M195 488V494M241 488V494" />
          <path d="M79 88H258V115H106V169H79Z" />
          <rect x="121" y="92" width="40" height="18" rx="3" />
          <circle cx="211" cy="99" r="5" /><circle cx="235" cy="99" r="5" />
          <rect x="157" y="144" width="86" height="23" rx="2" />
          {rooms.filter(room => room.id.startsWith("bedroom-")).map(room => {
            const x = room.width > 104 ? room.x + (room.width - 58) / 2 : room.id === "bedroom-2" ? 402 : room.id === "bedroom-3" ? 506 : 610;
            return <g key={room.id}><rect x={x} y="108" width="58" height="100" rx="4" /><rect x={x + 8} y="116" width="42" height="20" rx="3" /><path d={`M${x} 143h58 M${x - 10} 111v24`} /></g>;
          })}
          <rect x="568" y="398" width="91" height="87" rx="4" />
          <rect x="575" y="404" width="34" height="19" rx="3" /><rect x="618" y="404" width="34" height="19" rx="3" />
          <path d={`M568 430H659 M397 441H493V460H397Z M300 87H359V117H300Z M304 90L353 113 ${hasRoom("ensuite") ? "M397 484H456V510H397Z" : ""}`} />
          <circle cx="90" cy="551" r="11" /><circle cx="92" cy="588" r="8" />
          <rect x="213" y="547" width="26" height="39" rx="5" />
        </g>
        <path d="M355 601V584M350 589L355 584L360 589" stroke="#6d5d45" strokeWidth="1.2" />
      </g>
      {/* Visible labels sit above the furniture; the room buttons above carry the spoken names. */}
      <g aria-hidden="true" pointerEvents="none">
        {rooms.map(room => {
          const label = room.name.toLocaleUpperCase("tr-TR");
          const lines = room.id === "primary" ? compactLabels ? ["EBEV.", "YATAK"] : ["EBEVEYN", "YATAK ODASI"] : room.id === "ensuite" ? [compactLabels ? "EBEV." : "EBEVEYN", "BANYO"] : room.id.startsWith("bedroom-") ? compactLabels ? [room.width * scale < 48 ? room.id.split("-")[1] : `ODA ${room.id.split("-")[1]}`] : ["YATAK ODASI", room.id.split("-")[1]] : [room.id === "bath" && room.width * scale < 40 ? "BNY." : label];
          const centerX = room.labelX ?? room.x + room.width / 2;
          const centerY = room.labelY ?? room.y + room.height / 2;
          return <text key={room.id} x={centerX} y={centerY - (lines.length - 1) * fontSize * 0.625 - (compactLabels ? 0 : 4)} textAnchor="middle" fill="#2a2216" fontSize={fontSize} fontWeight={600} letterSpacing={compactLabels ? 0 : 0.6}>
            {lines.map((line, index) => <tspan key={line} x={centerX} dy={index === 0 ? 0 : fontSize * 1.25}>{line}</tspan>)}
            {!compactLabels && <tspan x={centerX} dy="20" fill="#5e513d" fontSize={Math.max(12, fontSize)} fontWeight={500} letterSpacing="0">{room.area} m²</tspan>}
          </text>;
        })}
      </g>
    </svg>
  );
}
