import type { SceneSectionId } from "./types";

export class SceneEngine {
  private readonly sections: HTMLElement[];
  private readonly navButtons: HTMLButtonElement[];
  private current = 0;
  private target = 0;
  private y = 0;
  private raf = 0;
  private ticking = false;

  constructor(private readonly root: HTMLElement) {
    this.sections = Array.from(root.querySelectorAll<HTMLElement>(".scene-section"));
    this.navButtons = Array.from(root.querySelectorAll<HTMLButtonElement>(".scene-nav__button"));
  }

  init(): void {
    this.bindInput();
    this.bindNav();
    this.observeSections();
    this.animate();
  }

  private bindInput(): void {
    window.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        this.target += event.deltaY * 0.85;
        this.limitTarget();
      },
      { passive: false }
    );

    let startY = 0;
    window.addEventListener("touchstart", (event) => {
      startY = event.touches[0]?.clientY ?? 0;
    });
    window.addEventListener(
      "touchmove",
      (event) => {
        const nextY = event.touches[0]?.clientY ?? startY;
        const delta = (startY - nextY) * 1.3;
        startY = nextY;
        this.target += delta;
        this.limitTarget();
      },
      { passive: true }
    );

    window.addEventListener("resize", () => this.limitTarget());
  }

  private bindNav(): void {
    this.navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.target as SceneSectionId | undefined;
        if (!id) return;
        const index = this.sections.findIndex((section) => section.id === id);
        if (index === -1) return;
        this.scrollTo(index);
      });
    });
  }

  private observeSections(): void {
    this.sections.forEach((section, index) => {
      if (index <= 1) section.classList.add("is-visible");
    });
  }

  scrollTo(index: number): void {
    const top = index * window.innerHeight;
    this.target = top;
    this.current = index;
    this.updateNav();
  }

  private limitTarget(): void {
    const max = Math.max(0, this.sections.length * window.innerHeight - window.innerHeight);
    this.target = Math.min(max, Math.max(0, this.target));
  }

  private animate = (): void => {
    this.y += (this.target - this.y) * 0.09;
    this.root.style.transform = `translate3d(0, ${-this.y}px, 0)`;
    const next = Math.round(this.y / window.innerHeight);
    if (next !== this.current) {
      this.current = next;
      this.updateNav();
      this.updateSectionVisibility();
      window.dispatchEvent(new CustomEvent("scene:change", { detail: { index: this.current } }));
    }
    this.raf = window.requestAnimationFrame(this.animate);
    this.ticking = true;
  };

  private updateNav(): void {
    this.navButtons.forEach((button, index) => {
      button.classList.toggle("is-active", index === this.current);
    });
  }

  private updateSectionVisibility(): void {
    this.sections.forEach((section, index) => {
      section.classList.toggle("is-visible", Math.abs(index - this.current) <= 1);
    });
  }

  destroy(): void {
    if (this.ticking) {
      window.cancelAnimationFrame(this.raf);
      this.ticking = false;
    }
  }
}
