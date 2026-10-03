import { useEffect, useRef, useState } from "react";
import { assetUrl, siteConfig } from "../data/siteContent";
import { createHeroFrames } from "../lib/heroFrames";
import { createHeroSurface } from "../lib/heroSurface";
import heroMedia from "../data/heroMedia.json";

// Both phases share the source frame at precisely 00:02.
const FRAME_COUNT = heroMedia.frameCount;
const INTRO_SECONDS = heroMedia.introSeconds;
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);
// Centerlines of the red crop in the supplied 1544 × 628 reference.
const FINAL_CROP = { width: 1180, height: 478, referenceWidth: 1544, verticalOffset: 2 };
const FINAL_ASPECT = FINAL_CROP.width / FINAL_CROP.height;
const FINAL_ZOOM = FINAL_CROP.referenceWidth / FINAL_CROP.width;

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
  const scrollStartRef = useRef(0);
  const introTimeRef = useRef(0);
  const mediaRoot = assetUrl(`${heroMedia.assetRoot}/${mobile ? "portrait" : "wide"}`);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const video = videoRef.current;
    const copy = copyRef.current!;
    const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
    const swatch = document.createElement("canvas").getContext("2d")!;
    swatch.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    swatch.fillRect(0, 0, 1, 1);
    const [r, g, b] = swatch.getImageData(0, 0, 1, 1).data;
    const surface = createHeroSurface([r, g, b]);
    const poster = section.querySelector<HTMLImageElement>(".hero-poster")!;
    const header = document.querySelector<HTMLElement>(".site-header");
    let disposed = false;
    let raf = 0;
    let lastTime = 0;
    let current = 0;
    let target = 0;
    let lastPainted = -1;
    let playbackDirection = 1;
    let needsPaint = true;
    let visible = true;
    let sectionTop = 0;
    let distance = 1;
    let headerHeight = 0;
    let introDone = introPlayedRef.current || reducedMotion;
    let handoffPainted = introDone;
    let videoFrame = 0;
    let introRaf = 0;
    let fullStageWidth = 0;
    let fullStageHeight = 0;
    let presentationProgress = reducedMotion ? 1 : 0;
    const presentationStyles = new Map<string, string>();
    const max = FRAME_COUNT - 1;

    const requestTick = () => {
      if (!disposed && !raf && !document.hidden && visible) raf = requestAnimationFrame(tick);
    };
    const frames = reducedMotion || !context ? null : createHeroFrames(
      (index) => `${mediaRoot}/frames/frame_${String(index + 1).padStart(3, "0")}.webp`,
      FRAME_COUNT, mobile, requestTick,
      (bitmap, index) => surface.grade(bitmap, index / max, mobile),
    );
    const paintPoster = async () => {
      if (!reducedMotion || !context || disposed || !poster.naturalWidth) return;
      try {
        const bitmap = await surface.grade(await createImageBitmap(poster), 1, mobile);
        if (!disposed) {
          context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          section.classList.add("is-surface-ready");
        }
        bitmap.close();
      } catch { /* The original poster remains available. */ }
    };

    const rawProgress = () => (window.scrollY - sectionTop + headerHeight) / distance;
    const resumeIntro = () => {
      if (!disposed && !introDone && video && introTimeRef.current > 0 && video.readyState >= 1) {
        video.currentTime = introTimeRef.current;
      }
    };

    const finishIntro = () => {
      if (disposed || introDone) return;
      video?.pause();
      if (video && video.readyState >= 1) video.currentTime = INTRO_SECONDS;
      if (videoFrame) video?.cancelVideoFrameCallback(videoFrame);
      cancelAnimationFrame(introRaf);
      introDone = true;
      introPlayedRef.current = true;
      introTimeRef.current = INTRO_SECONDS;
      // Early scrolling never interrupts the opening or jumps the handoff ahead.
      scrollStartRef.current = clamp(rawProgress());
      current = target = 0;
      lastTime = 0;
      section.dataset.time = String(INTRO_SECONDS);
      // Keep the held 00:02 video frame visible until that exact bitmap is ready.
      requestTick();
    };
    finishIntroRef.current = finishIntro;

    const readScroll = () => {
      const next = introDone
        ? clamp((rawProgress() - scrollStartRef.current) / Math.max(1 / distance, 1 - scrollStartRef.current)) * max
        : 0;
      target = next;
      requestTick();
    };

    const setPresentationStyle = (name: string, value: string) => {
      if (presentationStyles.get(name) === value) return;
      presentationStyles.set(name, value);
      section.style.setProperty(name, value);
    };
    const present = (progress: number, force = false) => {
      if (!force && presentationProgress === progress) return;
      presentationProgress = progress;
      const framing = mobile ? 0 : smoothstep(clamp((progress - 0.55) / 0.45));
      const finalWidth = Math.min(fullStageWidth, fullStageHeight * FINAL_ASPECT);
      const width = fullStageWidth + (finalWidth - fullStageWidth) * framing;
      const height = fullStageHeight + (finalWidth / FINAL_ASPECT - fullStageHeight) * framing;
      const zoom = 1 + (FINAL_ZOOM - 1) * framing;
      const shift = -FINAL_CROP.verticalOffset * width / FINAL_CROP.width * framing;
      setPresentationStyle("--hero-stage-width", `${width.toFixed(2)}px`);
      setPresentationStyle("--hero-stage-height", `${height.toFixed(2)}px`);
      setPresentationStyle("--hero-zoom", String(zoom));
      setPresentationStyle("--hero-shift-y", `${shift.toFixed(2)}px`);
      setPresentationStyle("--hero-fade-opacity", String(smoothstep(clamp((progress - 0.94) / 0.06))));
      section.dataset.progress = progress.toFixed(4);
    };

    const measure = () => {
      headerHeight = header?.getBoundingClientRect().height ?? 0;
      section.style.setProperty("--hero-header-height", `${headerHeight}px`);
      const bounds = section.getBoundingClientRect();
      sectionTop = bounds.top + window.scrollY;
      distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
      fullStageWidth = bounds.width;
      fullStageHeight = Math.max(1, (reducedMotion ? window.innerHeight : distance / 2) - headerHeight);
      // Draw the complete source frame once. CSS crops it with a uniform scale,
      // matching the intro video and avoiding canvas reallocations while framing.
      const width = mobile ? 720 : heroMedia.wideWidth;
      const height = mobile ? 1280 : heroMedia.wideHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        needsPaint = true;
      }
      present(presentationProgress, true);
      readScroll();
    };

    function tick(time: number) {
      raf = 0;
      if (disposed || reducedMotion || !frames || !context) return;
      const dt = lastTime ? Math.min(64, time - lastTime) : 16.67;
      lastTime = time;
      const previous = current;
      if (target !== previous) playbackDirection = target > previous ? 1 : -1;
      if (introDone && handoffPainted) current += (target - current) * (1 - Math.exp(-dt / 65));
      if (Math.abs(target - current) < 0.15) current = target;
      const desired = Math.round(current);
      frames.request(desired, Math.round(target), playbackDirection, Math.abs(current - previous));
      const boundary = frames.get(0);
      const ready = handoffPainted ? frames.nearest(desired, lastPainted, playbackDirection) : boundary ? { index: 0, bitmap: boundary } : null;
      if (introDone && !ready && frames.hasFailed(desired) && lastPainted < 0) {
        const poster = section.querySelector<HTMLImageElement>(".hero-poster");
        if (poster) poster.src = `${mediaRoot}/final-poster.webp`;
        section.dataset.phase = "fallback";
        present(1);
        copy.style.opacity = "1";
      }
      if (introDone && ready) present(handoffPainted ? current / max : 0);
      if (introDone && ready && (lastPainted !== ready.index || needsPaint)) {
        const { bitmap, index } = ready;
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        lastPainted = index;
        handoffPainted = true;
        needsPaint = false;
        section.dataset.phase = "scroll";
        section.dataset.frame = String(index + 1);
        section.dataset.time = String(INTRO_SECONDS + index / heroMedia.fps);
        const progress = index / max;
        copy.style.opacity = String(clamp((progress - 0.78) / 0.12));
        section.classList.toggle("is-sketch", progress < 0.42);
      }
      if (Math.abs(target - current) > 0.15) requestTick();
      else lastTime = 0;
    }

    section.dataset.phase = reducedMotion ? "static" : "intro";
    section.classList.remove("is-surface-ready");
    section.dataset.frame = reducedMotion ? String(FRAME_COUNT) : "0";
    section.dataset.time = reducedMotion ? String(heroMedia.lastFrameSeconds) : "0";
    section.classList.toggle("is-sketch", !reducedMotion);
    copy.style.opacity = reducedMotion ? "1" : "0";
    const resize = new ResizeObserver(measure);
    // The stage resizes throughout the final crop. Observing it creates a
    // layout/measurement loop on every scroll frame; only measure real resizes.
    if (header) resize.observe(header);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      frames?.setActive(visible && !document.hidden);
      if (visible) { lastTime = 0; readScroll(); }
      else { if (raf) cancelAnimationFrame(raf); raf = 0; }
    });
    visibility.observe(section);
    const onVisibility = () => {
      frames?.setActive(visible && !document.hidden);
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
      else { lastTime = 0; readScroll(); }
    };
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    section.parentElement?.addEventListener("animationend", measure);
    document.addEventListener("visibilitychange", onVisibility);
    measure();
    if (reducedMotion) {
      poster.addEventListener("load", paintPoster);
      if (poster.complete) void paintPoster();
    }
    // Resume an existing scroll-controlled hero at the current page position.
    current = target;
    frames?.warm();
    if (video && !reducedMotion && !introDone) {
      // Resize can switch variants during playback; resume the same timestamp.
      video.addEventListener("loadedmetadata", resumeIntro, { once: true });
      resumeIntro();
      if (typeof video.requestVideoFrameCallback === "function") {
        const watchFrame: VideoFrameRequestCallback = (_time, metadata) => {
          if (disposed || introDone) return;
          if (metadata.mediaTime >= INTRO_SECONDS) finishIntro();
          else videoFrame = video.requestVideoFrameCallback(watchFrame);
        };
        videoFrame = video.requestVideoFrameCallback(watchFrame);
      } else {
        const watchTime = () => {
          if (disposed || introDone) return;
          if (video.currentTime >= INTRO_SECONDS) finishIntro();
          else introRaf = requestAnimationFrame(watchTime);
        };
        introRaf = requestAnimationFrame(watchTime);
      }
      void video.play().catch(finishIntro);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(introRaf);
      if (videoFrame) video?.cancelVideoFrameCallback(videoFrame);
      if (video) {
        video.removeEventListener("loadedmetadata", resumeIntro);
        if (!introDone) introTimeRef.current = Math.min(video.currentTime, INTRO_SECONDS);
        video.pause();
      }
      frames?.dispose();
      surface.dispose();
      poster.removeEventListener("load", paintPoster);
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
        <div className="hero-white-blend" aria-hidden="true" />
        <div className="hero-copy" ref={copyRef}>
          <h1>{siteConfig.heroTitle}</h1>
        </div>
        <a className="scroll-cue" href="#work" aria-label="Scroll to work"><span /></a>
      </div>
    </section>
  );
}
