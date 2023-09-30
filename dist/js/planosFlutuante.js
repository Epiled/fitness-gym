const tabela = document.querySelector('[data-tabela]');
const tabelaCabecas = tabela.querySelectorAll('[data-tabela-cabeca]');

const flutuante = document.createElement('span');
flutuante.classList.add('planos__flutuante');

const posicaoFlutuante = calculaDistanciaEsquerdaDaTela(tabelaCabecas[1]);

tabelaCabecas.forEach(item => {
  item.addEventListener('click', () => {
    calculaDistanciaEsquerdaDaTela(item);
  })
});

window.addEventListener('resize', () => {
  calculaDistanciaEsquerdaDaTela(tabelaCabecas[1]);
})

function calculaDistanciaEsquerdaDaTela(item) {
  const distanciaPorcentagem = (item.offsetLeft / window.innerWidth) * 100;
  const novaPosicao = flutuante.style.transform = `translateX(${distanciaPorcentagem + 'vw'})`;

  return novaPosicao;
}

tabela.appendChild(flutuante);
