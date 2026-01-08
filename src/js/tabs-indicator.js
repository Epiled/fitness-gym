const plans = document.querySelector('[data-js="plans-table"]');

const tabs = plans.querySelectorAll('[data-js="plans-tab"]');

let selected = tabs[1] ?? tabs[0];

const indicator = document.createElement("span");
indicator.classList.add("plans__indicator");
plans.appendChild(indicator);

function moveIndicatorTo(item) {
  selected = item;
  indicator.style.transform = `translateX(${item.offsetLeft}px)`;
  indicator.style.width = `${item.offsetWidth}px`;
}

moveIndicatorTo(selected);

tabs.forEach((item) => {
  item.addEventListener("click", () => {
    moveIndicatorTo(item);
  });
});

window.addEventListener("resize", () => {
  moveIndicatorTo(selected);
});
