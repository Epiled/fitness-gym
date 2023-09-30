// Get the button
let mybutton = document.querySelector("[data-scroll]");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.classList.add('scroll--revel');
  } else {
    mybutton.classList.remove('scroll--revel');
  }
}

// Add function to button
mybutton.addEventListener('click', topFunction);

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}