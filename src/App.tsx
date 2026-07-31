import { useEffect, useRef, useState, type CSSProperties } from "react";
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

const HERO_FRAME_COUNT = 200;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const heroFrame = (index: number) =>
  assetUrl(`assets/hero_frames/frame_${String(index + 1).padStart(3, "0")}.webp`);

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
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function PackagingPage() {
  return (
    <main className="packaging-page page-enter">
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
            <img src={assetUrl("assets/packaging/Developmental_cube_toy.png")} loading="lazy" decoding="async" alt="Developmental activity cube packaging" />
            <img src={assetUrl("assets/packaging/Hanging_Development_matt.png")} loading="lazy" decoding="async" alt="Hanging developmental toy packaging" />
            <img src={assetUrl("assets/packaging/Developmental_book_toy.png")} loading="lazy" decoding="async" alt="Developmental activity book packaging" />
          </div>
          <div className="collection-note" data-reveal><h2>In store</h2><p>Consistent line look that stands out on the shelf and communicates quality, trust and care.</p></div>
        </section>

        <section className="dieline-panel packaging-container" id="packaging-dieline" data-reveal>
          <div><h2>Dieline &amp; layout</h2><p>Complete packaging dieline and print layout.</p><img src={assetUrl("assets/packaging/פריסה והוראות-01.jpg")} loading="lazy" decoding="async" alt="Packaging dieline and print layout" /></div>
          <div><h2>Step-by-step</h2><p>Packing &amp; Assembly Instructions</p><img src={assetUrl("assets/packaging/פריסה והוראות-02.jpg")} loading="lazy" decoding="async" alt="Packaging assembly instructions" /></div>
        </section>

        <section className="bath-case packaging-container" id="packaging-bath">
          <div className="bath-copy" data-reveal>
            <h2>Packaging design for bath<br />toys sets collection</h2>
            <h3>4-Piece Bath Toy Line<br />By Minene</h3>
            <p>The visual language combines illustration, product-part photography, and themed atmosphere to create a playful yet clear packaging system. Each pack explains the set content and assembly visually, while maintaining the brand&apos;s soft color palette and adding an engaging, playful twist.</p>
          </div>
          <div className="bath-back" data-reveal><img className="bath-back-icon" src={assetUrl("assets/packaging/back of pack icon .png")} loading="lazy" decoding="async" alt="" aria-hidden="true" /><h3>Back of Pack</h3><p>Parent-friendly information explains the product benefits, how the pieces work together, and how to play with the set in a clear and visually engaging way.</p><img className="bath-back-image" src={assetUrl("assets/packaging/ChatGPT Image Jul 1, 2026, 12_14_29 PM.png")} loading="lazy" decoding="async" alt="Packaging back panel" /></div>
          <img className="bath-main-image" src={assetUrl("assets/packaging/4 packaging bath toys sets.png")} loading="lazy" decoding="async" alt="Bath toy packaging collection" data-reveal />
        </section>

        <section className="bath-footer packaging-container">
          <div><h2>System highlights</h2><div className="highlights"><article><h3>Shelf-friendly<br />hierarchy</h3><p>Clear structure for strong retail visibility.</p></article><article><h3>Easy product<br />understanding</h3><p>Clear visuals help communicate the content.</p></article><article><h3>Collection<br />consistency</h3><p>A unified visual language across all four sets.</p></article></div></div>
          <div className="how-it-works"><h2>How it works</h2><div><span><img src={assetUrl("assets/packaging/otter1.png")} loading="lazy" decoding="async" alt="Unbox" /><b>Unbox</b></span><span><img src={assetUrl("assets/packaging/otter2.png")} loading="lazy" decoding="async" alt="Connect" /><b>Connect</b></span><span><img src={assetUrl("assets/packaging/otter3.png")} loading="lazy" decoding="async" alt="Play" /><b>Play</b></span></div></div>
        </section>
        <footer className="project-end" id="packaging-end" data-reveal>
          <p>Have a packaging project in mind?</p>
          <h2>Let&apos;s create something thoughtful.</h2>
          <div>
            <a className="project-end-secondary" href="#work">Explore more work</a>
            <a className="peach-button" href={siteConfig.contactUrl} target="_blank" rel="noreferrer">Start a project <ArrowIcon /></a>
          </div>
        </footer>
      </article>
    </main>
  );
}

