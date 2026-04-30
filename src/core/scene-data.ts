import manifest from "../assets/asset-manifest.json";
import type { SectionDefinition, VisualAsset } from "./types";

const imageModules = import.meta.glob("../assets/raw/*.png", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const fallbackAsset = imageModules["../assets/raw/asset-001.png"] ?? "";

export const visualAssets: VisualAsset[] = manifest.map((entry) => ({
  id: entry.id,
  src: imageModules[`../assets/${entry.file}`] ?? fallbackAsset,
  alt: entry.original
}));

const folderIndexMap = new Map<string, number[]>();
manifest.forEach((entry, index) => {
  const folder = entry.original.includes("/") ? entry.original.split("/")[0] : "root";
  const list = folderIndexMap.get(folder) ?? [];
  list.push(index);
  folderIndexMap.set(folder, list);
});

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

const sectionAssets: Record<SectionDefinition["id"], number[]> = {
  hero: [...(folderIndexMap.get("Logo and Navbar") ?? []), ...(folderIndexMap.get("Buttons") ?? [])],
  about: [...(folderIndexMap.get("Service Blocks Screenshots Gallery") ?? [])],
  features: [...(folderIndexMap.get("Feature Blocks") ?? []), ...(folderIndexMap.get("Decorative frames") ?? [])],
  mechanics: [...(folderIndexMap.get("Mechanic Blocks") ?? []), ...(folderIndexMap.get("Icons Elements") ?? [])],
  modes: [...(folderIndexMap.get("Icons Elements") ?? []), ...(folderIndexMap.get("Status panel") ?? [])],
  tech: [...(folderIndexMap.get("Progress Bars") ?? []), ...(folderIndexMap.get("Connecting to the server") ?? [])],
  connect: [...(folderIndexMap.get("Connecting to the server") ?? []), ...(folderIndexMap.get("Buttons") ?? [])],
  social: [...(folderIndexMap.get("Service Blocks Screenshots Gallery") ?? []), ...(folderIndexMap.get("root") ?? [])]
};

export const sections: SectionDefinition[] = sectionIds.map((id, index) => ({
  id,
  label: labels[index],
  title: titles[index],
  description: descriptions[index],
  assetIndexes: sectionAssets[id].length ? sectionAssets[id] : [index]
}));
