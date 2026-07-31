// Menú hamburguesa
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
document.getElementById('btnMenu').onclick = () => {
  sidebar.classList.toggle('abierto');
  overlay.classList.toggle('visible');
};
overlay.onclick = () => {
  sidebar.classList.remove('abierto');
  overlay.classList.remove('visible');
};
// Navegación
document.querySelectorAll('.sidebar-item').forEach(item => {
  item.onclick = () => {
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.seccion').forEach(s => s.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.tab).classList.add('active');
    sidebar.classList.remove('abierto');
    overlay.classList.remove('visible');
  };
});

function irAInicio() {
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.seccion').forEach(s => s.classList.remove('active'));
  document.getElementById('bienvenida').classList.add('active');
  sidebar.classList.remove('abierto');
  overlay.classList.remove('visible');
}

function irASeccion(tab) {
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.seccion').forEach(s => s.classList.remove('active'));
  document.querySelector(`.sidebar-item[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(tab).classList.add('active');
}

// ---------- PELÍCULAS ----------
let ordenPeliculas = 'desc';

function alternarOrdenPeliculas() {
  ordenPeliculas = ordenPeliculas === 'desc' ? 'asc' : 'desc';
  document.getElementById('btnOrdenPeliculas').textContent =
    ordenPeliculas === 'desc' ? '↓ Más nueva a más vieja' : '↑ Más vieja a más nueva';
  cargarPeliculas();
}

async function cargarPeliculas() {
  const res = await fetch(`/api/peliculas?orden=${ordenPeliculas}`);
  const datos = await res.json();
  const lista = document.getElementById('listaPeliculas');
  lista.innerHTML = '';
  datos.forEach(p => {
    const li = document.createElement('li');
    if (p.vista) li.classList.add('vista');
    li.innerHTML = `
      <div class="izq">
        <input type="checkbox" ${p.vista ? 'checked' : ''} onchange="marcarVistaPelicula(${p.id}, this.checked)">
        <span>${p.titulo}</span>
      </div>
      <button class="borrar" onclick="borrarPelicula(${p.id})">✕</button>
    `;
    lista.appendChild(li);
  });
}
async function agregarPelicula() {
  const input = document.getElementById('tituloPelicula');
  if (!input.value.trim()) return;
  await fetch('/api/peliculas', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: input.value.trim() })
  });
  input.value = '';
  cargarPeliculas();
}
async function marcarVistaPelicula(id, vista) {
  await fetch(`/api/peliculas/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vista })
  });
  cargarPeliculas();
}
async function borrarPelicula(id) {
  await fetch(`/api/peliculas/${id}`, { method: 'DELETE' });
  cargarPeliculas();
}
// ---------- SERIES ----------
let ordenSeries = 'desc';

function alternarOrdenSeries() {
  ordenSeries = ordenSeries === 'desc' ? 'asc' : 'desc';
  document.getElementById('btnOrdenSeries').textContent =
    ordenSeries === 'desc' ? '↓ Más nueva a más vieja' : '↑ Más vieja a más nueva';
  cargarSeries();
}

