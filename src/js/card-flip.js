const items = document.querySelectorAll('[data-js="flip"]');

items.forEach((item) => {
  item.addEventListener("click", () => {
    const faceValue = item.dataset.face;
    item.dataset.face = faceValue === "front" ? "back" : "front";
  });
});
