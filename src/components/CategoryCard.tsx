import { useRef, type CSSProperties } from "react";
import { arrowIcon as ArrowIcon, type Category } from "../data/siteContent";

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hovered = useRef(false);

  const stop = () => {
    hovered.current = false;
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <a
      className={`category-card category-card-featured asset-category-card category-${category.title.toLowerCase()}`}
      href={category.href}
      data-reveal
      style={{ "--delay": `${index * 60}ms` } as CSSProperties}
      onMouseEnter={() => {
        hovered.current = true;
        if (videoRef.current) {
          videoRef.current.playbackRate = category.title === "Branding" ? 1.75 : 1;
        }
        void videoRef.current?.play().catch(() => {
          // Leave the poster visible if the browser cannot play this media.
        });
      }}
      onMouseLeave={stop}
    >
      <span className="asset-card-visual">
        <img className="category-background" src={category.visual.background} loading="lazy" decoding="async" alt="" />
        <span className="category-object-wrap" aria-hidden="true">
          {category.visual.video ? (
            <video
              ref={videoRef}
              src={category.visual.video}
              poster={category.visual.object}
              muted
              loop
              playsInline
              preload="none"
              onPlay={() => { if (!hovered.current) stop(); }}
            />
          ) : (
            <img src={category.visual.object} loading="lazy" decoding="async" alt="" />
          )}
        </span>
        <strong>{category.title}</strong>
        <span className="round-arrow video-visual-arrow" aria-hidden="true"><ArrowIcon /></span>
      </span>
    </a>
  );
}
