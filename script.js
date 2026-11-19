// --- Estado de la calculadora ---
let actual = "0";        // número que se está escribiendo
let anterior = null;     // primer operando guardado
let operador = null;     // operación pendiente
let reiniciar = false;   // true: el próximo dígito empieza un número nuevo

// --- Operaciones disponibles ---
const operaciones = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
};

const pantalla = document.getElementById("pantalla");

// --- Funciones de la calculadora ---
function escribirDigito(digito) {
  actual = reiniciar || actual === "0" ? digito : actual + digito;
  reiniciar = false;
}

function escribirDecimal() {
  if (reiniciar) actual = "0";
  if (!actual.includes(".")) actual += ".";
  reiniciar = false;
}

function elegirOperador(nuevoOperador) {
  if (actual === "Error") return;
  if (operador && !reiniciar) calcular(); // encadena: 2 + 3 + ...
  anterior = actual;
  operador = nuevoOperador;
  reiniciar = true;
}

function calcular() {
  if (!operador) return;
  const resultado = operaciones[operador](Number(anterior), Number(actual));
  // Division entre 0 => Infinity/NaN => mostramos "Error"
  actual = Number.isFinite(resultado) ? String(+resultado.toFixed(10)) : "Error";
  operador = null;
  reiniciar = true;
}

function borrarUltimo() {
  if (reiniciar || actual === "Error") return;
  actual = actual.length > 1 ? actual.slice(0, -1) : "0";
}

function limpiar() {
  actual = "0";
  anterior = null;
  operador = null;
  reiniciar = false;
}

function porcentaje() {
  if (actual !== "Error") actual = String(Number(actual) / 100);
}

function cambiarSigno() {
  if (actual !== "Error" && actual !== "0") {
    actual = actual.startsWith("-") ? actual.slice(1) : "-" + actual;
  }
}

// --- Control de eventos ---
// Cada boton indica su accion en data-tipo y su valor en data-valor
const acciones = {
  digito:     (valor) => escribirDigito(valor),
  decimal:    () => escribirDecimal(),
  operador:   (valor) => elegirOperador(valor),
  igual:      () => calcular(),
  borrar:     () => borrarUltimo(),
  limpiar:    () => limpiar(),
  porcentaje: () => porcentaje(),
  signo:      () => cambiarSigno(),
};

function pulsar(tipo, valor) {
  acciones[tipo](valor);
  pantalla.textContent = actual;
}

document.getElementById("teclado").addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (boton) pulsar(boton.dataset.tipo, boton.dataset.valor);
});

// Soporte de teclado
document.addEventListener("keydown", (e) => {
  if (/^[0-9]$/.test(e.key)) return pulsar("digito", e.key);
  if (e.key === "." || e.key === ",") return pulsar("decimal");
  if ("+-".includes(e.key)) return pulsar("operador", e.key);
  if (e.key === "*") return pulsar("operador", "×");
  if (e.key === "/") return pulsar("operador", "÷");
  if (e.key === "Enter" || e.key === "=") return pulsar("igual");
  if (e.key === "Backspace") return pulsar("borrar");
  if (e.key === "Escape") return pulsar("limpiar");
});
