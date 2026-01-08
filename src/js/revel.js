const items = document.querySelectorAll('[data-js="scroll-reveal"]');

// Initial state
items.forEach((el) => (el.dataset.state ??= "hidden"));

const options = {
  root: null,
  rootMargin: "0px 0px -20% 0px",
  threshold: 0,
};

let observer;

const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let elem = entry.target;
      elem.dataset.state = "visible";
      observer.unobserve(entry.target);
    }
  });
};

function createObserver() {
  observer = new IntersectionObserver(callback, options);

  items.forEach((el) => {
    if (el.dataset.state !== "visible") observer.observe(el);
  });
}

createObserver();
