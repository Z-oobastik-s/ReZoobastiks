export function preloadCriticalAssets(count = 10): void {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-src]")).slice(0, count);
  imgs.forEach((img) => {
    const src = img.dataset.src;
    if (!src) return;
    const pre = new Image();
    pre.src = src;
  });
}

export function setupLazyAssets(): void {
  const sectionImages = Array.from(document.querySelectorAll<HTMLElement>(".scene-section")).map((section) =>
    Array.from(section.querySelectorAll<HTMLImageElement>("img[data-src]"))
  );

  const loadSection = (sectionIndex: number): void => {
    const images = sectionImages[sectionIndex] ?? [];
    images.forEach((img) => {
      if (img.src) return;
      const src = img.dataset.src;
      if (src) img.src = src;
    });
  };

  loadSection(0);
  loadSection(1);

  window.addEventListener("scene:change", (event) => {
    const index = Number((event as CustomEvent<{ index: number }>).detail?.index ?? 0);
    loadSection(index - 1);
    loadSection(index);
    loadSection(index + 1);
  });
}

export function setupAntiCopyLayer(): void {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("dragstart", (event) => event.preventDefault());
  document.addEventListener("copy", (event) => event.preventDefault());
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && ["c", "u", "s"].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
    if (event.key === "F12") event.preventDefault();
  });
}

export function setupParallax(): void {
  if (window.innerWidth < 1024) return;
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".interactive")).slice(0, 24);
  let raf = 0;
  window.addEventListener("mousemove", (event) => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = (event.clientX - centerX) / centerX;
      const y = (event.clientY - centerY) / centerY;
      cards.forEach((card) => {
        const depth = Number(card.dataset.depth ?? 1);
        card.style.setProperty("--px", `${x * depth * 8}px`);
        card.style.setProperty("--py", `${y * depth * 8}px`);
      });
    });
  });
}
