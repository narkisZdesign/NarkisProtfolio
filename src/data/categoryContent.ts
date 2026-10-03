export type CategoryId = "packaging" | "fashion" | "products" | "branding";

type CategoryHeroContent = {
  title: string;
  description: string;
  services: { icon: string; label: string }[];
  sketch: string;
  object: string;
};

export const categoryHeroes: Record<CategoryId, CategoryHeroContent> = {
  packaging: {
    title: "PACKAGING",
    description: "Thoughtful packaging design from concept to shelf",
    services: [
      { icon: "assets/packaging/Artboard 1.jpg", label: "Creative Solutions" },
      { icon: "assets/packaging/Artboard 2.jpg", label: "Sustainable Thinking" },
      { icon: "assets/packaging/Artboard 3.jpg", label: "Brand-Focused\nDesign" },
    ],
    sketch: "assets/packaging/box_icon_layout.png",
    object: "assets/packaging/box_icon_cutout.png",
  },
  fashion: {
    title: "FASHION",
    description: "Thoughtful apparel graphics from concept to garment",
    services: [
      { icon: "assets/fashion/intro-garment-icon.png", label: "Garment Design" },
      { icon: "assets/fashion/intro-print-icon.png", label: "Print & Graphics" },
      { icon: "assets/fashion/intro-production-icon.png", label: "Production Ready" },
    ],
    sketch: "assets/fashion/intro-sketch.png",
    object: "assets/fashion/intro-shirt.png",
  },
  products: {
    title: "PRODUCTS",
    description: "Props & displays from concept to\nin-store setup",
    services: [
      { icon: "assets/products/b14ef.png", label: "Concept To Space" },
      { icon: "assets/products/952d4.png", label: "Print & Production" },
      { icon: "assets/products/75318.png", label: "Branded Impact" },
    ],
    sketch: "assets/products/788ba.png",
    object: "assets/products/hero-stand-transparent.png",
  },
  branding: {
    title: "BRANDING",
    description: "A memorable brand from concept to every touchpoint",
    services: [
      { icon: "assets/branding/b14ef.png", label: "Research & Strategy" },
      { icon: "assets/branding/952d4.png", label: "Visual Language" },
      { icon: "assets/branding/75318.png", label: "Consistency" },
    ],
    sketch: "assets/branding/7f15a.png",
    object: "assets/branding/564ac.png",
  },
};
