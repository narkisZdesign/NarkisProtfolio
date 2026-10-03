import { academyFeatures, academyPhotos, brandingAsset } from "../data/brandingContent";
import { BrandingFeatures, ReefScroll } from "./ReefScroll";
import { CategoryHero } from "./CategoryHero";
import "./branding.css";

function AcademyProject() {
  return <section className="branding-academy" id="branding-makbilim" aria-labelledby="academy-title" tabIndex={-1}>
    <div className="branding-container">
      <div className="branding-academy-intro">
        <figure className="branding-academy-posters" data-node-id="2:86"><img src={brandingAsset("c485b.png")} alt="Three Makbilim time-travel academy posters" loading="lazy" decoding="async" /></figure>
        <div className="branding-academy-copy"><h2 id="academy-title">“Makbilim”<br />Time-Travel Academy</h2><h3>Brand Identity Project</h3>
          <img className="branding-academy-rule" src={brandingAsset("381f1.png")} width="96" height="2" alt="" />
          <p>Inspired by the idea of traveling through time, this project creates a visual language that feels dynamic, mysterious and immersive. Using bold typography, digital glitches and high-contrast compositions work together to express curiosity, transformation and the excitement of exploring beyond the familiar.</p>
        </div>
      </div>
      <BrandingFeatures features={academyFeatures} />
      <div className="branding-gallery">
        <div className="branding-gallery-row">{academyPhotos.slice(0, 4).map(photo => <AcademyPhoto key={photo.id} photo={photo} />)}</div>
        <div className="branding-gallery-row">{academyPhotos.slice(4).map(photo => <AcademyPhoto key={photo.id} photo={photo} />)}</div>
      </div>
    </div>
    <div className="branding-details" data-node-id="2:52"><video aria-label="Makbilim Time-Travel Academy brand video" autoPlay muted loop playsInline preload="metadata"><source src={brandingAsset("makbilimvideo.mp4")} type="video/mp4" /></video></div>
  </section>;
}

function AcademyPhoto({ photo }: { photo: typeof academyPhotos[number] }) {
  return <figure className="branding-photo" data-node-id={photo.id} style={{ aspectRatio: photo.ratio }}>
    <img src={brandingAsset(photo.file)} alt={photo.alt} loading="lazy" decoding="async" style={photo.crop ? { position: "absolute", ...photo.crop } : undefined} />
  </figure>;
}

export function BrandingPage() {
  return <main className="branding-page">
    <svg className="branding-icon-filters" aria-hidden="true" focusable="false" width="0" height="0">
      <defs><filter id="reef-icon-remove-white" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -5 -5 -5 0 14" result="keyed" />
        <feComposite in="keyed" in2="SourceGraphic" operator="in" />
      </filter></defs>
    </svg>
    <CategoryHero category="branding" /><ReefScroll /><AcademyProject />
  </main>;
}
