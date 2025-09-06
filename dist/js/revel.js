const revels = document.querySelectorAll('[data-animation]');

function revelAnimation(gatilho) {
  revels.forEach((item, i) => {
    const itemPosicao = item.getBoundingClientRect().top;
    let controleAnimacao = itemPosicao <= gatilho;

    if(controleAnimacao) {
      item.classList.add('active');
    }
  });
}

export const revelsMarcados = {
  revels,
  revelAnimation,
}

revelAnimation();