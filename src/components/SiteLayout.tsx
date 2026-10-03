import { useEffect, useRef, useState, type ReactNode } from "react";
import { TbBrandWhatsapp, TbMail, TbPhone } from "react-icons/tb";
import { assetUrl, navItems, siteConfig } from "../data/siteContent";

function Header({ isProjectPage, route }: { isProjectPage: boolean; route: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(isProjectPage ? "work" : "home");
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isProjectPage) {
      setActiveSection("work");
      return;
    }

    setActiveSection(navItems.some((item) => item.href === `#${route}`) ? route : "home");

    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isProjectPage, route]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" aria-label="Primary navigation" ref={headerRef}>
      <a className="brand-mark" href="#home" aria-label={`${siteConfig.name} home`}>
        <img src={assetUrl(siteConfig.logo)} width="1875" height="839" alt="Narkis" />
      </a>

      <button
        className={menuOpen ? "menu-toggle is-open" : "menu-toggle"}
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav id="site-nav" className={menuOpen ? "nav-list is-open" : "nav-list"}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={activeSection === item.href.slice(1) ? "is-active" : undefined}
            aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href={siteConfig.contactUrl} target="_blank" rel="noreferrer">
        <TbBrandWhatsapp aria-hidden="true" />
        {siteConfig.ctaLabel}
      </a>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="contact" aria-labelledby="footer-title">
      <div className="footer-main">
        <h2 id="footer-title">From the first idea to the <span>final detail.</span></h2>
        <div className="footer-details">
          <address className="footer-contact">
            <a href={`mailto:${siteConfig.email}`}><TbMail aria-hidden="true" /><span>{siteConfig.email}</span></a>
            <a href={siteConfig.phoneUrl}><TbPhone aria-hidden="true" /><span>{siteConfig.phone}</span></a>
          </address>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ route, isProjectPage, children }: {
  route: string;
  isProjectPage: boolean;
  children: ReactNode;
}) {
  return <>
    <Header route={route} isProjectPage={isProjectPage} />
    {children}
    <Footer />
  </>;
}
