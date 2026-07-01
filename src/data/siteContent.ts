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
  position: string;
  variant?: "video";
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
  { title: "Packaging", label: "Print & Packaging", href: "#work", position: "0% 0%" },
  { title: "Fashion", label: "Fashion Design", href: "#work", position: "50% 0%" },
  { title: "Video", label: "Video & Motion", href: "#work", position: "100% 0%", variant: "video" },
  { title: "Branding", label: "Brand Identity", href: "#work", position: "0% 100%" },
  { title: "Illustration", label: "Illustration", href: "#work", position: "50% 100%" },
  { title: "Web Design", label: "Web Design", href: "#work", position: "100% 100%" },
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
