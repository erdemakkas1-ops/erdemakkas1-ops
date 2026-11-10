export default function SectionHeading({ eyebrow, title, intro, id, tone = "light", align = "left" }: { eyebrow: string; title: React.ReactNode; intro?: string; id: string; tone?: "light" | "dark"; align?: "left" | "center" }) {
  const dark = tone === "dark";
  return <div data-reveal className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${dark ? "text-[#d9bd86]" : "text-[#a88a55]"}`}>{eyebrow}</p>
    <h2 id={id} className={`mt-4 font-serif text-[clamp(2.3rem,5vw,3.9rem)] font-semibold leading-[0.98] ${dark ? "text-[#f6f2ea]" : "text-[#1c1b19]"}`}>{title}</h2>
    {intro && <p className={`mt-5 text-[16px] leading-relaxed ${dark ? "text-[#b8afa2]" : "text-[#5d574e]"}`}>{intro}</p>}
  </div>;
}
