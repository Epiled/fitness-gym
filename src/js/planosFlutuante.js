const tabela = document.querySelector('[data-tabela]');
const tabelaCabecas = tabela.querySelectorAll('[data-tabela-cabeca]');

const flutuante = document.createElement('span');
flutuante.classList.add('planos__flutuante');

const posicaoFlutuante = (tabelaCabecas[1].offsetLeft * 100) / window.innerWidth;
flutuante.style.transform = `translateX(${posicaoFlutuante + 'vw'}`;


tabelaCabecas.forEach(item => {
  item.addEventListener('click', () => {
    const posicaoFlutuante = (item.offsetLeft * 100) / window.innerWidth;
    flutuante.style.transform = `translateX(${posicaoFlutuante + 'vw'}`;
  })
})

tabela.appendChild(flutuante);
console.log(tabelaCabecas[0].offsetLeft);