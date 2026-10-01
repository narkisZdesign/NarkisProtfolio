import { assetUrl } from "./siteContent";

export const productAsset = (filename: string) => assetUrl(`assets/products/${filename}`);

// Set this to the horse section's video filename when the footage is ready.
// Example: assetUrl("assets/products/horse.mp4").
export const horseVideoSrc: string | undefined = undefined;

export type ProductCrop = { width: number; height: number; left: number; top: number; flip?: boolean };
export type ProductPhoto = { id: string; file: string; alt: string; crop?: ProductCrop };
export type ProductFeature = { title: string; description: string; icon: string; crop?: ProductCrop };

export const showroomFeatures: ProductFeature[] = [
  { title: "Illustration", description: "Creating every character, scene and visual asset from the ground up.", icon: "39e26.png" },
  { title: "Brand System", description: "Building one cohesive identity across print and digital platforms.", icon: "4c02c.png" },
  { title: "Digital Experience", description: "Designing intuitive interfaces and engaging user interactions.", icon: "363f0.png", crop: { width: 100.2, height: 100, left: -0.1, top: 0 } },
  { title: "Motion & Media", description: "Bringing the project to life through animation, photography and video.", icon: "95f92.png", crop: { width: 100.2, height: 100, left: -0.1, top: 0 } },
];

const displayDescription = "Packaging communicates\n the product’s benefits\n and activities clearly.";
export const displayFeatures: ProductFeature[] = [
  { title: "Concept &\nDirection", description: displayDescription, icon: "c5bf6.png", crop: { width: 110, height: 109.78, left: -5, top: -4.89 } },
  { title: "Visual\nDesign", description: displayDescription, icon: "f2a83.png", crop: { width: 105, height: 104.79, left: -2.5, top: 0.2 } },
  { title: "Production\nFiles", description: displayDescription, icon: "44e8e.png", crop: { width: 117, height: 116.77, left: -8.5, top: -5.79 } },
  { title: "Assembly &\nFinishing", description: displayDescription, icon: "70f78.png", crop: { width: 115, height: 114.77, left: -7.5, top: -4.79 } },
];

export const mirrorFeatures: ProductFeature[] = [
  { title: "Campaign\nConcept", description: "Developing a clear visual idea for the store opening experience.", icon: "c5bf6.png", crop: { width: 104, height: 104, left: -2, top: -2 } },
  { title: "Mirror\nGraphics", description: "Designing the frame, typography and branded visual details.", icon: "2cda6.png", crop: { width: 104, height: 104, left: -2, top: -0.69 } },
  { title: "Call To\nAction", description: "Creating clear messaging that encouraged visitors to photograph, share and tag.", icon: "dbd53.png", crop: { width: 111.92, height: 111.92, left: -5.96, top: -5.19 } },
  { title: "Production\nFiles", description: "Preparing accurate artwork and dimensions for printing and application.", icon: "44e8e.png", crop: { width: 117, height: 117, left: -8.5, top: -7.19 } },
];

export const showroomPhotos: ProductPhoto[] = [
  { id: "1:89", file: "cc626.png", alt: "White sculptural crown prop in the Minene showroom" },
  { id: "1:90", file: "dce53.png", alt: "Scalloped round cream showroom sign", crop: { width: 140.53, height: 189.88, left: -20.1, top: -89.94 } },
  { id: "1:91", file: "f48ba.png", alt: "Custom printed ribbon and decorative showroom props" },
  { id: "1:86", file: "e3db2.png", alt: "White banana sculpture with a branded tag" },
  { id: "1:87", file: "8adea.png", alt: "Close-up of a decorative wand and ribbon" },
  { id: "1:88", file: "9a089.png", alt: "White crown-shaped display surrounded by decorative elements" },
  { id: "1:92", file: "d70f2.png", alt: "Branded Minene signs arranged on showroom shelves" },
];

// Temporary alternate images; replace these with the final hover photographs.
export const showroomHoverFiles = ["e3db2.png", "f48ba.png", "cc626.png", "8adea.png", "9a089.png", "d70f2.png", "cc626.png"];

export const mirrorPhotos: ProductPhoto[] = [
  { id: "1:7", file: "b5dbb.png", alt: "Minene launch mirror beside the shop entrance", crop: { width: 450.85, height: 442.61, left: -238.92, top: -81.99 } },
  { id: "1:8", file: "b91c2.png", alt: "Production artwork and measurements for the branded launch mirror", crop: { width: 103.13, height: 101.24, left: -1.65, top: -0.91 } },
  { id: "1:9", file: "b5dbb.png", alt: "Branded pink photo mirror outside a Minene store", crop: { width: 218.6, height: 214.6, left: -113.99, top: -110.68 } },
];
