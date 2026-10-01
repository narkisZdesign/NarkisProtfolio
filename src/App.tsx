import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CategoryCard } from "./components/CategoryCard";
import { Hero } from "./components/Hero";
import { ProductsPage } from "./components/ProductsPage";
import { BrandingPage } from "./components/BrandingPage";
import {
  arrowIcon as ArrowIcon,
  assetUrl,
  categories,
  navItems,
  processSteps,
  services,
  siteConfig,
  tools,
  values,
} from "./data/siteContent";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function useRevealOnScroll(dependency: string) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [dependency]);
}

function useHashRoute() {
  const getRoute = () => window.location.hash.replace("#", "") || "home";
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}

function Header({ isPackagingPage }: { isPackagingPage: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(isPackagingPage ? "work" : "home");
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isPackagingPage) {
      setActiveSection("work");
      return;
    }

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
  }, [isPackagingPage]);

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
        {siteConfig.initials}
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
        {siteConfig.ctaLabel}
      </a>
    </header>
  );
}

function ComparisonSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);

  const updatePosition = (clientX: number) => {
    const bounds = sliderRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const next = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(clamp(next, 8, 92));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setHasInteracted(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updatePosition(event.clientX);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      setHasInteracted(true);
      event.preventDefault();
      setPosition((value) => clamp(value - 4, 8, 92));
    }

    if (event.key === "ArrowRight") {
      setHasInteracted(true);
      event.preventDefault();
      setPosition((value) => clamp(value + 4, 8, 92));
    }
  };

  return (
    <div
      className={hasInteracted ? "comparison-slider" : "comparison-slider is-idle"}
      ref={sliderRef}
      role="slider"
      tabIndex={0}
      aria-label="Compare two packaging colorways"
      aria-valuemin={8}
      aria-valuemax={92}
      aria-valuenow={Math.round(position)}
      aria-valuetext={`${Math.round(position)} percent showing first image`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      style={{ "--slider-position": `${position}%` } as CSSProperties}
    >
      <span className="comparison-instruction" aria-hidden="true">Drag to compare</span>
      <span className="comparison-label comparison-label-before" aria-hidden="true">Desert Love</span>
      <span className="comparison-label comparison-label-after" aria-hidden="true">Ocean Secrets</span>
      <img className="comparison-image comparison-image-after" src={after} alt={afterAlt} />
      <div className="comparison-before">
        <img className="comparison-image" src={before} alt={beforeAlt} />
      </div>
      <span className="comparison-line" aria-hidden="true">
        <span className="comparison-handle">
          <ArrowIcon />
          <ArrowIcon />
        </span>
      </span>
    </div>
  );
}

const packagingSections = [
  { id: "packaging-overview", label: "Overview" },
  { id: "packaging-approach", label: "Approach" },
  { id: "packaging-in-store", label: "In store" },
  { id: "packaging-dieline", label: "Dieline" },
  { id: "packaging-bath", label: "Bath collection" },
];

const packagingStructuredData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Packaging Design for Minene",
  creator: {
    "@type": "Person",
    name: "Narkis Zur",
    jobTitle: "Graphic Designer",
  },
  about: "A packaging design system for developmental toys and bath toy collections.",
  genre: ["Packaging Design", "Graphic Design", "Brand Systems"],
  url: "https://narkiszdesign.github.io/NarkisProtfolio/#packaging",
  image:
    "https://narkiszdesign.github.io/NarkisProtfolio/assets/packaging/Blue_Store_Development_matt.png",
};

