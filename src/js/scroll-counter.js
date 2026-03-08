const counterSections = Array.from(
  document.querySelectorAll("[data-has-counters]"),
);

const options = {
  root: null,
  rootMargin: "0px 0px -20% 0px",
  threshold: 0,
};

let observer;

function startCountersIn(section) {
  const counterElements = Array.from(
    section.querySelectorAll('[data-js="counter"]'),
  );
  const counters = counterElements.map((el) => new Counter(el));
  counters.forEach((c) => c.start());
}

const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      startCountersIn(entry.target);
      observer.unobserve(entry.target);
    }
  });
};

function createObserver() {
  observer = new IntersectionObserver(callback, options);
  counterSections.forEach((section) => observer.observe(section));
}

createObserver();

class Counter {
  constructor(element) {
    this.element = element;
    this.currentValue = 0;
    this.targetValue = Number(element.dataset.counterTarget ?? 0);
    this.format = element.dataset.counterFormat ?? "with-plus";
    this.animationDurationMs = 900;
    this.startTime = 0;
    this.rafId = null;
  }

  formatValue(value) {
    return this.format === "plain" ? String(value) : `+${value}`;
  }

  start() {
    if (!Number.isFinite(this.targetValue) || this.targetValue <= 0) return;

    this.startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min(
        (now - this.startTime) / this.animationDurationMs,
        1,
      );
      const nextValue = Math.floor(progress * this.targetValue);

      if (nextValue !== this.currentValue) {
        this.currentValue = nextValue;
        this.element.textContent = this.formatValue(nextValue);
      }

      if (progress < 1) this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }
}
