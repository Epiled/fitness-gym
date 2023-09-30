const flips = document.querySelectorAll('[data-flip]');

function flip(gatilho) {
  flips.forEach(item => {
    const itemPosicao = item.getBoundingClientRect().top;
    let controleAnimacao = itemPosicao <= gatilho;
    let controle = item.dataset.flip;

    if (controleAnimacao && controle !== 'false') {
      item.classList.add('active');
    }
    
  })
}

flips.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
    item.dataset.flip = 'false';
  })
})

export const flipsMarcados = {
  flip,
}