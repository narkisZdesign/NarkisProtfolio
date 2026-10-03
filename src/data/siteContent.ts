import {
  FaArrowRight,
  FaBoxesStacked,
  FaBullseye,
  FaClock,
  FaCube,
  FaLightbulb,
  FaMagnifyingGlass,
  FaPenNib,
  FaRegLightbulb,
  FaRulerCombined,
  FaShirt,
  FaVideo,
} from "react-icons/fa6";
import {
  TbBrandAdobeAfterEffect,
  TbBrandAdobeIllustrator,
  TbBrandAdobeIndesign,
  TbBrandAdobePhotoshop,
  TbBrandAdobePremiere,
  TbBrandAdobeXd,
  TbBrandFigma,
  TbLayoutDashboard,
  TbPackage,
  TbPalette,
  TbSeo,
} from "react-icons/tb";
import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  href: string;
};

export type Category = {
  title: string;
  label?: string;
  href: string;
  visual: {
    background: string;
    object?: string;
    video?: string;
    objectAlt: string;
  };
};

export type Service = {
  title: string;
  description: string;
  icon: string;
  iconCrop: { width: number; height: number; left: number; top: number };
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: IconType;
};

export type ToolItem = {
  label: string;
  icon: IconType;
  className: string;
};

export type ValueItem = {
  title: string;
  description: string;
  icon: IconType;
};

export type PackagingApproach = {
  title: string;
  description: string;
  icon: IconType;
};

export type PackagingProject = {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  description: string;
  comparison: {
    before: string;
    after: string;
    beforeAlt: string;
    afterAlt: string;
  };
  approach: PackagingApproach[];
  variants: {
    src: string;
    alt: string;
  }[];
  storeImages: {
    src: string;
    alt: string;
  }[];
  systemImages: {
    src: string;
    alt: string;
  }[];
};

export const assetUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const siteConfig = {
  name: "Narkis Zur",
  logo: "assets/brand/narkis-logo-white.png",
  email: "narkis300@gmail.com",
  phone: "050-4225510",
  phoneUrl: "tel:+972504225510",
  heroTitle: "Narkis Zur",
  heroSubtitle: "Visual storyteller & problem solver.",
  heroBody: "I turn ideas into meaningful designs that connect.",
  aboutHeadline: "Creative mind.\nOrganized process.\nMeaningful results.",
  ctaLabel: "WhatsApp",
  contactUrl: "https://wa.me/972504225510",
  workLabel: "View my work",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
];

export const categories: Category[] = [
  {
    title: "Packaging",
    href: "#packaging",
    visual: {
      background: assetUrl("assets/categories/packaging-sketch.webp"),
      object: assetUrl("assets/categories/packaging.webp"),
      video: assetUrl("assets/categories/packaging.mp4"),
      objectAlt: "Sage green packaging box",
    },
  },
  {
    title: "Fashion",
    href: "#fashion",
    visual: {
      background: assetUrl("assets/categories/fashion-sketch.webp"),
      video: assetUrl("assets/categories/fashion-hover.mp4"),
      objectAlt: "Sage green shirt",
    },
  },
  {
    title: "Products",
    href: "#products",
    visual: {
      background: assetUrl("assets/categories/products-sketch.webp"),
      object: assetUrl("assets/categories/products-loop.webp"),
      video: assetUrl("assets/categories/products-loop.mp4"),
      objectAlt: "Sage green product display",
    },
  },
  {
    title: "Branding",
    href: "#branding",
    visual: {
      background: assetUrl("assets/categories/branding-sketch.webp"),
      object: assetUrl("assets/categories/branding.webp"),
      video: assetUrl("assets/categories/branding.mp4"),
      objectAlt: "NZ brand seal",
    },
  },
];

