import { useRef, type CSSProperties } from "react";
import { assetUrl, arrowIcon as ArrowIcon, type Category } from "../data/siteContent";

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
        if (window.matchMedia("(max-width: 760px)").matches) return;
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
          <img
            className="mobile-category-poster"
            src={category.title === "Products"
              ? assetUrl("assets/products/hero-stand-transparent.png")
              : category.visual.object ?? assetUrl("assets/categories/fashion.webp")}
            loading="lazy"
            decoding="async"
            alt=""
          />
          {category.visual.video ? (
            <video
              ref={videoRef}
              src={category.visual.video}
              poster={category.visual.object}
              muted
              loop
              playsInline
              preload={category.visual.object ? "none" : "auto"}
              onPlay={() => { if (!hovered.current) stop(); }}
            />
          ) : (
            <img
              src={category.visual.object}
              loading="lazy"
              decoding="async"
              alt=""
            />
          )}
        </span>
        <strong>{category.title}</strong>
        <span className="round-arrow video-visual-arrow" aria-hidden="true"><ArrowIcon /></span>
      </span>
    </a>
  );
}
