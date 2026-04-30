import "../styles/global.css";
import "../styles/animations.css";
import { bootParticles } from "./animations/particles";
import { createSceneLayout } from "./components/scene-builder";
import { sections, visualAssets } from "./core/scene-data";
import { preloadCriticalAssets, setupAntiCopyLayer, setupLazyAssets, setupParallax } from "./utils/experience";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Root element #app not found");
}

const scene = createSceneLayout(sections, visualAssets);
app.append(scene);

setupAntiCopyLayer();
setupParallax();
setupLazyAssets();
preloadCriticalAssets(12);
bootParticles();