export const packagingProjects: PackagingProject[] = [
  {
    id: "minene-developmental-toys",
    title: "Desert Love & Ocean Secrets",
    subtitle: "Developmental toys line",
    client: "Minene",
    description:
      "Packaging design for a line of developmental activity gyms that support babies' motor and cognitive development.",
    comparison: {
      before: assetUrl("assets/packaging/Pink_Store_Development_matt.png"),
      after: assetUrl("assets/packaging/Blue_Store_Development_matt.png"),
      beforeAlt: "Pink Minene developmental activity gym packaging in store",
      afterAlt: "Blue Minene developmental activity gym packaging in store",
    },
    approach: [
      {
        title: "Inspired by nature",
        description: "Desert and ocean worlds brought to life in soft, neutral tones.",
        icon: FaRegLightbulb,
      },
      {
        title: "Development first",
        description: "Packaging communicates the product benefits and activities clearly.",
        icon: FaBullseye,
      },
      {
        title: "Gentle & modern",
        description: "A calm visual language that feels warm and trustworthy.",
        icon: TbPalette,
      },
      {
        title: "Shelf impact",
        description: "Clean structure, large window and clear hierarchy for retail presence.",
        icon: TbPackage,
      },
    ],
    variants: [
      {
        src: assetUrl("assets/packaging/Pink_Development_matt.png"),
        alt: "Pink developmental activity gym packaging",
      },
      {
        src: assetUrl("assets/packaging/Blue_Development_matt.png"),
        alt: "Blue developmental activity gym packaging",
      },
      {
        src: assetUrl("assets/packaging/Developmental_book_toy.png"),
        alt: "Developmental book toy packaging",
      },
      {
        src: assetUrl("assets/packaging/Developmental_cube_toy.png"),
        alt: "Developmental cube toy packaging",
      },
      {
        src: assetUrl("assets/packaging/Hanging_Development_matt.png"),
        alt: "Hanging developmental toy packaging",
      },
    ],
    storeImages: [
      {
        src: assetUrl("assets/packaging/Pink_Store_Development_matt.png"),
        alt: "Pink developmental activity gym packaging on shelf",
      },
      {
        src: assetUrl("assets/packaging/Blue_Store_Development_matt.png"),
        alt: "Blue developmental activity gym packaging on shelf",
      },
    ],
    systemImages: [
      {
        src: assetUrl("assets/packaging/Box_layout.jpg"),
        alt: "Packaging dieline and structural layout",
      },
      {
        src: assetUrl("assets/packaging/box_icon_layout.png"),
        alt: "Packaging icon layout and assembly details",
      },
      {
        src: assetUrl("assets/packaging/box_icon.png"),
        alt: "Packaging icon system detail",
      },
    ],
  },
];

export const services: Service[] = [
  {
    title: "Brand Identity",
    description: "Logos, systems & visual language",
    icon: "assets/services/Brand.jpg",
    iconCrop: { width: 111.8, height: 116.1, left: -5.63, top: -5.9 },
  },
  {
    title: "Print & Packaging",
    description: "Brochures, labels & packaging",
    icon: "assets/services/Packaging.jpg",
    iconCrop: { width: 113.94, height: 118.32, left: -6.97, top: -11.08 },
  },
  {
    title: "Digital Design",
    description: "Web, UI & digital experiences",
    icon: "assets/services/Digital.png",
    iconCrop: { width: 104.61, height: 108.63, left: -2.56, top: -3.06 },
  },
  {
    title: "Illustration",
    description: "Custom artwork\n& details",
    icon: "assets/services/Illustration.png",
    iconCrop: { width: 130.57, height: 135.59, left: -12.77, top: -13.72 },
  },
  {
    title: "Video & Motion",
    description: "Editing, motion & storytelling",
    icon: "assets/services/Video.png",
    iconCrop: { width: 136.23, height: 131.33, left: -19.73, top: -15.47 },
  },
  {
    title: "Fashion Design",
    description: "Tech packs, patterns & collections",
    icon: "assets/services/Fashion.png",
    iconCrop: { width: 107.11, height: 111.23, left: -3.82, top: -2.27 },
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Research & define the problem",
    icon: FaRegLightbulb,
  },
  {
    number: "02",
    title: "Ideate",
    description: "Explore ideas & concepts",
    icon: FaLightbulb,
  },
  {
    number: "03",
    title: "Design",
    description: "Craft visuals & solutions",
    icon: FaRulerCombined,
  },
  {
    number: "04",
    title: "Develop",
    description: "Refine & prepare for production",
    icon: FaCube,
  },
  {
    number: "05",
    title: "Deliver",
    description: "Final assets & support",
    icon: TbSeo,
  },
  {
    number: "06",
    title: "Impact",
    description: "Results that make a difference",
    icon: FaBullseye,
  },
];

export const tools: ToolItem[] = [
  { label: "Photoshop", icon: TbBrandAdobePhotoshop, className: "tool-ps" },
  { label: "Illustrator", icon: TbBrandAdobeIllustrator, className: "tool-ai" },
  { label: "InDesign", icon: TbBrandAdobeIndesign, className: "tool-id" },
  { label: "After Effects", icon: TbBrandAdobeAfterEffect, className: "tool-ae" },
  { label: "Premiere Pro", icon: TbBrandAdobePremiere, className: "tool-pr" },
  { label: "Adobe XD", icon: TbBrandAdobeXd, className: "tool-xd" },
  { label: "Figma", icon: TbBrandFigma, className: "tool-figma" },
  { label: "Packaging", icon: FaBoxesStacked, className: "tool-pack" },
];

export const values: ValueItem[] = [
  {
    title: "Strategic Thinking",
    description: "Purpose-driven design that solves real problems.",
    icon: FaLightbulb,
  },
  {
    title: "Creative Process",
    description: "From sketches to solutions, a clear and collaborative journey.",
    icon: FaPenNib,
  },
  {
    title: "Detail Focused",
    description: "Thoughtful details that elevate every outcome.",
    icon: FaMagnifyingGlass,
  },
  {
    title: "On-Time Delivery",
    description: "Reliable partner committed to your goals.",
    icon: FaClock,
  },
];

export const arrowIcon = FaArrowRight;
