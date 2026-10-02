import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import {
  displayFeatures, horseVideoSrc, mirrorFeatures, mirrorPhotos, productAsset,
  showroomFeatures, showroomHoverFiles, showroomPhotos,
  type ProductCrop, type ProductFeature, type ProductPhoto,
} from "../data/productsContent";
import "./products.css";

function useProductsParallax(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layers = Array.from(page.querySelectorAll<HTMLElement>("[data-products-parallax]"));
    let frame = 0;
    const paint = () => {
      frame = 0;
      layers.forEach((layer) => {
        const section = layer.closest("section");
        if (!section) return;
        const bounds = section.getBoundingClientRect();
        if (bounds.bottom < -80 || bounds.top > window.innerHeight + 80) return;
        const speed = Number(layer.dataset.productsParallax);
        const distance = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
        const shift = media.matches ? 0 : Math.max(-40, Math.min(40, distance * speed * 2));
        layer.style.setProperty("--products-parallax-y", `${shift.toFixed(2)}px`);
      });
    };
    const queue = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
    const reset = () => {
      layers.forEach((layer) => layer.style.setProperty("--products-parallax-y", "0px"));
      queue();
    };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    media.addEventListener("change", reset);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      media.removeEventListener("change", reset);
    };
  }, [root]);
}

function cropStyle(crop?: ProductCrop): CSSProperties | undefined {
  return crop ? {
    width: `${crop.width}%`, height: `${crop.height}%`, left: `${crop.left}%`, top: `${crop.top}%`,
    transform: crop.flip ? "scaleX(-1)" : undefined,
    transformOrigin: crop.flip ? "left center" : undefined,
  } : undefined;
}

function Photo({ photo, hoverFile, className = "", eager = false }: {
  photo: ProductPhoto; hoverFile?: string; className?: string; eager?: boolean;
}) {
  return (
    <figure className={`products-photo ${hoverFile ? "products-photo-swap" : ""} ${className}`}
      data-node-id={photo.id} style={photo.aspectRatio ? { aspectRatio: photo.aspectRatio } : undefined}
      tabIndex={className.includes("gallery") || hoverFile ? 0 : undefined}>
      <div className="products-photo-zoom">
        <img className={photo.crop ? "products-photo-cropped" : "products-photo-original"}
          src={productAsset(photo.file)} alt={photo.alt} style={cropStyle(photo.crop)}
          loading={eager ? "eager" : "lazy"} decoding="async" />
        {hoverFile && <img className="products-photo-alternate" src={productAsset(hoverFile)}
          alt="" aria-hidden="true" loading="lazy" decoding="async" />}
      </div>
    </figure>
  );
}

function FeatureCards({ features, variant = "" }: { features: ProductFeature[]; variant?: string }) {
  return (
    <div className={`products-features ${variant}`}>
      {features.map((feature) => (
        <article className="products-feature" key={feature.title}>
          <div className="products-feature-icon">
            <img src={productAsset(feature.icon)} alt="" loading="lazy" decoding="async" style={cropStyle(feature.crop)} />
          </div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </article>
      ))}
    </div>
  );
}

