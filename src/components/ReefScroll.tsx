import { useEffect, useRef, type CSSProperties } from "react";
import { brandingAsset, digitalArtwork, interfaceArtwork, printArtwork, reefFeatures, type ReefArtwork } from "../data/brandingContent";

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ramp = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
const smooth = (n: number) => n * n * (3 - 2 * n);
// Interpolating scale in log space makes forward travel feel even at large zooms.
const zoom = (from: number, to: number, progress: number) => Math.exp(Math.log(from) + (Math.log(to) - Math.log(from)) * smooth(progress));
const chapterWindow = (p: number, start: number, end: number) => Math.min(ramp(p, start, start + .025), 1 - ramp(p, end - .025, end));

function placement(art: ReefArtwork): CSSProperties {
  return { left: art.x, top: art.y, width: art.w, height: art.h, "--art-rotation": `${art.rotation ?? 0}deg` } as CSSProperties;
}

function Artwork({ art, order }: { art: ReefArtwork; order?: number }) {
  return <figure className="reef-art" style={placement(art)} data-node-id={art.id} data-enter={order}>
    <img src={brandingAsset(art.file)} alt={art.alt} decoding="async" />
  </figure>;
}

export function BrandingFeatures({ features, animated = false }: { features: { title: string; description: string; icon: string; crop?: boolean; overlay?: string }[]; animated?: boolean }) {
  return <div className="branding-features">{features.map((feature, i) => <article className="branding-feature" key={feature.title} data-enter={animated ? i + 3 : undefined}>
    <div className={`branding-feature-icon ${"crop" in feature && feature.crop ? "is-cropped" : ""}`}>
      <img src={brandingAsset(feature.icon)} alt="" decoding="async" />
      {feature.overlay && <img src={brandingAsset(feature.overlay)} alt="" decoding="async" />}
    </div>
    <h3>{feature.title}</h3><p>{feature.description}</p>
  </article>)}</div>;
}

function InterfacePanel() {
  return <figure className="reef-interface reef-art" data-enter="3" data-node-id="1:28">
    <div className="reef-interface-canvas">
    <img className="reef-interface-bg" src={brandingAsset("f8c90.svg")} alt="" />
    <figcaption dir="rtl"><strong>שפת ממשק</strong><span>אלמנטים עיצוביים נוספים מתוך האתר</span></figcaption>
    {interfaceArtwork.map(art => <Artwork key={art.id} art={art} />)}
    </div>
  </figure>;
}

