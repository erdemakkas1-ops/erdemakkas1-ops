/** Minimal header. The wordmark is a temporary placeholder until the official logo is supplied. */
export default function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#donusum" aria-label="Ahima Dekorasyon — başa dön">
        <span className="wordmark__main">AHIMA</span>
        <span className="wordmark__sub">DEKORASYON</span>
      </a>
      <nav className="site-nav" aria-label="Sayfa içi">
        <a href="#hizmetler">Hizmetler</a>
        <a href="#projeler">Projeler</a>
        <a href="#iletisim">İletişim</a>
      </nav>
      <a className="btn btn--outline btn--sm" href="#iletisim">
        Teklif al <span aria-hidden>→</span>
      </a>
    </header>
  );
}
