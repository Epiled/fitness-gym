const btnBurguer = document.querySelector('[data-burguer]');
const btnLinhas = document.querySelectorAll('[data-burguer-linha]');

const navegacao = document.querySelector('[data-navegacao]');

btnBurguer.addEventListener('click', () => {
  btnLinhas.forEach(linha => {
   linha.toggleAttribute('data-burguer-linha-ativo');
  });
  navegacao.classList.toggle('cabecalho__navegacao--ativo');
})