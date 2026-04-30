import type { SectionDefinition, VisualAsset } from "../core/types";

export function createSceneLayout(sections: SectionDefinition[], assets: VisualAsset[]): HTMLElement {
  const root = document.createElement("main");
  root.className = "scene-root";

  const nav = document.createElement("nav");
  nav.className = "scene-nav";

  sections.forEach((section, index) => {
    const navButton = document.createElement("button");
    navButton.className = "scene-nav__button interactive";
    navButton.dataset.target = section.id;
    navButton.textContent = section.label;
    navButton.setAttribute("aria-label", `Перейти к секции ${section.label}`);
    nav.append(navButton);

    const sectionNode = document.createElement("section");
    sectionNode.className = "scene-section";
    sectionNode.id = section.id;
    sectionNode.dataset.index = String(index);

    const textPanel = document.createElement("article");
    textPanel.className = "scene-card interactive";
    textPanel.innerHTML = `<h2>${section.title}</h2><p>${section.description}</p>`;
    sectionNode.append(textPanel);

    const assetsPanel = document.createElement("div");
    assetsPanel.className = "scene-assets";

    const heroAsset = assets[section.assetIndexes[0]];
    const heroCard = document.createElement("figure");
    heroCard.className = "asset-hero interactive";
    heroCard.dataset.depth = "0.35";
    const heroImage = document.createElement("img");
    heroImage.className = "asset-hero__img";
    heroImage.alt = heroAsset?.alt ?? section.title;
    heroImage.draggable = false;
    const heroCaption = document.createElement("figcaption");
    heroCaption.textContent = section.label;
    if (heroImage && heroAsset) {
      heroImage.dataset.src = heroAsset.src;
    }
    heroCard.append(heroImage, heroCaption);
    assetsPanel.append(heroCard);

    const strip = document.createElement("div");
    strip.className = "asset-strip";

    section.assetIndexes.forEach((assetIndex, localIndex) => {
      const asset = assets[assetIndex];
      if (!asset) return;

      const button = document.createElement("button");
      button.className = "asset-chip interactive";
      button.type = "button";
      button.dataset.assetSrc = asset.src;
      button.dataset.assetAlt = asset.alt;
      button.dataset.depth = "0.18";
      button.innerHTML = `
        <img class="asset-chip__img" alt="${asset.alt}" draggable="false" />
        <span>${asset.alt.split("/").pop() ?? asset.id}</span>
      `;

      const img = button.querySelector<HTMLImageElement>(".asset-chip__img");
      if (img) img.dataset.src = asset.src;

      if (localIndex === 0) button.classList.add("is-active");

      button.addEventListener("click", () => {
        const src = button.dataset.assetSrc;
        const alt = button.dataset.assetAlt ?? "Preview";
        if (heroImage && src) {
          heroImage.src = src;
          heroImage.alt = alt;
        }
        strip.querySelectorAll(".asset-chip").forEach((chip) => chip.classList.remove("is-active"));
        button.classList.add("is-active");
      });

      strip.append(button);
    });

    assetsPanel.append(strip);
    sectionNode.append(assetsPanel);
    root.append(sectionNode);
  });

  root.prepend(nav);
  return root;
}
