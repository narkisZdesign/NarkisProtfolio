import { useEffect, useRef, useState } from "react";
import { assetUrl, siteConfig } from "../data/siteContent";
import { createHeroFrames } from "../lib/heroFrames";

// Frame 193 is both the last intro frame and the first scroll frame (60 fps).
const FRAME_COUNT = 399;
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function Hero() {
  const mobile = useMediaQuery("(max-width: 760px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const finishIntroRef = useRef<() => void>(() => {});
  const introPlayedRef = useRef(false);
  const mediaRoot = assetUrl(`assets/hero/${mobile ? "portrait" : "wide"}`);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const video = videoRef.current;
    const copy = copyRef.current!;
    const context = canvas.getContext("2d", { alpha: false });
    const header = document.querySelector<HTMLElement>(".site-header");
    let disposed = false;
    let raf = 0;
    let lastTime = 0;
    let current = 0;
    let target = 0;
    let lastPainted = -1;
    let direction = 1;
    let needsPaint = true;
    let visible = true;
    let sectionTop = 0;
    let distance = 1;
    let headerHeight = 0;
    let introDone = introPlayedRef.current || reducedMotion;
    let introTimer = 0;
    const max = FRAME_COUNT - 1;

    const requestTick = () => {
      if (!disposed && !raf && !document.hidden && visible) raf = requestAnimationFrame(tick);
    };
    const frames = reducedMotion || !context ? null : createHeroFrames(
      (index) => `${mediaRoot}/frames/frame_${String(index + 1).padStart(3, "0")}.webp`,
      FRAME_COUNT, mobile, requestTick,
    );

    const finishIntro = () => {
      if (disposed) return;
      introDone = true;
      introPlayedRef.current = true;
      clearTimeout(introTimer);
      video?.pause();
      // Keep the video/poster visible until a decoded scroll frame replaces it.
      requestTick();
    };
    finishIntroRef.current = finishIntro;

    const readScroll = () => {
      const next = clamp((window.scrollY - sectionTop + headerHeight) / distance) * max;
      direction = next >= target ? 1 : -1;
      target = next;
      if (target > 0.1 || window.scrollY > sectionTop + section.offsetHeight) finishIntro();
      requestTick();
    };

    const measure = () => {
      headerHeight = header?.getBoundingClientRect().height ?? 0;
      section.style.setProperty("--hero-header-height", `${headerHeight}px`);
      const bounds = stage.getBoundingClientRect();
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
      // Avoid allocating a giant retina canvas. Source resolution is the useful cap.
      const scale = Math.min(window.devicePixelRatio || 1, mobile ? 2 : 1, 1920 / bounds.width);
      const width = Math.max(1, Math.round(bounds.width * scale));
      const height = Math.max(1, Math.round(bounds.height * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        needsPaint = true;
      }
      // Anchor desktop copy to the lettering in the film, including cover cropping.
      if (!mobile) {
        const cover = Math.max(bounds.width / 2520, bounds.height / 1080);
        const left = (bounds.width - 2520 * cover) / 2;
        const top = (bounds.height - 1080 * cover) / 2;
        copy.style.left = `${left + 1635 * cover}px`;
        copy.style.top = `${top + 752 * cover}px`;
        copy.style.width = `${Math.min(500 * cover, bounds.width - left - 1635 * cover - 24)}px`;
      } else {
        copy.style.removeProperty("left");
        copy.style.removeProperty("top");
        copy.style.removeProperty("width");
      }
      readScroll();
    };

    function tick(time: number) {
      raf = 0;
      if (disposed || reducedMotion || !frames || !context) return;
      const dt = lastTime ? Math.min(64, time - lastTime) : 16.67;
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-dt / 65));
      if (Math.abs(target - current) < 0.15) current = target;
      const desired = Math.round(current);
      frames.request(desired, Math.round(target), direction);
      const ready = frames.nearest(desired);
      if (introDone && !ready && frames.hasFailed(desired) && lastPainted < 0) {
        const poster = section.querySelector<HTMLImageElement>(".hero-poster");
        if (poster) poster.src = `${mediaRoot}/final-poster.webp`;
        section.dataset.phase = "fallback";
        copy.style.opacity = "1";
      }
      if (introDone && ready && (lastPainted !== ready.index || needsPaint)) {
        const { bitmap, index } = ready;
        const cover = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
        const width = bitmap.width * cover;
        const height = bitmap.height * cover;
        context.drawImage(bitmap, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
        lastPainted = index;
        needsPaint = false;
        section.dataset.phase = "scroll";
        section.dataset.frame = String(index + 1);
        const progress = index / max;
        copy.style.opacity = String(clamp((progress - 0.78) / 0.12));
        section.classList.toggle("is-sketch", progress < 0.42);
      }
      if (Math.abs(target - current) > 0.15) requestTick();
    }

    section.dataset.phase = reducedMotion ? "static" : "intro";
    section.dataset.frame = reducedMotion ? String(FRAME_COUNT) : "0";
    section.classList.toggle("is-sketch", !reducedMotion);
    copy.style.opacity = reducedMotion ? "1" : "0";
    const resize = new ResizeObserver(measure);
    resize.observe(stage);
    if (header) resize.observe(header);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { lastTime = 0; readScroll(); }
      else { if (raf) cancelAnimationFrame(raf); raf = 0; }
    });
    visibility.observe(section);
    const onVisibility = () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
      else { lastTime = 0; readScroll(); }
    };
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    section.parentElement?.addEventListener("animationend", measure);
    document.addEventListener("visibilitychange", onVisibility);
    measure();
    // A direct hash entry should not replay the opening or traverse every frame.
    current = target;
    if (video && !reducedMotion && !introDone) {
      void video.play().catch(finishIntro);
      introTimer = window.setTimeout(finishIntro, 7000);
    } else if (introDone) finishIntro();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(introTimer);
      frames?.dispose();
      resize.disconnect();
      visibility.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", measure);
      section.parentElement?.removeEventListener("animationend", measure);
      document.removeEventListener("visibilitychange", onVisibility);
      finishIntroRef.current = () => {};
    };
  }, [mediaRoot, mobile, reducedMotion]);

  return (
    <section className="hero-section" id="home" ref={sectionRef} aria-label="Portfolio introduction">
      <div className="hero-image-wrap" ref={stageRef}>
        <img className="hero-media hero-poster" src={`${mediaRoot}/${reducedMotion ? "final" : "intro"}-poster.webp`} alt="" aria-hidden="true" />
        <canvas className="hero-media hero-scroll-frame" ref={canvasRef} role="img" aria-label="A designer’s sketch becomes a teal studio with a woman and her laptop" />
        {!reducedMotion && <video key={mediaRoot} className="hero-media hero-intro-video" ref={videoRef}
          src={`${mediaRoot}/intro.mp4`} poster={`${mediaRoot}/intro-poster.webp`} muted playsInline preload="auto"
          aria-hidden="true" onEnded={() => finishIntroRef.current()} onError={() => finishIntroRef.current()} />}
        <div className="hero-copy" ref={copyRef}>
          <h1>{siteConfig.heroTitle}</h1>
          <p className="hero-subtitle">{siteConfig.heroSubtitle}</p>
          <p>{siteConfig.heroBody}</p>
        </div>
        <a className="scroll-cue" href="#work" aria-label="Scroll to work"><span /></a>
      </div>
    </section>
  );
}
