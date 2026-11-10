import { locationPois, locationProject } from "@/data/location";
import { project } from "@/data/project";
import { useSvgScale } from "@/lib/useSvgScale";

export default function LocationMap({ hoveredPoi, onHover }: { hoveredPoi: string | null; onHover: (id: string | null) => void }) {
  const activePoi = locationPois.find(poi => poi.id === hoveredPoi);
  const { ref, scale } = useSvgScale(762.72, 576.28);
  const labelSize = Math.max(13, 11 / scale);
  const projectLabelSize = Math.max(13, 12 / scale);
  return <div className="relative flex h-full min-h-[380px] min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1421]">
    <svg ref={ref} viewBox="68.64 56.86 762.72 576.28" className="h-full max-h-[85svh] w-full" role="group" aria-label="Şematik demo konum haritası">
      <title>{`${project.name} ve çevresindeki altı yakınlık noktası`}</title>
      <desc>Gerçek coğrafyayı temsil etmeyen stilize demo harita. Süreler örnektir.</desc>
      <g pointerEvents="none">
        <path d="M765 0H900V680H725Q770 615 746 555Q713 490 755 424Q792 367 760 308Q723 240 772 175Q810 110 765 0Z" fill="#0e2437" />
        <path d="M765 0Q810 110 772 175Q723 240 760 308Q792 367 755 424Q713 490 746 555Q770 615 725 680" fill="none" stroke="#294050" strokeWidth="2" />
        <path d="M779 0Q824 110 786 175Q737 240 774 308Q806 367 769 424Q727 490 760 555Q784 615 739 680" fill="none" stroke="#1c3448" strokeWidth="1" />
        <g fill="#142725" stroke="#1b3330" strokeWidth="1">
          <path d="M380 110L440 90L465 174L410 210L360 174Z" />
          <path d="M560 460L636 484L687 565L623 610L535 568Z" />
          <path d="M83 415L132 434L156 519L106 540L68 482Z" />
        </g>
        <g fill="#111e2d" stroke="#223040" strokeWidth="1">
          <path d="M76 86L141 65L165 117L105 148Z M116 171L197 144L231 195L157 230Z M184 260L250 238L280 287L210 312Z" />
          <path d="M350 65L365 105L308 136L281 91Z M385 235L445 220L429 286L389 293Z M502 83L596 72L605 121L553 126Z" />
          <path d="M577 210L661 196L691 274L609 296L562 264Z M599 327L679 314L702 365L644 397Z" />
          <path d="M242 408L310 392L350 439L297 467L247 455Z M372 534L444 499L475 560L413 591Z M201 554L267 531L290 591L228 621Z" />
          <path d="M472 398L521 392L544 438L484 457Z M72 282L135 254L160 309L97 340Z" />
        </g>
        <g fill="none" stroke="#253747" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M25 391L170 375L230 370L310 350L390 340L450 345L510 352Q550 355 565 390L595 440Q620 462 645 440L719 382" />
          <path d="M155 42L195 115L235 165Q255 200 285 220L325 250L350 305L390 340L440 420Q438 458 400 478L340 510L211 581L141 665" />
          <path d="M443 676L477 587L458 500L440 420L450 345L470 270Q480 238 510 215L540 195V155L544 17" />
        </g>
        <g fill="none" stroke="#536172" strokeOpacity="0.32" strokeWidth="1">
          <path d="M25 391L170 375L230 370L310 350L390 340L450 345L510 352Q550 355 565 390L595 440Q620 462 645 440L719 382 M155 42L195 115L235 165Q255 200 285 220L325 250L350 305L390 340L440 420 M440 420L450 345L470 270Q480 238 510 215L540 195V155L544 17" />
          <path d="M44 176L235 165L308 136L410 210L510 215L661 196L735 156 M65 535L247 455L310 350L285 220L281 91 M106 640L340 510L458 500L560 460L702 365 M76 86L157 230L210 312L230 370L156 519 M596 72L609 296L644 397L687 565 M97 340L72 282L197 144 M444 499L413 591L623 610" />
        </g>
        <ellipse cx={locationProject.x} cy={locationProject.y} rx="135" ry="120" fill="none" stroke="#d8b879" strokeOpacity="0.12" strokeDasharray="3 8" />
        {activePoi && <path d={activePoi.route} fill="none" stroke="#d8b879" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" />}
        <circle data-project-marker cx={locationProject.x} cy={locationProject.y} r="27" fill="#d8b879" fillOpacity="0.08" stroke="#d8b879" strokeOpacity="0.35" />
        <circle data-project-marker cx={locationProject.x} cy={locationProject.y} r="13" fill="#d8b879" stroke="#f0d7a4" strokeWidth="1.8" />
        <path d="M445 349V341H449V337H455V349Z" fill="#192231" />
        <rect x="401" y="377" width="98" height="29" rx="4" fill="#0a1421" stroke="#d8b879" strokeOpacity="0.35" />
        <text x="450" y="396" textAnchor="middle" fill="#edd3a2" fontSize={projectLabelSize} fontWeight="600" letterSpacing={scale < 0.7 ? 0 : 2} paintOrder="stroke" stroke="#0a1421" strokeWidth="3">{project.name}</text>
      </g>
      {locationPois.map(poi => {
        const active = poi.id === hoveredPoi;
        return <g key={poi.id} role="button" tabIndex={0} aria-label={`${poi.name}, ${poi.minutes} dakika`} data-poi-marker={poi.id} data-highlighted={active} className="cursor-pointer outline-none" onPointerEnter={() => onHover(poi.id)} onPointerLeave={() => onHover(null)} onFocus={() => onHover(poi.id)} onBlur={() => onHover(null)} onClick={() => onHover(poi.id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onHover(poi.id); } }}>
          <circle cx={poi.x} cy={poi.y} r="25" fill="transparent" />
          <circle cx={poi.x} cy={poi.y} r={active ? 14 : 11} fill={active ? "#2b2b25" : "#0d1928"} stroke={active ? "#d8b879" : "#758492"} strokeWidth="1.2" className="transition-all duration-200" />
          <circle cx={poi.x} cy={poi.y} r="3" fill={active ? "#e5c790" : "#d5d9db"} />
        </g>;
      })}
      {/* Visible labels; the markers above carry the spoken names. */}
      <g aria-hidden="true" pointerEvents="none">
        {locationPois.map(poi => {
          const active = poi.id === hoveredPoi;
          return <g key={poi.id}>
            <text x={poi.x} y={poi.y + Math.max(33, 18 / scale)} textAnchor="middle" fill={active ? "#edd3a2" : "#c1cad4"} fontSize={labelSize} letterSpacing={scale < 0.7 ? 0 : 0.8} paintOrder="stroke" stroke="#0a1421" strokeWidth="4">{poi.name.toLocaleUpperCase("tr-TR")}</text>
            {active && <text x={poi.x} y={poi.y - Math.max(23, 18 / scale)} textAnchor="middle" fill="#e5c790" fontSize={labelSize} paintOrder="stroke" stroke="#0a1421" strokeWidth="4">{poi.minutes} dk</text>}
          </g>;
        })}
      </g>
    </svg>
  </div>;
}