function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const preloadedFramesRef = useRef(new Set<number>());

  const progress = frameIndex / (HERO_FRAME_COUNT - 1);
  const copyOpacity = clamp((progress - 0.78) / 0.12, 0, 1);
  const frameSrc = heroFrame(frameIndex);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = reducedMotion;
    if (reducedMotion) {
      setFrameIndex(HERO_FRAME_COUNT - 1);
      return;
    }

    const preloadFrame = (index: number) => {
      if (preloadedFramesRef.current.has(index)) return;
      preloadedFramesRef.current.add(index);
      const image = new Image();
      image.decoding = "async";
      image.src = heroFrame(index);
    };

    [0, 1, 2, 4, 8, 16, 32, 56, 84, 116, 150, 176, 199].forEach(preloadFrame);
  }, []);

  useEffect(() => {
    if (reducedMotionRef.current) return;

    const maxFrame = HERO_FRAME_COUNT - 1;
    const updateFromScroll = () => {
      animationFrameRef.current = null;
      const section = sectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = clamp(-bounds.top / scrollRange, 0, 1);
      setFrameIndex(Math.round(nextProgress * maxFrame));
    };

    const onScroll = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(updateFromScroll);
      }
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (reducedMotionRef.current) return;
    for (const offset of [-2, -1, 1, 2, 4, 8]) {
      const index = clamp(frameIndex + offset, 0, HERO_FRAME_COUNT - 1);
      if (preloadedFramesRef.current.has(index)) continue;
      preloadedFramesRef.current.add(index);
      const image = new Image();
      image.decoding = "async";
      image.src = heroFrame(index);
    }
  }, [frameIndex]);

  return (
    <section
      className={progress < 0.42 ? "hero-section is-sketch" : "hero-section"}
      id="home"
      aria-label="Portfolio introduction"
      ref={sectionRef}
    >
      <div className="hero-image-wrap" style={{ "--intro-progress": progress } as CSSProperties}>
        <img
          className="hero-frame"
          src={frameSrc}
          alt="Graphic designer studio scene transitioning from sketch to polished design"
        />
        <div className="hero-copy" style={{ opacity: copyOpacity }}>
          <h1>{siteConfig.heroTitle}</h1>
          <p className="hero-subtitle">{siteConfig.heroSubtitle}</p>
          <p>{siteConfig.heroBody}</p>
        </div>
        <span className="hero-progress" aria-hidden="true">
          <span>Scroll to reveal</span>
          <i><b style={{ transform: `scaleX(${progress})` }} /></i>
        </span>
        <a className="scroll-cue" href="#work" aria-label="Skip animation and view work">
          <span />
        </a>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="section categories-section" id="work" aria-labelledby="work-title">
      <div className="section-heading" data-reveal>
        <span>What I do</span>
        <h2 id="work-title">Design across disciplines.</h2>
        <p>From concept to completion.</p>
      </div>

      <div className="category-grid">
        {categories.map((category, index) => {
          const isVideo = category.variant === "video";

          return (
            <a
              className={`category-card category-card-featured ${isVideo ? "video-category-card" : "asset-category-card"}`}
              href={category.href}
              key={category.title}
              data-reveal
              style={{ "--delay": `${index * 60}ms` } as CSSProperties}
            >
              <span className={isVideo ? "video-card-visual" : "asset-card-visual"}>
                <img
                  className={isVideo ? "video-wireframe" : "category-background"}
                  src={category.visual.background}
                  loading="lazy"
                  decoding="async"
                  alt=""
                  aria-hidden="true"
                />
                <span className={isVideo ? "gimbal-wrap" : "category-object-wrap"} aria-hidden="true">
                  <img
                    className={isVideo ? "gimbal-still" : "category-object"}
                    src={category.visual.object}
                    loading="lazy"
                    decoding="async"
                    alt=""
                  />
                  {category.visual.objectHover ? (
                    <img
                      className={isVideo ? "gimbal-gif" : "category-object-hover"}
                      src={category.visual.objectHover}
                      loading="lazy"
                      decoding="async"
                      alt=""
                    />
                  ) : null}
                </span>
                <strong>{category.title}</strong>
                <span className="round-arrow video-visual-arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </span>
            </a>
          );
        })}
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
  useRevealOnScroll(route);

  useEffect(() => {
    if (isPackagingPage) {
      if (route === "packaging") window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(route);
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isPackagingPage, route]);

  return (
    <>
      <Header isPackagingPage={isPackagingPage} />
      {isPackagingPage ? (
        <PackagingPage />
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
