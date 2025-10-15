const PASSWORD = "123456789";

const defaultPlantas = [
  {
    español: "Manzanilla",
    cientifico: "Matricaria chamomilla",
    usos: "Tranquilizante, digestiva, antiinflamatoria",
    preparacion: "Infusión de flores secas",
    precauciones: "Evitar en personas alérgicas a compuestas",
    evidencia: "Moderada",
    criollo: "Manzanilla",
    usos_criollo: "Kalma, bon pou lestoma, soulaj doulè",
    precauciones_criollo: "Pa sèvi si ou fè alèji ak flè konpoze",
    imagen: ""
  },
  {
    español: "Menta",
    cientifico: "Mentha piperita",
    usos: "Digestiva, expectorante",
    preparacion: "Infusión de hojas frescas",
    precauciones: "Evitar en gastritis o úlceras",
    evidencia: "Alta",
    criollo: "Mènta",
    usos_criollo: "Bon pou lestoma ak frèt",
    precauciones_criollo: "Pa sèvi si ou gen pwoblèm lestoma",
    imagen: ""
  }
];

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const grid = document.getElementById("plantasGrid");
const search = document.getElementById("search");

let plantas = JSON.parse(localStorage.getItem("plantasBilingue")) || defaultPlantas;
render();

document.getElementById("addBtn").onclick = () => {
  if (prompt("Contraseña:") !== PASSWORD) return alert("No autorizado");
  editPlanta();
};

document.getElementById("closeModal").onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
search.oninput = render;

function render() {
  const q = search.value.toLowerCase();
  grid.innerHTML = "";
  plantas
    .filter(p => Object.values(p).join(" ").toLowerCase().includes(q))
    .forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "card";
      const thumb = p.imagen ? 
        `<img src="${p.imagen}" class="thumb">` :
        `<div class="thumb placeholder">Sin imagen</div>`;
      card.innerHTML = `
        ${thumb}
        <h3>${p.español}</h3>
        <small><em>${p.cientifico}</em></small>
        <p>${p.usos}</p>
        <span class="badge">${p.evidencia}</span>
        <div class="actions">
          <button class="btn ghost" onclick="ver(${i})">Ver</button>
          <button class="btn ghost" onclick="editar(${i})">Editar</button>
          <button class="btn ghost" onclick="duplicar(${i})">Duplicar</button>
          <button class="btn danger" onclick="borrar(${i})">Borrar</button>
        </div>`;
      grid.appendChild(card);
    });
}

function ver(i) {
  const p = plantas[i];
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <div class="ficha-grid">
      <div>
        <div class="ficha-section">
          <h3>${p.español} (${p.cientifico})</h3>
          <p><b>Usos:</b> ${p.usos}</p>
          <p><b>Preparación:</b> ${p.preparacion}</p>
          <p><b>Precauciones:</b> ${p.precauciones}</p>
          <p><b>Evidencia científica:</b> ${p.evidencia}</p>
        </div>
        <div class="ficha-section">
          <h4>${p.criollo || "(sin traducción)"}</h4>
          <p><b>Usos (criollo):</b> ${p.usos_criollo || ""}</p>
          <p><b>Precauciones (criollo):</b> ${p.precauciones_criollo || ""}</p>
        </div>
      </div>
      <div>
        ${p.imagen ? `<img src="${p.imagen}" class="thumb">` : `<div class="thumb placeholder">Sin imagen</div>`}
      </div>
    </div>`;
}

function guardar() {
  localStorage.setItem("plantasBilingue", JSON.stringify(plantas));
  render();
}

function editar(i) {
  if (prompt("Contraseña:") !== PASSWORD) return alert("No autorizado");
  editPlanta(plantas[i], i);
}

function editPlanta(p = {}, idx = null) {
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <div class="ficha-grid">
      <div>
        <label>Nombre español</label>
        <input id="e" type="text" value="${p.español || ""}">
        <label>Nombre científico</label>
        <input id="c" type="text" value="${p.cientifico || ""}">
        <label>Usos</label>
        <textarea id="u">${p.usos || ""}</textarea>
        <label>Preparación</label>
        <textarea id="pr">${p.preparacion || ""}</textarea>
        <label>Precauciones</label>
        <textarea id="p">${p.precauciones || ""}</textarea>
        <label>Evidencia</label>
        <input id="ev" type="text" value="${p.evidencia || ""}">
      </div>
      <div>
        <label>Traducción (criollo)</label>
        <input id="cr" type="text" value="${p.criollo || ""}">
        <label>Usos (criollo)</label>
        <textarea id="uc">${p.usos_criollo || ""}</textarea>
        <label>Precauciones (criollo)</label>
        <textarea id="pc">${p.precauciones_criollo || ""}</textarea>
        <label>Imagen</label>
        <input type="file" accept="image/*" onchange="cargarImagen(event, ${idx ?? -1})">
        ${p.imagen ? `<img src="${p.imagen}" class="thumb">` : ""}
      </div>
    </div>
    <footer>
      <button class="btn" onclick="guardarPlanta(${idx ?? -1})">Guardar</button>
      <button class="btn ghost" onclick="modal.style.display='none'">Cancelar</button>
    </footer>`;
}

function cargarImagen(e, idx) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    if (idx >= 0) plantas[idx].imagen = ev.target.result;
    else tempImagen = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function guardarPlanta(idx) {
  const nuevo = {
    español: document.getElementById("e").value,
    cientifico: document.getElementById("c").value,
    usos: document.getElementById("u").value,
    preparacion: document.getElementById("pr").value,
    precauciones: document.getElementById("p").value,
    evidencia: document.getElementById("ev").value,
    criollo: document.getElementById("cr").value,
    usos_criollo: document.getElementById("uc").value,
    precauciones_criollo: document.getElementById("pc").value,
    imagen: idx >= 0 ? plantas[idx].imagen : (window.tempImagen || "")
  };
  if (idx >= 0) plantas[idx] = nuevo;
  else plantas.push(nuevo);
  window.tempImagen = null;
  guardar();
  modal.style.display = "none";
}

function borrar(i) {
  if (prompt("Contraseña:") !== PASSWORD) return alert("No autorizado");
  if (confirm("¿Eliminar esta planta?")) {
    plantas.splice(i, 1);
    guardar();
  }
}

function duplicar(i) {
  const copia = { ...plantas[i] };
  copia.español += " (copia)";
  plantas.push(copia);
  guardar();
}