/** A native-scroll timeline. Paints DOM styles without React renders on scroll. */
export function ReefScroll() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const stage = root.querySelector<HTMLElement>(".reef-stage")!;
    const header = document.querySelector<HTMLElement>(".site-header");
    const next = document.getElementById("branding-makbilim")!;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMedia = window.matchMedia("(max-width: 760px)");
    const chapters = Array.from(root.querySelectorAll<HTMLElement>(".reef-chapter"));
    const boards = chapters.map(chapter => chapter.querySelector<HTMLElement>(".reef-board")!);
    const entries = chapters.map(chapter => Array.from(chapter.querySelectorAll<HTMLElement>("[data-enter]")));
    let frame = 0;
    let stageHeight = 1;
    let headerHeight = 0;
    let overflow = [0, 0, 0];
    let displayedProgress = Number.NaN;
    let lastTime = 0;

    const measure = () => {
      headerHeight = header?.offsetHeight ?? 0;
      stageHeight = Math.max(1, window.innerHeight - headerHeight);
      root.style.setProperty("--reef-top", `${headerHeight}px`);
      root.style.setProperty("--reef-height", `${stageHeight}px`);
      const scale = Math.min(window.innerWidth / 1920, stageHeight / 840);
      root.style.setProperty("--reef-scale", `${scale}`);
      // Keep the print heading on the dark cave roof, independent of the
      // vertically centered artwork board and the viewport's aspect ratio.
      root.style.setProperty("--reef-print-heading-top", `${(24 - (stageHeight - 840 * scale) / 2) / scale}px`);
      overflow = boards.map(board => Math.max(0, board.scrollHeight - stageHeight + 48));
      queue();
    };

    const paint = (time: number) => {
      frame = 0;
      const reduced = media.matches;
      root.dataset.reduced = String(reduced);
      const bounds = root.getBoundingClientRect();
      const nextTop = next.getBoundingClientRect().top;
      const fixed = bounds.top <= headerHeight && nextTop > headerHeight;
      root.dataset.fixed = String(!reduced && fixed);
      root.dataset.covered = String(!reduced && nextTop <= headerHeight);
      const target = clamp((headerHeight - bounds.top) / Math.max(1, root.offsetHeight - stageHeight));
      // Smooth wheel steps visually, while native scrolling and the handoff stay immediate.
      const dt = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      if (reduced || !fixed || !Number.isFinite(displayedProgress) || target === 1) displayedProgress = target;
      else displayedProgress += (target - displayedProgress) * (1 - Math.exp(-dt / 200));
      if (Math.abs(target - displayedProgress) < .00002) displayedProgress = target;
      const p = displayedProgress;
      root.dataset.progress = p.toFixed(4);
      root.dataset.targetProgress = target.toFixed(4);
      if (reduced) {
        chapters.forEach(chapter => { chapter.inert = false; chapter.removeAttribute("aria-hidden"); });
        return;
      }
      const near = smooth(ramp(p, .285, .395));
      const inside = smooth(ramp(p, .595, .695));
      const ending = smooth(ramp(p, .885, .955));
      const firstTravel = ramp(p, .235, .405);
      const secondTravel = ramp(p, .555, .705);
      const travel = Math.max(Math.sin(firstTravel * Math.PI), Math.sin(secondTravel * Math.PI));
      // Reveal the next depth through the opening, rather than dissolving the whole world.
      stage.style.setProperty("--near-opacity", `${smooth(ramp(p, .285, .325))}`);
      stage.style.setProperty("--inside-opacity", `${smooth(ramp(p, .595, .635))}`);
      stage.style.setProperty("--near-reveal", `${near * 120}%`);
      stage.style.setProperty("--inside-reveal", `${inside * 120}%`);
      stage.style.setProperty("--return-opacity", `${ending}`);
      stage.style.setProperty("--sea-zoom", `${zoom(1, 4.6, firstTravel)}`);
      stage.style.setProperty("--near-zoom", `${zoom(1, 1.08, ramp(p, .285, .405)) * zoom(1, 3.8, secondTravel)}`);
      stage.style.setProperty("--inside-zoom", `${zoom(1, 1.14, ramp(p, .595, .705))}`);
      stage.style.setProperty("--swim-x", `${Math.sin(p * Math.PI * 5) * travel * 1.1}%`);
      stage.style.setProperty("--swim-y", `${Math.sin(p * Math.PI * 3) * travel * .7}%`);
      stage.style.setProperty("--swim-roll", `${Math.sin(p * Math.PI * 4) * travel * .35}deg`);
      stage.style.setProperty("--travel-shade", `${travel * .16}`);
      stage.style.setProperty("--sea-bright", `${.38 * ending}`);
      const phases = [[.025, .255], [.405, .56], [.705, .89]];
      phases.forEach(([start, end], i) => {
        const alpha = i === 0 ? (p >= start ? 1 - smooth(ramp(p, .22, end)) : 0) : chapterWindow(p, start, end);
        const chapter = chapters[i];
        chapter.style.opacity = `${alpha}`;
        chapter.inert = alpha < .5 || !fixed;
        chapter.setAttribute("aria-hidden", String(alpha < .5 || !fixed));
        const local = ramp(p, start, end);
        const pan = mobileMedia.matches ? smooth(ramp(local, i === 0 ? .62 : .23, .86)) * overflow[i] : 0;
        boards[i].style.setProperty("--reef-pan", `${-pan}px`);
        entries[i].forEach(entry => {
          const order = Number(entry.dataset.enter);
          const entrance = i === 0
            ? smooth(ramp(p, order < 3 ? .035 + order * .025 : .115 + (order - 3) * .01, order < 3 ? .12 + order * .025 : .185 + (order - 3) * .01))
            : smooth(ramp(local, .025 + order * .018, .14 + order * .018));
          entry.style.setProperty("--enter-opacity", `${entrance}`);
          entry.style.setProperty("--enter-y", `${(1 - entrance) * (i === 0 ? 40 : 24)}px`);
          entry.style.setProperty("--enter-scale", `${.975 + entrance * .025}`);
        });
      });
      if (displayedProgress !== target) queue();
    };
    function queue() { if (!frame) frame = requestAnimationFrame(paint); }
    const observer = new ResizeObserver(measure);
    boards.forEach(board => observer.observe(board));
    if (header) observer.observe(header);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", measure);
    media.addEventListener("change", measure);
    mobileMedia.addEventListener("change", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", measure);
      media.removeEventListener("change", measure);
      mobileMedia.removeEventListener("change", measure);
    };
  }, []);

  return <section className="reef-scroll" ref={rootRef} aria-label="HaShunit — an underwater design journey" style={{ "--reef-sea-image": `url("${brandingAsset("f322d.png")}")`, "--reef-near-image": `url("${brandingAsset("f4bf6.png")}")`, "--reef-inside-image": `url("${brandingAsset("ba6c8.png")}")` } as CSSProperties}>
    <a className="reef-skip" href="#branding-makbilim">Skip underwater journey</a>
    <div className="reef-stage">
      <div className="reef-backgrounds" aria-hidden="true">
        <div className="reef-background reef-sea"><img src={brandingAsset("f322d.png")} alt="" fetchPriority="high" /></div>
        <div className="reef-background reef-near"><img src={brandingAsset("f4bf6.png")} alt="" /></div>
        <div className="reef-background reef-inside"><img src={brandingAsset("ba6c8.png")} alt="" /></div>
        <div className="reef-background reef-return"><img src={brandingAsset("f322d.png")} alt="" /></div>
        <div className="reef-travel-shade" />
        <div className="reef-bright" />
      </div>
      <div className="reef-chapter reef-intro" aria-label="About HaShunit">
        <div className="reef-board">
          <img className="reef-logo" src={brandingAsset("7107a.png")} alt="HaShunit — a world of fish" data-node-id="1:82" data-enter="0" />
          <h2 data-enter="1">Helping children take their first step into pet ownership with confidence, curiosity and joy.</h2>
          <img className="reef-intro-rule" src={brandingAsset("dfab6.png")} width="105" height="2" alt="" data-enter="1" />
          <p className="reef-intro-description" data-enter="2">Designed as a complete cross-platform experience, this graduation project combines branding, illustration, editorial design, UX/UI, motion and video into one cohesive visual language. Every touchpoint was created from scratch, maintaining consistency while adapting to different formats, audiences and user interactions.</p>
          <BrandingFeatures features={reefFeatures} animated />
        </div>
      </div>
      <div className="reef-chapter reef-digital" aria-label="Digital experience">
        <div className="reef-board">
          <header className="reef-heading" data-enter="0"><h2>Digital Experience - Interactive Learning</h2><p>An interactive platform designed to guide children through the daily responsibilities of caring for their first pet fish.</p></header>
          <Artwork art={digitalArtwork[0]} order={1} />
          <Artwork art={digitalArtwork[1]} order={2} />
          <InterfacePanel />
          <Artwork art={digitalArtwork[2]} order={4} />
        </div>
      </div>
      <div className="reef-chapter reef-print" aria-label="Print and illustration">
        <div className="reef-board">
          <header className="reef-heading" data-enter="0"><h2>Print &amp; Illustration - From Screen to Print</h2><p>The visual world was extended into printed materials, combining original illustration.</p></header>
          {printArtwork.map((art, i) => <Artwork key={art.id} art={art} order={i + 1} />)}
        </div>
      </div>
    </div>
  </section>;
}
