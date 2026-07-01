import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  arrowIcon as ArrowIcon,
  categories,
  navItems,
  processSteps,
  services,
  siteConfig,
  tools,
  values,
} from "./data/siteContent";

const HERO_FRAME_COUNT = 200;
const HERO_FRAME_SCROLL_FACTOR = 0.055;
const HERO_FRAME_EASE = 0.34;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const heroFrame = (index: number) =>
  `/assets/hero_frames/frame_${String(index + 1).padStart(3, "0")}.webp`;

function useRevealOnScroll() {
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
  }, []);
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="brand-mark" href="#home" aria-label={`${siteConfig.name} home`}>
        {siteConfig.initials}
      </a>

      <button
        className="menu-toggle"
        type="button"
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
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
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

function Hero() {
  const [frameIndex, setFrameIndex] = useState(0);
  const frameValueRef = useRef(0);
  const targetFrameRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastRenderedFrameRef = useRef(0);
  const touchYRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  const progress = frameIndex / (HERO_FRAME_COUNT - 1);
  const copyOpacity = clamp((progress - 0.78) / 0.12, 0, 1);
  const frameSrc = useMemo(() => heroFrame(frameIndex), [frameIndex]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = reducedMotion;
    if (reducedMotion) {
      frameValueRef.current = HERO_FRAME_COUNT - 1;
      targetFrameRef.current = HERO_FRAME_COUNT - 1;
      setFrameIndex(HERO_FRAME_COUNT - 1);
      return;
    }

    let cancelled = false;
    const priorityFrames = [0, 1, 2, 3, 4, 5, 8, 12, 18, 26, 36, 48, 64, 84, 108, 136, 166, 199];
    let preloadIndex = 0;

    const preloadFrame = (index: number) => {
      const image = new Image();
      image.decoding = "async";
      image.src = heroFrame(index);
    };

    priorityFrames.forEach(preloadFrame);

    const preloadNextFrame = () => {
      if (cancelled || preloadIndex >= HERO_FRAME_COUNT) return;
      preloadFrame(preloadIndex);
      preloadIndex += 1;

      const schedule = "requestIdleCallback" in window
        ? (callback: () => void) => window.requestIdleCallback(callback, { timeout: 400 })
        : (callback: () => void) => window.setTimeout(callback, 24);

      schedule(preloadNextFrame);
    };

    preloadNextFrame();

    return () => {
      cancelled = true;
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (reducedMotionRef.current) return;

    const maxFrame = HERO_FRAME_COUNT - 1;
    const atTop = () => window.scrollY <= 2;
    const renderFrame = (value: number) => {
      const rounded = Math.round(value);
      if (rounded === lastRenderedFrameRef.current) return;
      lastRenderedFrameRef.current = rounded;
      setFrameIndex(rounded);
    };

    const stepTowardTarget = () => {
      const current = frameValueRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.35) {
        frameValueRef.current = target;
        renderFrame(target);
        animationFrameRef.current = null;
        return;
      }

      const next = current + diff * HERO_FRAME_EASE;
      frameValueRef.current = next;
      renderFrame(next);
      animationFrameRef.current = window.requestAnimationFrame(stepTowardTarget);
    };

    const commitTargetFrame = (nextValue: number) => {
      targetFrameRef.current = clamp(nextValue, 0, maxFrame);
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(stepTowardTarget);
      }
    };

    const shouldCapture = (delta: number) => {
      if (!atTop() || Math.abs(delta) < 0.5) return false;
      if (delta > 0 && frameValueRef.current < maxFrame - 0.35) return true;
      if (delta < 0 && frameValueRef.current > 0.35) return true;
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (!shouldCapture(event.deltaY)) return;
      event.preventDefault();
      commitTargetFrame(targetFrameRef.current + event.deltaY * HERO_FRAME_SCROLL_FACTOR);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      const previousY = touchYRef.current;
      const currentY = event.touches[0]?.clientY ?? previousY;
      if (previousY === null || currentY === null) return;

      const delta = previousY - currentY;
      touchYRef.current = currentY;

      if (!shouldCapture(delta)) return;
      event.preventDefault();
      commitTargetFrame(targetFrameRef.current + delta * 0.12);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const forwardKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
      const backKeys = ["ArrowUp", "PageUp"];
      const isForward = forwardKeys.includes(event.key);
      const isBack = backKeys.includes(event.key);
      if (!isForward && !isBack) return;

      const delta = isForward ? 18 : -18;
      if (!shouldCapture(delta)) return;
      event.preventDefault();
      commitTargetFrame(targetFrameRef.current + delta);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleScrollCue = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (frameIndex < HERO_FRAME_COUNT - 1 && !reducedMotionRef.current) {
      event.preventDefault();
      frameValueRef.current = HERO_FRAME_COUNT - 1;
      targetFrameRef.current = HERO_FRAME_COUNT - 1;
      lastRenderedFrameRef.current = HERO_FRAME_COUNT - 1;
      setFrameIndex(HERO_FRAME_COUNT - 1);
      window.setTimeout(() => {
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
      }, 220);
    }
  };

  return (
    <section
      className={progress < 0.42 ? "hero-section is-sketch" : "hero-section"}
      id="home"
      aria-label="Portfolio introduction"
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
        <a className="scroll-cue" href="#work" aria-label="Scroll to work" onClick={handleScrollCue}>
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
                  alt=""
                  aria-hidden="true"
                />
                <span className={isVideo ? "gimbal-wrap" : "category-object-wrap"} aria-hidden="true">
                  <img
                    className={isVideo ? "gimbal-still" : "category-object"}
                    src={category.visual.object}
                    alt=""
                  />
                  {category.visual.objectHover ? (
                    <img
                      className={isVideo ? "gimbal-gif" : "category-object-hover"}
                      src={category.visual.objectHover}
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
  useRevealOnScroll();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <About />
        <Services />
        <Process />
        <Tools />
        <ValueStrip />
      </main>
    </>
  );
}
