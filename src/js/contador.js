let contadores = document.querySelectorAll('[data-contador]');

contadores.forEach(item => {
  let valorContador = 0;
  let intervalo;
  let limiteContador;
  const duracao = 1;

  function comecarContagem() {
    limiteContador = item.dataset.contador;
    clearInterval(intervalo);
    intevalo = setInterval(incrementarContador, (duracao * 1000) / limiteContador);
  }

  function incrementarContador() {
    if (valorContador < limiteContador) {
      valorContador++;
      item.textContent = item.dataset.contadorAlt == "true" ? valorContador : `+${valorContador}`;
    } else {
      clearInterval(intervalo);
    }
  }

  comecarContagem()
})
