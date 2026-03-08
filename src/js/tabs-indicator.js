const plans = document.querySelector('[data-js="plans-table"]');
const tabs = plans.querySelectorAll('[data-js="plans-tab"]');

if (!plans || tabs.length === 0) return;

let selected = tabs[1] ?? tabs[0];

const indicator = document.createElement("span");
indicator.classList.add("plans__indicator");
plans.appendChild(indicator);

let rafId = 0;

function moveIndicatorTo(item) {
  if (!item) return;

  selected = item;

  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    const plansRect = plans.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const left = itemRect.left - plansRect.left;
    const width = itemRect.width;

    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
  });
}

moveIndicatorTo(selected);

tabs.forEach((item) => {
  item.addEventListener("click", () => {
    moveIndicatorTo(item);
  });
});

window.addEventListener(
  "resize",
  () => {
    moveIndicatorTo(selected);
  },
  { passive: true },
);
