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
  variant?: "video" | "placeholder";
  visual: {
    background: string;
    object: string;
    objectHover?: string;
    objectAlt: string;
  };
};

export type Service = {
  title: string;
  description: string;
  icon: IconType;
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
  initials: "NZ",
  email: "hello@narkiszur.com",
  heroTitle: "Narkis Zur",
  heroSubtitle: "Visual storyteller & problem solver.",
  heroBody: "I turn ideas into meaningful designs that connect.",
  aboutHeadline: "Creative mind.\nOrganized process.\nMeaningful results.",
  ctaLabel: "Contact",
  contactUrl: "https://wa.me/972504225510",
  workLabel: "View my work",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const categories: Category[] = [
  {
    title: "Packaging",
    label: "Print & Packaging",
    href: "#packaging",
    variant: "placeholder",
    visual: {
      background: assetUrl("assets/categories/packaging-sketch.svg"),
      object: assetUrl("assets/categories/packaging-object.svg"),
      objectAlt: "Packaging design asset placeholder",
    },
  },
  {
    title: "Fashion",
    label: "Fashion Design",
    href: "#work",
    variant: "placeholder",
    visual: {
      background: assetUrl("assets/categories/fashion-sketch.svg"),
      object: assetUrl("assets/categories/fashion-object.svg"),
      objectAlt: "Fashion design asset placeholder",
    },
  },
  {
    title: "Video",
    label: "Video & Motion",
    href: "#work",
    variant: "video",
    visual: {
      background: assetUrl("assets/video/video_wireframe.jpeg"),
      object: assetUrl("assets/video/gimbal_still.webp"),
      objectHover: assetUrl("assets/video/gimbal_rotate.gif"),
      objectAlt: "Video camera gimbal",
    },
  },
  {
    title: "Branding",
    label: "Brand Identity",
    href: "#work",
    variant: "placeholder",
    visual: {
      background: assetUrl("assets/categories/branding-sketch.svg"),
      object: assetUrl("assets/categories/branding-object.svg"),
      objectAlt: "Branding design asset placeholder",
    },
  },
  {
    title: "Illustration",
    label: "Illustration",
    href: "#work",
    variant: "placeholder",
    visual: {
      background: assetUrl("assets/categories/illustration-sketch.svg"),
      object: assetUrl("assets/categories/illustration-object.svg"),
      objectAlt: "Illustration design asset placeholder",
    },
  },
  {
    title: "Web Design",
    label: "Web Design",
    href: "#work",
    variant: "placeholder",
    visual: {
      background: assetUrl("assets/categories/web-design-sketch.svg"),
      object: assetUrl("assets/categories/web-design-object.svg"),
      objectAlt: "Web design asset placeholder",
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
    icon: TbPalette,
  },
  {
    title: "Print & Packaging",
    description: "Brochures, labels & packaging",
    icon: TbPackage,
  },
  {
    title: "Digital Design",
    description: "Web, UI & digital experiences",
    icon: TbLayoutDashboard,
  },
  {
    title: "Illustration",
    description: "Custom artwork & details",
    icon: FaPenNib,
  },
  {
    title: "Video & Motion",
    description: "Editing, motion & storytelling",
    icon: FaVideo,
  },
  {
    title: "Fashion Design",
    description: "Tech packs, patterns & collections",
    icon: FaShirt,
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
