import { assetUrl } from "./siteContent";

export const brandingAsset = (file: string) => assetUrl(`assets/branding/${file}`);

export const reefFeatures = [
  { title: "Illustration", description: "Creating every character, scene and visual asset from the ground up.", icon: "f2a83.png" },
  { title: "Brand System", description: "Building one cohesive identity across print and digital platforms.", icon: "75318.png" },
  { title: "Digital Experience", description: "Designing intuitive interfaces and engaging user interactions.", icon: "dbd53.png" },
  { title: "Motion & Media", description: "Bringing the project to life through animation, photography and video.", icon: "f1470.png", crop: true },
];

export const academyFeatures = [
  { title: "Concept & Direction", description: "Building the academy’s time-travel concept and narrative.", icon: "39e26.png", overlay: "c5bf6.png" },
  { title: "Visual Identity", description: "Creating a bold, glitch-inspired and recognizable brand system.", icon: "75318.png" },
  { title: "Print & Promo", description: "Designing branded print materials and promotional assets.", icon: "952d4.png" },
  { title: "Experiential Touchpoints", description: "Creating physical displays and interactive branded elements.", icon: "c2c75.png" },
];

export type ReefArtwork = { id: string; file: string; alt: string; x: number; y: number; w: number; h: number; rotation?: number };

// Original Figma coordinates, relative to each 1920 × 840 scene.
export const digitalArtwork: ReefArtwork[] = [
  { id: "1:25", file: "26b3d.png", alt: "HaShunit aquarium and daily fish care checklist", x: 425, y: 143, w: 530, h: 298 },
  { id: "1:26", file: "454ef.png", alt: "Friendly fish character welcoming children to the platform", x: 900, y: 112, w: 596, h: 336 },
  { id: "1:27", file: "c86aa.png", alt: "Interactive guide to different fish species", x: 918, y: 459, w: 561, h: 316 },
];

export const printArtwork: ReefArtwork[] = [
  { id: "1:17", file: "63544.png", alt: "Illustrated fish care book spread", x: 635, y: 114, w: 325, h: 244 },
  { id: "1:15", file: "71397.png", alt: "Illustrated educational book spread", x: 978, y: 122, w: 307, h: 230 },
  { id: "1:16", file: "8d96d.png", alt: "HaShunit illustrated book introduction", x: 635, y: 313, w: 325, h: 244 },
  { id: "1:20", file: "f5f7b.png", alt: "Fish care alphabet book spread", x: 971, y: 313, w: 320, h: 240 },
  { id: "1:18", file: "19cfe.png", alt: "HaShunit printed book cover", x: 320, y: 396, w: 322, h: 322 },
  { id: "1:19", file: "e3e34.png", alt: "HaShunit activity and sticker book", x: 1278, y: 432, w: 403.011, h: 268.674, rotation: 14.159 },
  { id: "1:14", file: "8581e.png", alt: "Original character and underwater illustration sketches", x: 696, y: 580, w: 528, h: 201 },
];

export const interfaceArtwork: ReefArtwork[] = [
  { id: "1:31", file: "795ee.png", alt: "", x: 17, y: 120, w: 84, h: 92 },
  { id: "1:43", file: "842d1.png", alt: "", x: 101, y: 118, w: 96, h: 93 },
  { id: "1:42", file: "cdf12.png", alt: "", x: 194, y: 118, w: 98, h: 89 },
  { id: "1:41", file: "b9673.png", alt: "", x: 284, y: 116, w: 94, h: 89 },
  { id: "1:30", file: "015f0.png", alt: "", x: 373, y: 114, w: 91, h: 90 },
  { id: "1:35", file: "e4c71.png", alt: "", x: 28, y: 217, w: 48, h: 47 },
  { id: "1:38", file: "92d75.png", alt: "", x: 80, y: 215, w: 49, h: 49 },
  { id: "1:36", file: "c88ff.png", alt: "", x: 132, y: 215, w: 48, h: 47 },
  { id: "1:33", file: "99af6.png", alt: "", x: 184, y: 213, w: 47, h: 47 },
  { id: "1:34", file: "988a7.png", alt: "", x: 235, y: 212, w: 48, h: 47 },
  { id: "1:40", file: "bec4a.png", alt: "", x: 287, y: 209, w: 49, h: 49 },
  { id: "1:39", file: "05347.png", alt: "", x: 339, y: 207, w: 50, h: 50 },
  { id: "1:37", file: "92862.png", alt: "", x: 393, y: 211, w: 60, h: 39 },
];

export const academyPhotos = [
  { id: "2:60", file: "99315.png", alt: "Makbilim branded mug", ratio: "279 / 309" },
  { id: "2:61", file: "c66da.png", alt: "Makbilim academy cap", ratio: "278 / 309", crop: { width: "138.89%", height: "100%", left: "-23.76%", top: "0" } },
  { id: "2:62", file: "7f068.png", alt: "Time-travel academy poster", ratio: "278 / 308", crop: { width: "108.48%", height: "146.57%", left: "-4.32%", top: "0.16%" } },
  { id: "2:58", file: "57832.png", alt: "Academy branded notebook", ratio: "257 / 309", crop: { width: "100%", height: "112.35%", left: "0", top: "-5.86%" } },
  { id: "2:89", file: "28ae6.png", alt: "Makbilim branded bag", ratio: "412 / 274", crop: { width: "113.83%", height: "172.94%", left: "-1.64%", top: "-69.74%" } },
  { id: "2:59", file: "c6ef4.png", alt: "Makbilim branded cookies", ratio: "315 / 274" },
  { id: "2:63", file: "f1182.png", alt: "Printed Makbilim identity materials", ratio: "374 / 275" },
];
