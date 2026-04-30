import type { SectionDefinition, VisualAsset } from "../core/types";

export function createSceneLayout(sections: SectionDefinition[], assets: VisualAsset[]): HTMLElement {
  void sections;
  const root = document.createElement("main");
  root.className = "poster-root";

  const frame = document.createElement("section");
  frame.className = "poster-frame";

  const poster = assets.find((asset) => asset.alt.includes("как_я_хочу_чтобы_выглядел_наш_сайт"));
  const fallback = assets[0];

  const posterImage = document.createElement("img");
  posterImage.className = "poster-main";
  posterImage.src = poster?.src ?? fallback.src;
  posterImage.alt = "ReZoobastiks cinematic layout";
  posterImage.draggable = false;

  const nav = document.createElement("nav");
  nav.className = "poster-nav";
  const navAssets = assets.filter((asset) => asset.alt.startsWith("Logo and Navbar/кнопка_"));
  navAssets.slice(0, 8).forEach((asset) => {
    const button = document.createElement("button");
    button.className = "poster-nav__button";
    button.type = "button";
    const image = document.createElement("img");
    image.src = asset.src;
    image.alt = asset.alt;
    image.draggable = false;
    button.append(image);
    nav.append(button);
  });

  const cta = document.createElement("div");
  cta.className = "poster-cta";
  const ctaAsset = assets.find((asset) => asset.alt.includes("кнопка_копировать_айпи")) ?? fallback;
  cta.innerHTML = `<h1>ReZoobastiks</h1><p>Сайт собран из PNG как UI-конструктор.</p>`;
  const ctaImg = document.createElement("img");
  ctaImg.src = ctaAsset.src;
  ctaImg.alt = ctaAsset.alt;
  ctaImg.draggable = false;
  cta.append(ctaImg);

  frame.append(posterImage, nav, cta);
  root.append(frame);
  return root;
}