function PackagingProjectNav() {
  const [activeSection, setActiveSection] = useState(packagingSections[0].id);

  useEffect(() => {
    const sections = packagingSections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="project-nav" aria-label="Packaging project sections">
      <div className="project-nav-inner">
        <a className="project-nav-back" href="#work">&larr; Projects</a>
        <div className="project-nav-links">
          {packagingSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={activeSection === section.id ? "is-active" : undefined}
              aria-current={activeSection === section.id ? "location" : undefined}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

const fashionSelectedGarments = [
  { src: "assets/fashion/selected-01.png", alt: "Boy wearing a charcoal sleeveless Maybe Later set" },
  { src: "assets/fashion/selected-02.png", alt: "Girl wearing a Berry Sweet graphic T-shirt" },
  { src: "assets/fashion/selected-03.png", alt: "Child wearing an Easy Peasy lemon graphic T-shirt" },
  { src: "assets/fashion/selected-04.png", alt: "Boy wearing a Champion sports set" },
  { src: "assets/fashion/selected-05.png", alt: "Boy wearing a white sleeveless graphic set" },
];

const fashionProcess = [
  {
    icon: "assets/fashion/process-direction-icon.png",
    title: "Concept & Direction",
    description: "Building the visual concept and collection language.",
  },
  {
    icon: "assets/fashion/process-apparel-icon.png",
    title: "Apparel Design",
    description: "Developing garment design, graphics and print placements together.",
  },
  {
    icon: "assets/fashion/process-technical-icon.png",
    title: "Technical Development",
    description: "Preparing tech packs, measurements and production files.",
  },
  {
    icon: "assets/fashion/process-finishing-icon.png",
    title: "Finishing Details",
    description: "Labels, trims, fabrics and final touches that complete the product.",
  },
];

const fashionSketchSteps = [
  { src: "assets/fashion/sketch-01.png", alt: "Initial hand-drawn lettering sketch" },
  { src: "assets/fashion/sketch-02.png", alt: "Digital lettering artwork development" },
  { src: "assets/fashion/sketch-03.png", alt: "Graphic applied to a black sleeveless top" },
  { src: "assets/fashion/sketch-04.png", alt: "Graphic applied to a black T-shirt" },
  { src: "assets/fashion/sketch-05.png", alt: "Finished garment worn by a child" },
];

function FashionPage() {
  return (
    <main className="fashion-page">
      <div className="fashion-stage">
        <section className="fashion-intro" aria-labelledby="fashion-title">
          <div className="fashion-intro-copy">
            <h1 id="fashion-title">Fashion</h1>
            <p>Thoughtful apparel graphics from<br />concept to garment</p>
            <a href="#home">&lt;&lt; Go back for more procjects</a>
            <div className="fashion-intro-values" aria-label="Fashion services">
              <span><img src={assetUrl("assets/fashion/intro-garment-icon.png")} alt="" />Garment<br />Design</span>
              <span><img src={assetUrl("assets/fashion/intro-print-icon.png")} alt="" />Print &amp;<br />Graphics</span>
              <span><img src={assetUrl("assets/fashion/intro-production-icon.png")} alt="" />Production<br />Ready</span>
            </div>
          </div>
          <div className="fashion-intro-art" aria-hidden="true">
            <img className="fashion-intro-sketch" src={assetUrl("assets/fashion/intro-sketch.png")} alt="" />
            <img className="fashion-intro-shirt" src={assetUrl("assets/fashion/intro-shirt.png")} alt="" />
          </div>
        </section>

        <section className="fashion-overview" aria-labelledby="fashion-overview-title">
          <video
            className="fashion-overview-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={assetUrl("assets/fashion/hero-main.png")}
            aria-hidden="true"
          >
            <source src={assetUrl("assets/fashion/garment-concept-production.mp4")} type="video/mp4" />
          </video>
          <div className="fashion-overview-copy">
            <h2 id="fashion-overview-title">Garment Design From<br />Concept To Production</h2>
            <h3>Line Bar Zomer<br />By Minene</h3>
            <span aria-hidden="true" />
            <p>A fashion graphics project developed across multiple garments, combining typography, illustration, print placement and product development. Every design was created to work as part of a unified collection while considering materials, construction and production.</p>
          </div>
          <div className="fashion-process-grid">
            {fashionProcess.map((step) => (
              <article key={step.title}>
                <img src={assetUrl(step.icon)} alt="" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fashion-selected" aria-labelledby="fashion-selected-title">
          <h2 id="fashion-selected-title">Selected Garments Projects</h2>
          <p>A selection of apparel collections developed from concept to production</p>
          <div className="fashion-selected-grid">
            {fashionSelectedGarments.map((garment, index) => (
              <figure className="fashion-selected-card" key={garment.src} tabIndex={0}>
                <img src={assetUrl(garment.src)} alt={garment.alt} />
                <span className="fashion-hover-placeholder" aria-hidden="true">
                  Alternate image<br />placeholder {String(index + 1).padStart(2, "0")}
                </span>
              </figure>
            ))}
          </div>
        </section>

        <section className="fashion-sketch" aria-labelledby="fashion-sketch-title">
          <h2 id="fashion-sketch-title">From The First Sketch To The Finished Garment</h2>
          <div className="fashion-sketch-grid">
            {fashionSketchSteps.map((step, index) => (
              <article key={step.src}>
                <div className="fashion-sketch-image"><img src={assetUrl(step.src)} alt={step.alt} /></div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>Collection consistency</h3>
                <p>A unified visual language across all four sets.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fashion-more" aria-labelledby="fashion-more-title">
          <div className="fashion-more-images">
            {["more-01.png", "more-02.png", "more-03.png", "more-04.png"].map((name, index) => (
              <img key={name} src={assetUrl(`assets/fashion/${name}`)} alt={`Additional garment graphic design ${index + 1}`} />
            ))}
          </div>
          <div>
            <h2 id="fashion-more-title">More Designs</h2>
            <p>A selection of additional graphics developed across different collections, each tailored to its own story while maintaining a consistent brand language.</p>
          </div>
        </section>

        <section className="fashion-embroidery" aria-labelledby="fashion-embroidery-title">
          <div className="fashion-section-copy">
            <h2 id="fashion-embroidery-title">Embroidery<br />Development</h2>
            <h3>From Sketch<br />To Stitch</h3>
            <span aria-hidden="true" />
            <p>Embroidery graphics developed from initial sketches to production-ready artwork. Each design was refined with careful attention to composition, stitch feasibility, placement, and garment application.</p>
          </div>
          <div className="fashion-embroidery-images">
            {["embroidery-01.png", "embroidery-02.png", "embroidery-03.png"].map((name, index) => (
              <img key={name} src={assetUrl(`assets/fashion/${name}`)} alt={`Embroidery development stage ${index + 1}`} />
            ))}
          </div>
        </section>

        <section className="fashion-details-title">
          <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
            <source src={assetUrl("assets/fashion/design-details.mp4")} type="video/mp4" />
          </video>
          <h2>Design Is In The Details</h2>
        </section>

        <section className="fashion-tags" aria-labelledby="fashion-tags-title">
          <div className="fashion-tags-images">
            {["tags-card-01.png", "tags-card-02.png", "tags-card-03.png"].map((name, index) => (
              <img key={name} src={assetUrl(`assets/fashion/${name}`)} alt={`Fashion tag and label design ${index + 1}`} />
            ))}
          </div>
          <div className="fashion-section-copy fashion-tags-copy">
            <h2 id="fashion-tags-title">Fashion Tags &amp;<br />Label Design</h2>
            <h3>Completing The<br />Product Experience</h3>
            <span aria-hidden="true" />
            <p>The product experience doesn&apos;t end with the garment itself. Hang tags, woven labels and finishing details strengthen the collection and create a complete, premium presentation.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PackagingPage() {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxImage(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxImage]);

  const openLightbox = (target: EventTarget | null) => {
    const image = (target as HTMLElement | null)?.closest<HTMLImageElement>("img[data-lightbox]");
    if (!image) return;
    setLightboxImage({ src: image.currentSrc || image.src, alt: image.alt || "Packaging project detail" });
  };

  const handleProjectKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const image = (event.target as HTMLElement).closest<HTMLImageElement>("img[data-lightbox]");
    if (!image) return;
    event.preventDefault();
    openLightbox(image);
  };

  return (
    <main
      className="packaging-page page-enter"
      onClick={(event) => openLightbox(event.target)}
      onKeyDown={handleProjectKeyDown}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packagingStructuredData) }}
      />
      <PackagingProjectNav />
      <section className="packaging-intro" aria-labelledby="packaging-title">
        <div className="packaging-intro-copy" data-reveal>
          <h1 id="packaging-title">Packaging</h1>
          <p>From dielines to final mockups –<br />Packaging built with purpose</p>
          <a className="packaging-back" href="#work">&larr; Back to projects</a>
          <div className="packaging-values" aria-label="Packaging services">
            <span><img src={assetUrl("assets/packaging/Artboard 1.jpg")} alt="" aria-hidden="true" />Creative<br />Solutions</span>
            <span><img src={assetUrl("assets/packaging/Artboard 2.jpg")} alt="" aria-hidden="true" />Sustainable<br />Thinking</span>
            <span><img src={assetUrl("assets/packaging/Artboard 3.jpg")} alt="" aria-hidden="true" />Brand-Focused<br />Design</span>
          </div>
        </div>
        <div className="packaging-intro-art" data-reveal>
          <img className="intro-dieline" src={assetUrl("assets/packaging/box_icon_layout.png")} alt="Packaging dieline" />
          <img className="intro-box" src={assetUrl("assets/packaging/box_icon_cutout.png")} alt="Open blue packaging box" />
        </div>
      </section>

      <article className="packaging-case">
        <section className="case-overview packaging-container" id="packaging-overview">
          <div className="case-pair" data-reveal>
            <ComparisonSlider
              before={assetUrl("assets/packaging/Pink_Store_Development_matt.png")}
              after={assetUrl("assets/packaging/Blue_Store_Development_matt.png")}
              beforeAlt="Desert Love activity gym packaging"
              afterAlt="Ocean Secrets activity gym packaging"
            />
          </div>
          <div className="case-copy" data-reveal>
            <h2>Packaging design<br />for a developmental<br />toys line</h2>
            <h3>Desert Love &amp; Ocean Secrets<br />by Minene</h3>
            <p>A packaging design system for a developmental toys line, featuring a variety of products including baby activity gyms, soft activity books, hanging toys, activity cubes, and more.<br />The project focused on creating a consistent and recognizable visual language across the collection, while adapting each package to the product&apos;s size, structure, retail placement, and key developmental benefits.</p>
            <dl className="project-facts" aria-label="Project details">
              <div><dt>Client</dt><dd>Minene</dd></div>
              <div><dt>Role</dt><dd>Packaging design</dd></div>
              <div><dt>Scope</dt><dd>Visual system &amp; production</dd></div>
            </dl>
          </div>
        </section>

        <section className="design-approach packaging-container" id="packaging-approach" aria-labelledby="design-approach-title" data-reveal>
          <h2 id="design-approach-title">The design approach</h2>
          <div className="approach-grid">
            <article className="approach-item"><img src={assetUrl("assets/packaging/Artboard 7.jpg")} loading="lazy" decoding="async" alt="" aria-hidden="true" /><h3>Inspired by nature</h3><p>Desert &amp; Ocean worlds brought to life in soft, neutral tones.</p></article>
            <article className="approach-item"><img src={assetUrl("assets/packaging/Artboard 8.png")} loading="lazy" decoding="async" alt="" aria-hidden="true" /><h3>Development first</h3><p>Packaging communicates the product&apos;s benefits and activities clearly.</p></article>
            <article className="approach-item"><img src={assetUrl("assets/packaging/Artboard 9.png")} loading="lazy" decoding="async" alt="" aria-hidden="true" /><h3>Gentle &amp; modern</h3><p>A calm, minimal visual language that feels warm and trustworthy.</p></article>
            <article className="approach-item"><img src={assetUrl("assets/packaging/Artboard 10.png")} loading="lazy" decoding="async" alt="" aria-hidden="true" /><h3>Shelf impact</h3><p>Clean structure, large window &amp; clear hierarchy for retail presence.</p></article>
          </div>
        </section>

        <section className="collection-row packaging-container" id="packaging-in-store">
          <div className="collection-images" data-reveal>
            <img src={assetUrl("assets/packaging/Developmental_cube_toy.png")} loading="lazy" decoding="async" alt="Developmental activity cube packaging" data-lightbox tabIndex={0} role="button" aria-label="View developmental activity cube packaging larger" />
            <img src={assetUrl("assets/packaging/Hanging_Development_matt.png")} loading="lazy" decoding="async" alt="Hanging developmental toy packaging" data-lightbox tabIndex={0} role="button" aria-label="View hanging developmental toy packaging larger" />
            <img src={assetUrl("assets/packaging/Developmental_book_toy.png")} loading="lazy" decoding="async" alt="Developmental activity book packaging" data-lightbox tabIndex={0} role="button" aria-label="View developmental activity book packaging larger" />
          </div>
          <div className="collection-note" data-reveal><h2>In store</h2><p>Consistent line look that stands out on the shelf and communicates quality, trust and care.</p></div>
        </section>

        <section className="dieline-panel packaging-container" id="packaging-dieline" data-reveal>
          <div><h2>Dieline &amp; layout</h2><p>Complete packaging dieline and print layout.</p><img src={assetUrl("assets/packaging/פריסה והוראות-01.jpg")} loading="lazy" decoding="async" alt="Packaging dieline and print layout" data-lightbox tabIndex={0} role="button" aria-label="View packaging dieline and print layout larger" /></div>
          <div><h2>Step-by-step</h2><p>Packing &amp; Assembly Instructions</p><img src={assetUrl("assets/packaging/פריסה והוראות-02.jpg")} loading="lazy" decoding="async" alt="Packaging assembly instructions" data-lightbox tabIndex={0} role="button" aria-label="View packaging assembly instructions larger" /></div>
        </section>

        <section className="bath-case packaging-container" id="packaging-bath">
          <div className="bath-copy" data-reveal>
            <h2>Packaging design for bath<br />toys sets collection</h2>
            <h3>4-Piece Bath Toy Line<br />By Minene</h3>
            <p>The visual language combines illustration, product-part photography, and themed atmosphere to create a playful yet clear packaging system. Each pack explains the set content and assembly visually, while maintaining the brand&apos;s soft color palette and adding an engaging, playful twist.</p>
          </div>
          <div className="bath-back" data-reveal><img className="bath-back-icon" src={assetUrl("assets/packaging/back of pack icon .png")} loading="lazy" decoding="async" alt="" aria-hidden="true" /><h3>Back of Pack</h3><p>Parent-friendly information explains the product benefits, how the pieces work together, and how to play with the set in a clear and visually engaging way.</p><img className="bath-back-image" src={assetUrl("assets/packaging/ChatGPT Image Jul 1, 2026, 12_14_29 PM.png")} loading="lazy" decoding="async" alt="Packaging back panel" data-lightbox tabIndex={0} role="button" aria-label="View packaging back panel larger" /></div>
          <img className="bath-main-image" src={assetUrl("assets/packaging/4 packaging bath toys sets.png")} loading="lazy" decoding="async" alt="Bath toy packaging collection" data-reveal data-lightbox tabIndex={0} role="button" aria-label="View bath toy packaging collection larger" />
        </section>

        <section className="bath-footer packaging-container">
          <div><h2>System highlights</h2><div className="highlights"><article><h3>Shelf-friendly<br />hierarchy</h3><p>Clear structure for strong retail visibility.</p></article><article><h3>Easy product<br />understanding</h3><p>Clear visuals help communicate the content.</p></article><article><h3>Collection<br />consistency</h3><p>A unified visual language across all four sets.</p></article></div></div>
          <div className="how-it-works"><h2>How it works</h2><div><span><img src={assetUrl("assets/packaging/otter1.png")} loading="lazy" decoding="async" alt="Unbox" /><b>Unbox</b></span><span><img src={assetUrl("assets/packaging/otter2.png")} loading="lazy" decoding="async" alt="Connect" /><b>Connect</b></span><span><img src={assetUrl("assets/packaging/otter3.png")} loading="lazy" decoding="async" alt="Play" /><b>Play</b></span></div></div>
        </section>
        <footer className="project-end" id="packaging-end" data-reveal>
          <p>Have a packaging project in mind?</p>
          <h2>Let&apos;s create something thoughtful.</h2>
          <ul className="project-contact-details" aria-label="Collaboration details">
            <li>Packaging, brand systems &amp; print-ready production</li>
            <li>Remote collaboration welcome</li>
            <li>Personal reply within 2 business days</li>
          </ul>
          <div>
            <a className="project-end-secondary" href="#work">Explore more work</a>
            <a className="project-end-secondary" href={`mailto:${siteConfig.email}`}>Email Narkis</a>
            <a className="peach-button" href={siteConfig.contactUrl} target="_blank" rel="noreferrer">Start a project <ArrowIcon /></a>
          </div>
        </footer>
      </article>
      {lightboxImage ? (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded view: ${lightboxImage.alt}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxImage(null);
          }}
        >
          <button
            className="image-lightbox-close"
            type="button"
            aria-label="Close expanded image"
            onClick={() => setLightboxImage(null)}
            autoFocus
          >
            ×
          </button>
          <figure>
            <img src={lightboxImage.src} alt={lightboxImage.alt} />
            <figcaption>{lightboxImage.alt}</figcaption>
          </figure>
        </div>
      ) : null}
    </main>
  );
}

function Categories() {
  return (
    <section className="section categories-section" id="work" aria-labelledby="work-title">
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="category-media-filters">
        <defs>
          <filter id="product-remove-background" colorInterpolationFilters="sRGB" x="-15%" y="-15%" width="130%" height="130%">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -6 -6 -6 0 15.5" result="keyed" />
            <feComposite in="keyed" in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="category-remove-white" colorInterpolationFilters="sRGB" x="-15%" y="-15%" width="130%" height="130%">
            {/* Key the near-white backdrop while keeping the colored object opaque. */}
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -5 -5 -5 0 14" result="keyed" />
            <feComposite in="keyed" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>
      <div className="section-heading" data-reveal>
        <span>What I do</span>
        <h2 id="work-title">Design across disciplines.</h2>
        <p>From concept to completion.</p>
      </div>

      <div className="category-grid">
        {categories.map((category, index) => (
          <CategoryCard key={category.title} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="about-copy" data-reveal>
        <h2 id="about-title">About Me</h2>
        <p className="about-lead">
          {siteConfig.aboutHeadline.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <p>
          Hi, I&apos;m Narkis. I&apos;m a multidisciplinary graphic designer with a passion for
          clear aesthetics, smart solutions, and visual storytelling.
        </p>
        <p>
          I turn ideas into thoughtful designs that connect, communicate, and leave a lasting
          impression.
        </p>
        <p>I help brands and businesses communicate with clarity, beauty, and purpose.</p>
        <a className="peach-button" href="#work">
          {siteConfig.workLabel}
          <ArrowIcon />
        </a>
      </div>

      <div
        className="about-visual"
        data-reveal
        role="img"
        aria-label="Narkis Zur avatar with notebook and color palette"
        style={{ backgroundImage: `url(${assetUrl("assets/about_me.png")})` }}
      />
    </section>
  );
}

function Services() {
  return (
    <section className="panel-section" id="services" aria-labelledby="services-title" data-reveal>
      <div className="panel-heading">
        <span />
        <h2 id="services-title">What I do best</h2>
        <span />
      </div>
      <div className="service-grid">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <article className="service-item" key={service.title}>
              <Icon aria-hidden="true" />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="panel-section process-panel" id="process" aria-labelledby="process-title" data-reveal>
      <div className="process-intro">
        <span>My process</span>
        <h2 id="process-title">A thoughtful process</h2>
        <p>from idea to impact.</p>
      </div>
      <div className="process-steps">
        {processSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article className="process-step" key={step.number}>
              <Icon aria-hidden="true" />
              <strong>
                {step.number}. {step.title}
              </strong>
              <p>{step.description}</p>
              {index < processSteps.length - 1 ? (
                <span className="step-arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Tools() {
  return (
    <section className="panel-section tools-panel" aria-labelledby="tools-title" data-reveal>
      <h2 id="tools-title">Tools I use</h2>
      <div className="tool-list">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <span className={`tool-icon ${tool.className}`} key={tool.label} title={tool.label}>
              <Icon aria-label={tool.label} />
            </span>
          );
        })}
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <footer className="value-strip" id="contact">
      <div className="value-grid">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <article className="value-item" key={value.title}>
              <span>
                <Icon aria-hidden="true" />
              </span>
              <div>
                <h2>{value.title}</h2>
                <p>{value.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </footer>
  );
}

export function App() {
  const route = useHashRoute();
  const isPackagingPage = route === "packaging" || route.startsWith("packaging-");
  const isFashionPage = route === "fashion" || route.startsWith("fashion-");
  const isProductsPage = route === "products" || route.startsWith("products-");
  const isBrandingPage = route === "branding" || route.startsWith("branding-");
  useRevealOnScroll(route);

  useEffect(() => {
    const title = isBrandingPage
      ? "Branding Portfolio | Narkis Zur"
      : isPackagingPage
      ? "Packaging Design Portfolio | Narkis Zur"
      : isFashionPage
        ? "Fashion Design Portfolio | Narkis Zur"
      : isProductsPage
        ? "Product & Brand Experiences Portfolio | Narkis Zur"
      : "Narkis Zur | Graphic Designer";
    const description = isBrandingPage
      ? "Brand identities and visual worlds by Narkis Zur: HaShunit’s interactive underwater learning experience and Makbilim Time-Travel Academy."
      : isPackagingPage
      ? "Packaging design case studies by Narkis Zur, from brand-focused visual systems and retail packaging to dielines and print-ready production."
      : isFashionPage
        ? "Fashion and apparel design projects by Narkis Zur, developed from concept and graphics through production-ready garments."
      : isProductsPage
        ? "Showroom props, branded signage, large-scale displays and store launch experiences designed by Narkis Zur."
      : "Narkis Zur is a multidisciplinary graphic designer creating thoughtful visual systems, packaging, branding, illustration, motion, and web experiences.";
    const url = isBrandingPage
      ? "https://narkiszdesign.github.io/NarkisProtfolio/#branding"
      : isPackagingPage
      ? "https://narkiszdesign.github.io/NarkisProtfolio/#packaging"
      : isFashionPage
        ? "https://narkiszdesign.github.io/NarkisProtfolio/#fashion"
      : isProductsPage
        ? "https://narkiszdesign.github.io/NarkisProtfolio/#products"
      : "https://narkiszdesign.github.io/NarkisProtfolio/#home";
    const image = isBrandingPage
      ? "https://narkiszdesign.github.io/NarkisProtfolio/assets/branding/f322d.png"
      : isPackagingPage
      ? "https://narkiszdesign.github.io/NarkisProtfolio/assets/packaging/Blue_Store_Development_matt.png"
      : isFashionPage
        ? "https://narkiszdesign.github.io/NarkisProtfolio/assets/fashion/selected-01.png"
      : isProductsPage
        ? "https://narkiszdesign.github.io/NarkisProtfolio/assets/products/4a90f.png"
      : "https://narkiszdesign.github.io/NarkisProtfolio/assets/hero.jpg";

    const upsertMeta = (attribute: "name" | "property", key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [isBrandingPage, isFashionPage, isPackagingPage, isProductsPage]);

  useEffect(() => {
    if (isPackagingPage || isFashionPage || isProductsPage || isBrandingPage) {
      if (route === "packaging" || route === "fashion" || route === "products" || route === "branding") {
        window.scrollTo({ top: 0, left: 0, behavior: isProductsPage || isBrandingPage ? "instant" : "auto" });
      } else if (isBrandingPage) {
        document.getElementById(route)?.scrollIntoView({ behavior: "auto", block: "start" });
      }
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (route === "home") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }
      const target = document.getElementById(route);
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isBrandingPage, isFashionPage, isPackagingPage, isProductsPage, route]);

  return (
    <>
      <Header isPackagingPage={isPackagingPage || isFashionPage || isProductsPage || isBrandingPage} />
      {isPackagingPage ? (
        <PackagingPage />
      ) : isFashionPage ? (
        <FashionPage />
      ) : isProductsPage ? (
        <ProductsPage />
      ) : isBrandingPage ? (
        <BrandingPage />
      ) : (
        <main className="home-page page-enter">
          <Hero />
          <Categories />
          <About />
          <Services />
          <Process />
          <Tools />
          <ValueStrip />
        </main>
      )}
    </>
  );
}
