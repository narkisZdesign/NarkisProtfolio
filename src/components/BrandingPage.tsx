import { academyFeatures, academyPhotos, brandingAsset } from "../data/brandingContent";
import { BrandingFeatures, ReefScroll } from "./ReefScroll";
import "./branding.css";

function BrandingHero() {
  return <section className="branding-hero" aria-labelledby="branding-title">
    <div className="branding-container branding-hero-layout">
      <div className="branding-hero-copy">
        <h1 id="branding-title">BRANDING</h1>
        <p>A memorable brand from concept to every touchpoint</p>
        <a className="branding-back" href="#work">&lt;&lt; Go back for more projects</a>
        <div className="branding-hero-tags">
          {[["b14ef.png", "Research & Strategy"], ["952d4.png", "Visual Language"], ["75318.png", "Consistency"]].map(([icon, label]) => <span key={label}><img src={brandingAsset(icon)} alt="" />{label}</span>)}
        </div>
      </div>
      <div className="branding-hero-art" aria-hidden="true">
        <img className="branding-flowers" src={brandingAsset("7f15a.png")} alt="" data-node-id="2:37" />
        <img className="branding-seal" src={brandingAsset("564ac.png")} alt="" data-node-id="2:90" />
      </div>
    </div>
  </section>;
}

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
  return <main className="branding-page"><BrandingHero /><ReefScroll /><AcademyProject /></main>;
}
