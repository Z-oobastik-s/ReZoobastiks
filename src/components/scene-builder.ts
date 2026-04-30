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

    section.assetIndexes.forEach((assetIndex, localIndex) => {
      const asset = assets[assetIndex];
      if (!asset) return;

      const figure = document.createElement("figure");
      figure.className = "asset-card interactive";
      figure.style.setProperty("--asset-order", String(localIndex));

      const img = document.createElement("img");
      img.className = "asset-card__img";
      img.dataset.src = asset.src;
      img.alt = asset.alt;
      img.loading = localIndex > 1 ? "lazy" : "eager";
      img.decoding = "async";
      img.draggable = false;

      const caption = document.createElement("figcaption");
      caption.textContent = `${asset.id}`;

      figure.append(img, caption);
      assetsPanel.append(figure);
    });

    sectionNode.append(assetsPanel);
    root.append(sectionNode);
  });

  root.prepend(nav);
  return root;
}
