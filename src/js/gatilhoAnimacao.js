import { contadorMarcados } from "./contador.js";
import { flipsMarcados } from "./flipe.js";
import "./revel.js";

const alturaDeAtivacao = window.innerHeight * 0.8;

window.addEventListener("scroll", () => {
  flipsMarcados.flip(alturaDeAtivacao);
});

contadorMarcados.preparaContadores(alturaDeAtivacao);
