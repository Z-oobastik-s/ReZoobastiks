export function preloadCriticalAssets(count = 10): void {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".asset-card__img")).slice(0, count);
  imgs.forEach((img) => {
    const src = img.dataset.src;
    if (!src) return;
    const pre = new Image();
    pre.src = src;
  });
}

export function setupLazyAssets(): void {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>(".asset-card__img"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target as HTMLImageElement;
        if (img.src) return;
        const src = img.dataset.src;
        if (!src) return;
        img.src = src;
        observer.unobserve(img);
      });
    },
    { rootMargin: "260px 0px", threshold: 0.01 }
  );
  images.forEach((img) => observer.observe(img));
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
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".interactive"));
  window.addEventListener("mousemove", (event) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const x = (event.clientX - centerX) / centerX;
    const y = (event.clientY - centerY) / centerY;
    cards.forEach((card) => {
      const depth = Number(card.dataset.depth ?? 1);
      card.style.setProperty("--px", `${x * depth * 10}px`);
      card.style.setProperty("--py", `${y * depth * 10}px`);
    });
  });
}
