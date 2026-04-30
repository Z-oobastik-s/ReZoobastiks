import manifest from "../assets/asset-manifest.json";
import type { SectionDefinition, VisualAsset } from "./types";

const imageModules = import.meta.glob("../assets/raw/*.png", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const sortedAssetFiles = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b, "en"))
  .map(([, value]) => value);

export const visualAssets: VisualAsset[] = manifest.map((entry, index) => ({
  id: entry.id,
  src: sortedAssetFiles[index],
  alt: entry.original
}));

const sectionIds: SectionDefinition["id"][] = [
  "hero",
  "about",
  "features",
  "mechanics",
  "modes",
  "tech",
  "connect",
  "social"
];

const labels = ["Главная", "О сервере", "Фишки", "Механики", "Режимы", "Тех", "IP", "Соцсети"];

const titles = [
  "ReZoobastiks",
  "Сервер с атмосферой лаунчера",
  "Особенности, которые цепляют",
  "Глубокие игровые механики",
  "PvP, кланы и прогресс",
  "Стабильность и производительность",
  "Подключение за 30 секунд",
  "Комьюнити и медиа"
];

const descriptions = [
  "Кинематографичный старт с живым UI и неоновыми эффектами.",
  "Собственная экосистема, продуманный баланс и визуальный стиль.",
  "Карточки и инфо-блоки с акцентом на уникальность контента.",
  "Продвинутая экономика, кастомные системы и PvE активности.",
  "Рейтинги, арены, клановые войны и сезонные события.",
  "Оптимизированные тики, античит и быстрые игровые отклики.",
  "Скопируй IP, изучи правила и начни игру без лишних шагов.",
  "Telegram, Discord и актуальные новости сервера."
];

const assetsPerSection = Math.ceil(visualAssets.length / sectionIds.length);

export const sections: SectionDefinition[] = sectionIds.map((id, index) => {
  const start = index * assetsPerSection;
  const end = Math.min(start + assetsPerSection, visualAssets.length);
  const assetIndexes = Array.from({ length: Math.max(end - start, 1) }, (_, i) => start + i).filter(
    (assetIndex) => assetIndex < visualAssets.length
  );

  return {
    id,
    label: labels[index],
    title: titles[index],
    description: descriptions[index],
    assetIndexes
  };
});
