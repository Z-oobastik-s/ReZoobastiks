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

  const modal = document.createElement("aside");
  modal.className = "interaction-modal";
  modal.innerHTML = `
    <div class="interaction-modal__header">
      <h2>ReZoobastiks</h2>
      <button type="button" class="interaction-modal__close">x</button>
    </div>
    <p class="interaction-modal__desc"></p>
    <div class="interaction-modal__gallery"></div>
  `;
  const modalDesc = modal.querySelector<HTMLParagraphElement>(".interaction-modal__desc");
  const gallery = modal.querySelector<HTMLDivElement>(".interaction-modal__gallery");
  const closeBtn = modal.querySelector<HTMLButtonElement>(".interaction-modal__close");
  closeBtn?.addEventListener("click", () => modal.classList.remove("is-open"));

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
    if (modalDesc) modalDesc.textContent = title;
    if (!gallery) return;
    gallery.innerHTML = "";
    list.slice(0, 8).forEach((asset) => {
      const chip = document.createElement("a");
      chip.href = "#";
      chip.addEventListener("click", (event) => event.preventDefault());
      chip.className = "interaction-chip";
      chip.innerHTML = `<img src="${asset.src}" alt="${asset.alt}" draggable="false" />`;
      gallery.append(chip);
    });
    modal.classList.add("is-open");
  };

  const hotspots = [
    { id: "nav", x: 24, y: 4, w: 52, h: 10, text: "Кнопки меню и запуск игры." },
    { id: "features", x: 4, y: 55, w: 92, h: 16, text: "Ключевые фишки сервера." },
    { id: "mechanics", x: 4, y: 70, w: 92, h: 16, text: "PvP, приват, экономика и системы." },
    { id: "tech", x: 4, y: 84, w: 92, h: 8, text: "Статус, TPS и стабильность." },
    { id: "connect", x: 20, y: 90, w: 60, h: 8, text: "IP и вход в сообщество." }
  ];

  hotspots.forEach((spot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.style.left = `${spot.x}%`;
    button.style.top = `${spot.y}%`;
    button.style.width = `${spot.w}%`;
    button.style.height = `${spot.h}%`;

    button.addEventListener("click", async () => {
      if (spot.id === "connect") {
        try {
          await navigator.clipboard.writeText("zoobastiks.20tps.name");
          if (modalDesc) modalDesc.textContent = "IP copied: zoobastiks.20tps.name";
        } catch {
          if (modalDesc) modalDesc.textContent = "IP: zoobastiks.20tps.name";
        }
        modal.classList.add("is-open");
      } else {
        const source = groups[spot.id as keyof typeof groups] ?? [];
        drawGallery(source, spot.text);
      }
    });

    overlay.append(button);
  });

  frame.append(posterImage, overlay);
  root.append(frame);
  root.append(modal);
  return root;
}
