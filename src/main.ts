import "../styles/global.css";
import "../styles/animations.css";
import { createSceneLayout } from "./components/scene-builder";
import { sections, visualAssets } from "./core/scene-data";
import { preloadCriticalAssets, setupAntiCopyLayer, setupLazyAssets } from "./utils/experience";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Root element #app not found");
}

const scene = createSceneLayout(sections, visualAssets);
app.append(scene);

setupAntiCopyLayer();
setupLazyAssets();
preloadCriticalAssets(12);
