let revels = '';

window.addEventListener('scroll', revelAnimation);

revels = document.querySelectorAll('[data-animation]');

function revelAnimation() {
  const alturaDeAtivacao = window.innerHeight * .8;

  revels.forEach((item, i) => {
    const itemPosicao = item.getBoundingClientRect().top;
    let controleAnimacao = itemPosicao <= alturaDeAtivacao;

    if(controleAnimacao) {
      item.classList.add('active');
    }
  });
}

revelAnimation();