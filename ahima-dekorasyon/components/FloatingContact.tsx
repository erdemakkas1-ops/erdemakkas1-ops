import { telLink, whatsappLink } from '@/lib/site';

/** Desktop: one quiet WhatsApp button. Phones: a slim bar with call / WhatsApp / keşif. */
export default function FloatingContact() {
  return (
    <>
      <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp’tan yazın"
        className="group fixed bottom-6 right-6 z-40 flex h-14 items-center gap-3 bg-[#1f5c45] pl-4 pr-5 text-paper shadow-[0_10px_30px_rgba(0,0,0,.25)] transition-transform hover:-translate-y-1 max-[700px]:hidden">
        <WaIcon /><span className="text-[13px] font-semibold">WhatsApp</span>
      </a>
      <nav aria-label="Hızlı iletişim" className="fixed inset-x-0 bottom-0 z-40 hidden grid-cols-3 border-t border-ink/10 bg-paper pb-[env(safe-area-inset-bottom)] text-ink max-[700px]:grid">
        <a href={telLink} className="flex h-14 items-center justify-center gap-2 text-[13px] font-semibold">Ara</a>
        <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex h-14 items-center justify-center gap-2 bg-[#1f5c45] text-[13px] font-semibold text-paper"><WaIcon />WhatsApp</a>
        <a href="#teklif" className="flex h-14 items-center justify-center text-[13px] font-semibold">Keşif iste</a>
      </nav>
    </>
  );
}

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}
