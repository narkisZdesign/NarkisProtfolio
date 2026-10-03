import { categoryHeroes, type CategoryId } from "../data/categoryContent";
import { assetUrl } from "../data/siteContent";
import "./categoryHero.css";

export function CategoryHero({ category }: { category: CategoryId }) {
  const content = categoryHeroes[category];

  return (
    <section className={`category-hero category-hero--${category}`} aria-labelledby={`${category}-title`}>
      <div className="category-hero-layout">
        <div className="category-hero-copy">
          <h1 className="category-hero-title" id={`${category}-title`}>{content.title}</h1>
          <p className="category-hero-description">{content.description}</p>
          <a className="category-hero-back" href="#work">&lt;&lt; Go back for more projects</a>
          <div className="category-hero-services" aria-label={`${content.title.toLowerCase()} services`}>
            {content.services.map(({ icon, label }) => (
              <span key={label}>
                <img src={assetUrl(icon)} alt="" />
                <span className={label.includes("\n") ? "category-hero-service-label has-line-breaks" : "category-hero-service-label"}>
                  {label.includes("\n") ? label.split("\n").map((line) => <span key={line}>{line}</span>) : label}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className={`category-hero-art category-hero-art--${category}`} aria-hidden="true">
          <div className="category-hero-art-pair">
            <img className="category-hero-sketch" src={assetUrl(content.sketch)} alt="" />
            <img className="category-hero-object" src={assetUrl(content.object)} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
