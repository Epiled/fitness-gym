
import { revelsMarcados } from "./revel.js";
import { contadorMarcados } from "./contador.js";
import { flipsMarcados } from "./flipe.js";

const alturaDeAtivacao = window.innerHeight * .8;

window.addEventListener('scroll', () => {
  revelsMarcados.revelAnimation(alturaDeAtivacao);
  flipsMarcados.flip(alturaDeAtivacao);
});

revelsMarcados.revelAnimation(alturaDeAtivacao);
contadorMarcados.preparaContadores(alturaDeAtivacao);
