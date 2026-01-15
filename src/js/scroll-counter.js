const contadoresBox = document.querySelector('[data-contador-box]');
const contadores = contadoresBox.querySelectorAll('[data-contador]');

let contadoresMontados = []

function preparaContadores(gatilho) {
  contadores.forEach(item => {
    const limite = item.dataset.contador;
    const posicao = item.getBoundingClientRect().top;
    const contador = new Contador(item, limite, posicao, gatilho);
    contadoresMontados.push(contador);
  });

  const alturaTotal = contadoresBox.getBoundingClientRect().top - contadoresBox.getBoundingClientRect().height;

  if (alturaTotal <= gatilho) {
    verificaPosicao(gatilho);
  }
}

function verificaPosicao() {
  contadoresMontados.forEach(contador => {
    contador.iniciarContagem();
  })
}

class Contador {
  constructor(elemento, limite, posicao, gatilho) {
    this.id = this;
    this.elemento = elemento;
    this.contador = 0;
    this.limite = Number(limite);
    this.duracao = 1;
    this.posicaoTop = posicao;
    this.gatilho = gatilho;
    this.controleAnimacao = this.posicaoTop <= this.gatilho;
    this.intervalo;
  }

  iniciarContagem() {
    this.intervalo = setInterval(() => this.incrementarContador(), (this.duracao * 1000) / this.limite);
  }

  incrementarContador() {
    if (this.contador < this.limite) {
      this.contador++;
      this.elemento.textContent = this.elemento.dataset.contadorAlt == "true" ? this.contador : `+${this.contador}`;
    } else {
      clearInterval(this.intervalo);
    }
  }

  getControleAnimacao() {
    return this.controleAnimacao;
  }

  getContador() {
    return this.contador;
  }
}

export const contadorMarcados = {
  contadores,
  preparaContadores,
  verificaPosicao,
}