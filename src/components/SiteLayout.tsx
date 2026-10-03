import { useEffect, useRef, useState, type ReactNode } from "react";
import { TbBrandWhatsapp, TbChevronDown, TbMail, TbPhone } from "react-icons/tb";
import { assetUrl, categories, navItems, siteConfig } from "../data/siteContent";

function Header({ isProjectPage, route }: { isProjectPage: boolean; route: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 760px)").matches);
  const [activeSection, setActiveSection] = useState(isProjectPage ? "work" : "home");
  const headerRef = useRef<HTMLElement | null>(null);
  const workRef = useRef<HTMLDivElement | null>(null);
  const workToggleRef = useRef<HTMLButtonElement | null>(null);

  const closeNavigation = () => { setMenuOpen(false); setWorkOpen(false); };
  const focusWorkItem = (last = false) => {
    setWorkOpen(true);
    requestAnimationFrame(() => {
      const links = workRef.current?.querySelectorAll<HTMLAnchorElement>(".work-dropdown a");
      links?.[last ? links.length - 1 : 0]?.focus();
    });
  };

  useEffect(() => { setMenuOpen(false); setWorkOpen(false); }, [route]);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => { setMobile(query.matches); setMenuOpen(false); setWorkOpen(false); };
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!workOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!workRef.current?.contains(event.target as Node)) setWorkOpen(false);
    };
    window.addEventListener("pointerdown", dismiss);
    return () => window.removeEventListener("pointerdown", dismiss);
  }, [workOpen]);

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
      <a className="brand-mark" href="#home" aria-label={`${siteConfig.name} home`} onClick={closeNavigation}>
        <img src={assetUrl(siteConfig.logo)} width="1875" height="839" alt="Narkis" />
      </a>

      <button
        className={menuOpen ? "menu-toggle is-open" : "menu-toggle"}
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        onClick={() => { setMenuOpen((open) => !open); setWorkOpen(false); }}
      >
        <span />
        <span />
        <span />
      </button>

      <nav id="site-nav" className={menuOpen ? "nav-list is-open" : "nav-list"} inert={mobile && !menuOpen}>
        {navItems.map((item) => item.href === "#work" ? (
          <div key={item.href} className={`nav-work${workOpen ? " is-open" : ""}`} ref={workRef}
            onPointerLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) setWorkOpen(false); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setWorkOpen(false); }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && workOpen) {
                event.preventDefault(); event.stopPropagation(); setWorkOpen(false); workToggleRef.current?.focus();
              } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>(".work-dropdown a"));
                const index = links.indexOf(document.activeElement as HTMLAnchorElement);
                if (index < 0) focusWorkItem(event.key === "ArrowUp");
                else links[(index + (event.key === "ArrowDown" ? 1 : links.length - 1)) % links.length]?.focus();
              }
            }}>
            <a href={item.href} className={activeSection === "work" ? "is-active" : undefined}
              aria-current={activeSection === "work" ? "location" : undefined} onClick={closeNavigation}
              onPointerEnter={(event) => { if (event.pointerType === "mouse" && !mobile) setWorkOpen(true); }}>{item.label}</a>
            <button className="work-toggle" ref={workToggleRef} type="button" aria-label="Work categories"
              aria-expanded={workOpen} aria-controls="work-dropdown" onClick={() => setWorkOpen((open) => !open)}>
              <TbChevronDown aria-hidden="true" />
            </button>
            <ul id="work-dropdown" className="work-dropdown" aria-label="Work categories" hidden={!workOpen}>
              {categories.map((category) => <li key={category.href}><a href={category.href}
                aria-current={route === category.href.slice(1) || route.startsWith(`${category.href.slice(1)}-`) ? "page" : undefined}
                onClick={closeNavigation}>{category.title}</a></li>)}
            </ul>
          </div>
        ) : (
          <a
            key={item.href}
            href={item.href}
            className={activeSection === item.href.slice(1) ? "is-active" : undefined}
            aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
            onClick={closeNavigation}
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
