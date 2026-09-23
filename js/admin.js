let activeTab = "berichten";
let editBerichtId = null;
let berichtKlassen = [];
let activeRoosterKlas = "3WDV1";
let editLesIdx = null;
let activeStopId = DB.stops[0]?.id;
let editDepIdx = null;

function showSaved() {
  const el = document.getElementById("a-saved");
  el.style.display = "inline-block";
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.style.display = "none"), 2000);
}

function renderAdminCurrent() {
  if (activeTab === "berichten") renderAdminBerichten();
  if (activeTab === "rooster") renderAdminRooster();
  if (activeTab === "bus") renderAdminBus();
}

function switchTab(tab) {
  activeTab = tab;
  document
    .querySelectorAll(".a-tab")
    .forEach((t, i) =>
      t.classList.toggle("active", ["berichten", "rooster", "bus"][i] === tab),
    );
  document
    .querySelectorAll(".a-panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("panel-" + tab).classList.add("active");
  renderAdminCurrent();
}

function renderAdminBerichten() {
  const list = document.getElementById("bericht-list");
  if (!DB.announcements.length) {
    list.innerHTML =
      '<div class="empty-state">Geen mededelingen. Voeg er een toe.</div>';
    return;
  }
  list.innerHTML = DB.announcements
    .map((a) => {
      const c = PCOLOR[a.priority];
      return `<div class="row-item" style="margin-bottom:8px;border-left:3px solid ${c}"><div style="flex:1;min-width:0">
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;flex-wrap:wrap"><span class="prio-badge" style="background:${c}20;color:${c}">${PLABEL[a.priority]}</span><span style="font-size:12px;color:var(--sub)">${a.author}</span>
      ${a.classes.map((cl) => `<span class="prio-badge" style="background:${CCOLOR[cl] ?? "#00ccff"}18;color:${CCOLOR[cl] ?? "#00ccff"}">${cl}</span>`).join("")}</div>
      <div style="font-weight:600;font-size:15px">${a.title}</div><div style="font-size:13px;color:var(--sub);margin-top:2px">${a.body.slice(0, 80)}${a.body.length > 80 ? "…" : ""}</div></div>
      <div class="row-actions"><button class="btn btn-sm" onclick="editBericht('${a.id}')">Bewerk</button><button class="btn btn-sm btn-danger" onclick="deleteBericht('${a.id}')">✕</button></div></div>`;
    })
    .join("");
}

function openBerichtForm(id) {
  editBerichtId = id || null;
  const a = id ? DB.announcements.find((x) => x.id === id) : null;
  berichtKlassen = a ? [...a.classes] : [];
  document.getElementById("b-author").value = a?.author || "";
  document.getElementById("b-prio").value = a?.priority || "info";
  document.getElementById("b-title").value = a?.title || "";
  document.getElementById("b-body").value = a?.body || "";
  document.getElementById("b-expires").value = a?.expires || "";
  updateKlasBtns();
  document.getElementById("bericht-form-card").style.display = "block";
}
function editBericht(id) {
  openBerichtForm(id);
}
function toggleKlas(cls) {
  berichtKlassen = berichtKlassen.includes(cls)
    ? berichtKlassen.filter((c) => c !== cls)
    : [...berichtKlassen, cls];
  updateKlasBtns();
}
function updateKlasBtns() {
  document
    .getElementById("tog-3WDV1")
    .classList.toggle("on", berichtKlassen.includes("3WDV1"));
  document
    .getElementById("tog-3WDV2")
    .classList.toggle("on", berichtKlassen.includes("3WDV2"));
}
function saveBericht() {
  const title = document.getElementById("b-title").value.trim();
  const author = document.getElementById("b-author").value.trim();
  if (!title || !author) return;
  const ann = {
    id: editBerichtId || uid(),
    priority: document.getElementById("b-prio").value,
    author,
    title,
    body: document.getElementById("b-body").value.trim(),
    classes: [...berichtKlassen],
    expires: document.getElementById("b-expires").value.trim(),
  };
  if (editBerichtId)
    DB.announcements = DB.announcements.map((a) =>
      a.id === editBerichtId ? ann : a,
    );
  else DB.announcements.push(ann);
  save();
  cancelBericht();
  renderAdminBerichten();
}
function cancelBericht() {
  editBerichtId = null;
  document.getElementById("bericht-form-card").style.display = "none";
}
function deleteBericht(id) {
  DB.announcements = DB.announcements.filter((a) => a.id !== id);
  save();
  renderAdminBerichten();
}

function switchRoosterKlas(cls) {
  activeRoosterKlas = cls;
  cancelLesson();
  document.getElementById("rtab-3WDV1").classList.toggle("on", cls === "3WDV1");
  document.getElementById("rtab-3WDV2").classList.toggle("on", cls === "3WDV2");
  renderAdminRooster();
}
function renderAdminRooster() {
  const lessen = DB.schedule[activeRoosterKlas] || [];
  const list = document.getElementById("rooster-list");
  if (!lessen.length) {
    list.innerHTML =
      '<div class="empty-state">Geen lessen. Voeg er een toe.</div>';
    return;
  }
  list.innerHTML = lessen
    .map(
      (
        l,
        i,
      ) => `<div class="row-item ${editLesIdx === i ? "editing" : ""}" style="margin-bottom:8px">
    <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--sub);width:100px;flex-shrink:0">${l.time}</span><span style="font-weight:600;font-size:15px;flex:1">${l.subject}</span><span style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--sub)">${l.room}</span>
    <div class="row-actions"><button class="btn btn-sm" onclick="editLesson(${i})">Bewerk</button><button class="btn btn-sm btn-danger" onclick="deleteLesson(${i})">✕</button></div></div>`,
    )
    .join("");
}
function editLesson(i) {
  editLesIdx = i;
  const l = DB.schedule[activeRoosterKlas][i];
  document.getElementById("l-time").value = l.time;
  document.getElementById("l-subject").value = l.subject;
  document.getElementById("l-room").value = l.room;
  document.getElementById("l-teacher").value = l.teacher;
  document.getElementById("les-form-title").textContent = "Les bewerken";
  document.getElementById("l-cancel-btn").style.display = "inline-block";
  renderAdminRooster();
}
function saveLesson() {
  const subject = document.getElementById("l-subject").value.trim();
  if (!subject) return;
  const l = {
    time: document.getElementById("l-time").value.trim(),
    subject,
    room: document.getElementById("l-room").value.trim(),
    teacher: document.getElementById("l-teacher").value.trim(),
  };
  const lessen = DB.schedule[activeRoosterKlas] || [];
  if (editLesIdx !== null) lessen[editLesIdx] = l;
  else lessen.push(l);
  DB.schedule[activeRoosterKlas] = lessen;
  save();
  cancelLesson();
  renderAdminRooster();
}
function deleteLesson(i) {
  DB.schedule[activeRoosterKlas].splice(i, 1);
  save();
  renderAdminRooster();
}
function cancelLesson() {
  editLesIdx = null;
  ["l-time", "l-subject", "l-room", "l-teacher"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("les-form-title").textContent = "Les toevoegen";
  document.getElementById("l-cancel-btn").style.display = "none";
  if (document.getElementById("rooster-list")) renderAdminRooster();
}

function renderAdminBus() {
  renderStopTabs();
  renderStopContent();
}
function renderStopTabs() {
  document.getElementById("stop-tabs").innerHTML =
    DB.stops
      .map(
        (s) =>
          `<button class="klas-toggle ${s.id === activeStopId ? "on" : ""}" onclick="switchStop('${s.id}')">${s.name}</button>`,
      )
      .join("") +
    '<button class="btn btn-sm btn-primary" onclick="addStop()">+ Halte</button>';
}
function switchStop(id) {
  activeStopId = id;
  cancelDep();
  renderAdminBus();
}
function addStop() {
  const id = uid();
  DB.stops.push({ id, name: "Nieuwe halte", departures: [] });
  activeStopId = id;
  save();
  renderAdminBus();
}
function renderStopContent() {
  const stop = DB.stops.find((s) => s.id === activeStopId);
  if (!stop) return;
  document.getElementById("stop-name-row").innerHTML =
    `<input id="stop-name-input" value="${stop.name}" style="width:280px;font-size:16px;font-weight:600" onchange="renameStop(this.value)">${DB.stops.length > 1 ? '<button class="btn btn-sm btn-danger" onclick="deleteStop()">Halte verwijderen</button>' : ""}`;
  const list = document.getElementById("dep-list");
  if (!stop.departures.length) {
    list.innerHTML = '<div class="empty-state">Geen vertrekken.</div>';
    return;
  }
  list.innerHTML = stop.departures
    .map(
      (d, i) =>
        `<div class="row-item ${editDepIdx === i ? "editing" : ""}" style="margin-bottom:8px"><div class="bus-line" style="width:44px;height:44px;font-size:18px">${d.line}</div><span style="flex:1;font-size:15px;color:#8aadcc">${d.dest}</span><span style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:18px;color:var(--green)">${d.min}'</span><div class="row-actions"><button class="btn btn-sm" onclick="editDep(${i})">Bewerk</button><button class="btn btn-sm btn-danger" onclick="deleteDep(${i})">✕</button></div></div>`,
    )
    .join("");
}
function renameStop(name) {
  DB.stops = DB.stops.map((s) => (s.id === activeStopId ? { ...s, name } : s));
  save();
  renderStopTabs();
}
function deleteStop() {
  DB.stops = DB.stops.filter((s) => s.id !== activeStopId);
  activeStopId = DB.stops[0]?.id;
  save();
  renderAdminBus();
}
function editDep(i) {
  editDepIdx = i;
  const d = DB.stops.find((s) => s.id === activeStopId).departures[i];
  document.getElementById("d-line").value = d.line;
  document.getElementById("d-dest").value = d.dest;
  document.getElementById("d-min").value = d.min;
  document.getElementById("dep-form-title").textContent = "Vertrek bewerken";
  document.getElementById("d-cancel-btn").style.display = "inline-block";
  renderStopContent();
}
function saveDep() {
  const line = document.getElementById("d-line").value.trim();
  const dest = document.getElementById("d-dest").value.trim();
  if (!line || !dest) return;
  const dep = {
    line,
    dest,
    min: parseInt(document.getElementById("d-min").value) || 0,
  };
  const stop = DB.stops.find((s) => s.id === activeStopId);
  if (editDepIdx !== null) stop.departures[editDepIdx] = dep;
  else stop.departures.push(dep);
  save();
  cancelDep();
  renderStopContent();
}
function deleteDep(i) {
  const stop = DB.stops.find((s) => s.id === activeStopId);
  stop.departures.splice(i, 1);
  save();
  renderStopContent();
}
function cancelDep() {
  editDepIdx = null;
  ["d-line", "d-dest", "d-min"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("dep-form-title").textContent = "Vertrek toevoegen";
  document.getElementById("d-cancel-btn").style.display = "none";
  if (document.getElementById("dep-list")) renderStopContent();
}

function applyRoute() {
  const isAdmin = location.hash === "#admin";
  document.getElementById("display").style.display = isAdmin ? "none" : "flex";
  document.getElementById("admin").style.display = isAdmin ? "flex" : "none";
  if (isAdmin) {
    clearInterval(slideTimer);
    renderAdminCurrent();
  } else {
    renderAll();
    startSlide();
  }
}
window.addEventListener("hashchange", applyRoute);
applyRoute();