async function cargarSeries() {
  const res = await fetch(`/api/series?orden=${ordenSeries}`);
  const datos = await res.json();
  const lista = document.getElementById('listaSeries');
  lista.innerHTML = '';
  datos.forEach(s => {
    const li = document.createElement('li');
    if (s.vista) li.classList.add('vista');
    li.innerHTML = `
      <div class="izq">
        <input type="checkbox" ${s.vista ? 'checked' : ''} onchange="marcarVistaSerie(${s.id}, this.checked)">
        <span>${s.titulo}</span>
      </div>
      <button class="borrar" onclick="borrarSerie(${s.id})">✕</button>
    `;
    lista.appendChild(li);
  });
}
async function agregarSerie() {
  const input = document.getElementById('tituloSerie');
  if (!input.value.trim()) return;
  await fetch('/api/series', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: input.value.trim() })
  });
  input.value = '';
  cargarSeries();
}
async function marcarVistaSerie(id, vista) {
  await fetch(`/api/series/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vista })
  });
  cargarSeries();
}
async function borrarSerie(id) {
  await fetch(`/api/series/${id}`, { method: 'DELETE' });
  cargarSeries();
}
// ---------- CALENDARIO Y RECORDATORIOS ----------
let fechaActual = new Date();
let fechaSeleccionada = null;
let recordatorios = [];
async function cargarRecordatorios() {
  const res = await fetch('/api/recordatorios');
  recordatorios = await res.json();
  dibujarCalendario();
  dibujarListaRecordatorios();
  mostrarRecordatoriosDia();
}
function dibujarCalendario() {
  const anio = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const nombresMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  document.getElementById('mesTitulo').textContent = `${nombresMes[mes]} ${anio}`;
  const grid = document.getElementById('gridDias');
  grid.innerHTML = '';
  ['D','L','M','M','J','V','S'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'dia-nombre';
    el.textContent = d;
    grid.appendChild(el);
  });
  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const hoy = new Date();
  for (let i = 0; i < primerDia; i++) {
    const vacio = document.createElement('div');
    vacio.className = 'dia vacio';
    grid.appendChild(vacio);
  }
  for (let dia = 1; dia <= totalDias; dia++) {
    const fechaStr = `${anio}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
    const celda = document.createElement('div');
    celda.className = 'dia';
    if (fechaStr === fechaSeleccionada) celda.classList.add('seleccionado');
    celda.textContent = dia;
    if (recordatorios.some(r => r.fecha === fechaStr)) celda.classList.add('tiene-evento');
    if (fechaStr === hoy.toISOString().slice(0,10)) celda.classList.add('hoy');
    celda.onclick = () => seleccionarFecha(fechaStr);
    grid.appendChild(celda);
  }
}
function seleccionarFecha(fechaStr) {
  fechaSeleccionada = fechaStr;
  document.getElementById('formRecordatorio').classList.add('visible');
  dibujarCalendario();
  mostrarRecordatoriosDia();
}

function mostrarRecordatoriosDia() {
  const lista = document.getElementById('listaRecordatoriosDia');
  lista.innerHTML = '';
  if (!fechaSeleccionada) {
    lista.classList.remove('visible');
    return;
  }
  const delDia = recordatorios.filter(r => r.fecha === fechaSeleccionada);
  if (delDia.length === 0) {
    lista.classList.remove('visible');
    return;
  }
  lista.classList.add('visible');
  delDia.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${r.texto}</span>
      <button class="borrar" onclick="borrarRecordatorio(${r.id})">✕</button>
    `;
    lista.appendChild(li);
  });
}
async function agregarRecordatorio() {
  const input = document.getElementById('textoRecordatorio');
  if (!input.value.trim() || !fechaSeleccionada) return;
  await fetch('/api/recordatorios', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fecha: fechaSeleccionada, texto: input.value.trim() })
  });
  input.value = '';
  cargarRecordatorios();
}
async function borrarRecordatorio(id) {
  await fetch(`/api/recordatorios/${id}`, { method: 'DELETE' });
  cargarRecordatorios();
}
function dibujarListaRecordatorios() {
  const listaRecordatorios = [...recordatorios].sort((a,b) => a.fecha.localeCompare(b.fecha));
  const listaSolo = document.getElementById('listaRecordatoriosSolo');
  listaSolo.innerHTML = '';
  listaRecordatorios.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div><span class="fecha-tag">${r.fecha}</span>${r.texto}</div>
      <button class="borrar" onclick="borrarRecordatorio(${r.id})">✕</button>
    `;
    listaSolo.appendChild(li);
  });
}
function cambiarMes(delta) {
  fechaActual.setMonth(fechaActual.getMonth() + delta);
  dibujarCalendario();
}
// Inicializar todo
cargarPeliculas();
cargarSeries();
cargarRecordatorios();