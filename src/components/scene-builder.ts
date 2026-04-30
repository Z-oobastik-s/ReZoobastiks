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

  const overlay = document.createElement("div");
  overlay.className = "poster-overlay";

  const panel = document.createElement("aside");
  panel.className = "interaction-panel";
  panel.innerHTML = `
    <h2>ReZoobastiks Panel</h2>
    <p class="interaction-panel__desc">Нажми на зоны прямо на постере.</p>
    <div class="interaction-panel__gallery"></div>
  `;
  const panelDesc = panel.querySelector<HTMLParagraphElement>(".interaction-panel__desc");
  const gallery = panel.querySelector<HTMLDivElement>(".interaction-panel__gallery");

  const groups = {
    nav: assets.filter((asset) => asset.alt.startsWith("Logo and Navbar/кнопка_")),
    features: assets.filter((asset) => asset.alt.startsWith("Feature Blocks/")),
    mechanics: assets.filter((asset) => asset.alt.startsWith("Mechanic Blocks/")),
    tech: assets.filter((asset) => asset.alt.startsWith("Status panel/") || asset.alt.startsWith("Progress Bars/")),
    connect: assets.filter(
      (asset) => asset.alt.startsWith("Connecting to the server/") || asset.alt.includes("копировать_айпи")
    )
  };

  const drawGallery = (list: VisualAsset[], title: string): void => {
    if (panelDesc) panelDesc.textContent = title;
    if (!gallery) return;
    gallery.innerHTML = "";
    list.slice(0, 8).forEach((asset) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "interaction-chip";
      chip.innerHTML = `<img src="${asset.src}" alt="${asset.alt}" draggable="false" />`;
      gallery.append(chip);
    });
  };

  const hotspots = [
    { id: "nav", label: "Навигация", x: 24, y: 4, w: 52, h: 10, text: "Кнопки меню и запуск игры." },
    { id: "features", label: "Особенности", x: 4, y: 55, w: 92, h: 16, text: "Ключевые фишки сервера." },
    { id: "mechanics", label: "Механики", x: 4, y: 70, w: 92, h: 16, text: "PvP, приват, экономика и системы." },
    { id: "tech", label: "Тех блок", x: 4, y: 84, w: 92, h: 8, text: "Статус, TPS и стабильность." },
    { id: "connect", label: "Подключение", x: 20, y: 90, w: 60, h: 8, text: "IP и вход в сообщество." }
  ];

  hotspots.forEach((spot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    if (index === 0) button.classList.add("is-active");
    button.style.left = `${spot.x}%`;
    button.style.top = `${spot.y}%`;
    button.style.width = `${spot.w}%`;
    button.style.height = `${spot.h}%`;
    button.innerHTML = `<span>${spot.label}</span>`;

    button.addEventListener("click", async () => {
      overlay.querySelectorAll(".hotspot").forEach((node) => node.classList.remove("is-active"));
      button.classList.add("is-active");

      if (spot.id === "connect") {
        try {
          await navigator.clipboard.writeText("zoobastiks.20tps.name");
          if (panelDesc) panelDesc.textContent = "IP скопирован: zoobastiks.20tps.name";
        } catch {
          if (panelDesc) panelDesc.textContent = "IP: zoobastiks.20tps.name";
        }
      } else {
        const source = groups[spot.id as keyof typeof groups] ?? [];
        drawGallery(source, spot.text);
      }
    });

    overlay.append(button);
  });

  drawGallery(groups.nav, "Кнопки меню и запуск игры.");
  frame.append(posterImage, overlay);
  root.append(frame);
  root.append(panel);
  return root;
}