function CardStrip() {
  return (
    <div className="products-card-strip" data-node-id="1:79" data-name="Group 35" aria-label="Showroom coupon card designs">
      <div className="products-card-track">
        {[0, 1].map((copy) => (
          <div className="products-card-sequence" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {[0, 1, 2, 3].map((tile) => <img src={productAsset("6659b.png")} key={tile}
              alt={copy === 0 && tile === 0 ? "A strip of branded lucky coupon cards" : ""} loading="lazy" decoding="async" />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductsPage() {
  const pageRef = useRef<HTMLElement>(null);
  useProductsParallax(pageRef);

  return (
    <main className="products-page" ref={pageRef}>
      <section className="products-hero" aria-labelledby="products-title" data-node-id="1:120">
        <div className="products-container products-hero-layout">
          <div className="products-hero-copy" data-reveal data-products-parallax="0.025">
            <h1 id="products-title">BRAND<br />EXPERIENCES</h1>
            <p>Props &amp; displays from<br className="products-desktop-break" /> concept to setup</p>
            <a href="#work" className="products-back">&lt;&lt; Go back for more procjects</a>
            <div className="products-hero-values">
              <span><img src={productAsset("b14ef.png")} alt="" />Concept To<br />Space</span>
              <span><img src={productAsset("952d4.png")} alt="" />Print &amp;<br />Production</span>
              <span><img src={productAsset("75318.png")} alt="" />Branded<br />Impact</span>
            </div>
          </div>
          <div className="products-hero-art" data-reveal data-products-parallax="0.07" aria-hidden="true">
            <div className="products-hero-sketch">
              <img src={productAsset("788ba.png")} alt="" />
            </div>
            <div className="products-hero-object">
              <img src={productAsset("hero-stand-transparent.png")} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="products-showroom" aria-labelledby="products-showroom-title" data-node-id="1:93">
        <div className="products-showroom-background">
          <img data-products-parallax="0.025" src={productAsset("showroom26bg.png")} alt="Minene showroom signage with apparel graphics and sculptural white props" />
        </div>
        <div className="products-showroom-intro">
          <div className="products-showroom-heading" data-reveal data-products-parallax="0.015">
            <h2 id="products-showroom-title">Showroom Props &amp; Signage</h2>
            <p>A showroom display combining&nbsp; signage, custom props and 3D<br className="products-desktop-break" /> decorative elements. Each piece&nbsp; designed to support the&nbsp; visual story.</p>
          </div>
          <div className="products-container products-showroom-cards" data-reveal data-products-parallax="0.025">
            <FeatureCards features={showroomFeatures} variant="products-features-wide" />
          </div>
        </div>
      </section>

      <section className="products-showroom-gallery" aria-label="Showroom props gallery" data-node-id="1:85" data-name="show26gallery">
        <div className="products-container" data-reveal data-products-parallax="0.035">
          <div className="products-showroom-gallery-inner">
            <div className="products-gallery-row products-gallery-row-top">
              {showroomPhotos.slice(0, 4).map((photo, index) => <Photo photo={photo} hoverFile={showroomHoverFiles[index]} className="products-gallery-photo" key={photo.id} />)}
            </div>
            <div className="products-gallery-row products-gallery-row-bottom">
              {showroomPhotos.slice(4).map((photo) => <Photo photo={photo} className="products-gallery-photo" key={photo.id} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="products-horse" aria-label="Showroom horse animation" data-node-id="1:83" data-name="horse">
        <video className="products-horse-video" src={horseVideoSrc} aria-label="Animated horse and ballerina showroom display" autoPlay muted loop playsInline preload="metadata" />
      </section>

      <section className="products-display" aria-labelledby="products-display-title" data-node-id="1:52">
        <div className="products-container products-project-row products-display-row">
          <div className="products-project-image" data-reveal data-products-parallax="0.035">
            <Photo photo={{ id: "1:78", file: "cbb64.png", alt: "Large Minene luck coupon machine display with branded ticket rolls", crop: { width: 201.49, height: 130.33, left: -101.44, top: -13.87 } }} />
          </div>
          <div className="products-project-copy" data-reveal data-products-parallax="0.015">
            <h2 id="products-display-title">Large-Scale<br />Showroom Display</h2>
            <p>A large-scale display created for one of Minene showroom, inspired by the visual language of a luck coupon machine. The project combined graphic design, print preparation, production planning and hands-on assembly to transform the concept into a bold physical centerpiece.</p>
            <FeatureCards features={displayFeatures} variant="products-display-features" />
          </div>
        </div>
        <div data-reveal data-products-parallax="0.015"><CardStrip /></div>
      </section>

      <section className="products-standout" aria-labelledby="products-standout-title" data-node-id="1:43">
        <div className="products-container products-standout-layout">
          <div className="products-standout-photos">
            <Photo photo={{ id: "1:51", file: "cbb64.png", alt: "Branded lucky coupon rolls displayed in the showroom", crop: { width: 256.6, height: 206.8, left: -26.52, top: -103.39 } }} />
            <div className="products-standout-middle">
              <Photo photo={{ id: "1:50", file: "cbb64.png", alt: "Close-up of the showroom display detail", crop: { width: 303.39, height: 244.51, left: -182.93, top: -144.67 } }} />
              <Photo className="products-standout-overlay" photo={{ id: "1:48", file: "a9cb1.png", alt: "Custom branded display piece", crop: { width: 100.04, height: 126.2, left: -0.02, top: -4.79 } }} />
            </div>
            <Photo photo={{ id: "1:49", file: "cbb64.png", alt: "Pull for tickets sign on the luck coupon machine", crop: { width: 239.44, height: 192.97, left: -11.78, top: -14.17 } }} />
          </div>
          <div className="products-standout-copy">
            <h2 id="products-standout-title">Made To Stand Out</h2>
            <p>A playful display piece that brings the brand to life and creates a strong focal point within the showroom.</p>
          </div>
        </div>
      </section>

      <section className="products-mirror" aria-labelledby="products-mirror-title" data-node-id="1:14">
        <div className="products-container products-project-row products-mirror-row">
          <div className="products-project-copy" data-reveal data-products-parallax="0.015">
            <h2 id="products-mirror-title">Branded Launch Mirror</h2>
            <h3 className="products-mirror-subtitle">Store Launch Photo Experience</h3>
            <img className="products-mirror-rule" src={productAsset("ab6c9.png")} alt="" width="96" height="2" />
            <p>A branded mirror installation created for the launch of new Minene stores. Designed as a visual focal point at the store entrance, the mirror invited visitors to take a photo, share it on social media and tag the brand for a chance to participate in a giveaway.</p>
            <FeatureCards features={mirrorFeatures} variant="products-mirror-features" />
          </div>
          <div className="products-project-image" data-reveal data-products-parallax="0.035">
            <Photo photo={{ id: "1:15", file: "b5dbb.png", alt: "Pink branded Minene launch mirror with a red shop sign", crop: { width: 317.14, height: 205.14, left: -26.54, top: -0.01 } }} />
          </div>
        </div>
      </section>

      <section className="products-photo-moment" aria-labelledby="products-photo-moment-title" data-node-id="1:3">
        <div className="products-photo-moment-heading" data-reveal data-products-parallax="0.015">
          <h2 id="products-photo-moment-title">A Branded Photo Moment</h2>
          <p>Turning the store entrance into a memorable and shareable part of the launch experience.</p>
        </div>
        <div className="products-container products-mirror-gallery" data-reveal data-node-id="1:5" data-name="Group 25" data-products-parallax="0.035">
          {mirrorPhotos.map((photo) => <Photo key={photo.id} photo={photo} className="products-gallery-photo" />)}
        </div>
      </section>
    </main>
  );
}
