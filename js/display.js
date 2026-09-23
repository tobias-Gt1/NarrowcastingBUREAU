// Clock
const DAYS = [
  "Zondag",
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
];
const MONTHS = [
  "jan",
  "feb",
  "mrt",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
];

function p(n) {
  return String(n).padStart(2, "0");
}

function tickClock() {
  const d = new Date();
  document.getElementById("clock").textContent =
    p(d.getHours()) + ":" + p(d.getMinutes());
  document.getElementById("dateline").textContent =
    DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];
}

tickClock();
setInterval(tickClock, 1000);

// Display data and rendering
const SCREENS = ["bus", "rooster", "weer", "berichten"];
const DURATIONS = { bus: 20, rooster: 18, weer: 15, berichten: 25 };
const HOURS = [
  { t: "Nu", icon: "⛅", c: 14, rain: 10 },
  { t: "14:00", icon: "🌤", c: 16, rain: 5 },
  { t: "15:00", icon: "🌦", c: 15, rain: 40 },
  { t: "16:00", icon: "🌧", c: 13, rain: 75 },
  { t: "17:00", icon: "🌧", c: 12, rain: 80 },
  { t: "18:00", icon: "⛅", c: 11, rain: 20 },
];
const PCOLOR = { urgent: "#f04444", reminder: "#f5a623", info: "#00ccff" };
const PLABEL = { urgent: "Dringend", reminder: "Herinnering", info: "Info" };
const CCOLOR = { "3WDV1": "#00ccff", "3WDV2": "#f5a623" };
let slideIdx = 0;
let slideProg = 0;
let slideTimer = null;

function minColor(m) {
  if (m <= 2) return "var(--red)";
  if (m <= 7) return "var(--yellow)";
  return "var(--green)";
}

function renderBus() {
  document.getElementById("screen-bus").innerHTML = DB.stops
    .map(
      (s) => `
    <div class="bus-card">
      <div><div class="bus-card-label">Halte</div><div class="bus-card-name">${s.name}</div></div>
      <hr class="bus-divider">
      ${s.departures
        .map(
          (d) => `
        <div class="bus-row">
          <div class="bus-line">${d.line}</div><div class="bus-dest">${d.dest}</div>
          <div class="bus-min" style="color:${minColor(d.min)}">${d.min <= 0 ? "NU" : d.min + "'"}</div>
        </div>`,
        )
        .join("")}
    </div>`,
    )
    .join("");
}

function renderRoosterScreen() {
  document.getElementById("screen-rooster").innerHTML = Object.entries(
    DB.schedule,
  )
    .map(
      ([cls, lessen]) => `
    <div class="rooster-card">
      <div class="rooster-klas" style="color:${CCOLOR[cls] ?? "var(--accent)"}">${cls}</div><hr class="bus-divider">
      ${lessen
        .map(
          (l) => `
        <div class="rooster-row" style="opacity:${l.subject === "Vrij uur" ? 0.4 : 1}">
          <div class="rooster-time">${l.time}</div><div class="rooster-vak">${l.subject}</div><div class="rooster-room">${l.room}</div>
        </div>`,
        )
        .join("")}
    </div>`,
    )
    .join("");
}

function renderWeer() {
  document.getElementById("uur-list").innerHTML = HOURS.map(
    (h, i) => `
    <div class="uur-row"><div class="uur-t" style="color:${i === 0 ? "var(--accent)" : "var(--sub)"}">${h.t}</div>
      <div class="uur-icon">${h.icon}</div><div class="uur-c">${h.c}°</div>
      <div class="uur-bar"><div class="uur-fill" style="width:${h.rain}%"></div></div><div class="uur-pct">${h.rain}%</div>
    </div>`,
  ).join("");
}

function renderBerichten() {
  const list = document.getElementById("b-list");
  document.getElementById("b-header").textContent =
    "Mededelingen — " + DB.announcements.length + " berichten";
  if (!DB.announcements.length) {
    list.innerHTML =
      '<div class="empty-state">Geen mededelingen op dit moment.</div>';
    return;
  }
  list.innerHTML = DB.announcements
    .map((a) => {
      const c = PCOLOR[a.priority];
      return `<div class="b-card" style="background:var(--surface);border:1px solid ${c}22"><div class="b-stripe" style="background:${c}"></div>
      <div class="b-inner"><div class="b-meta"><span class="b-badge" style="background:${c}22;color:${c}">${PLABEL[a.priority]}</span>
      <span class="b-author">${a.author}</span>${a.classes.map((cl) => `<span class="b-badge" style="background:${CCOLOR[cl] ?? "#00ccff"}18;color:${CCOLOR[cl] ?? "#00ccff"}">${cl}</span>`).join("")}
      <span class="b-expire">t/m ${a.expires}</span></div><div class="b-title">${a.title}</div><div class="b-body">${a.body}</div></div></div>`;
    })
    .join("");
}

function renderDots() {
  document.getElementById("dots").innerHTML = SCREENS.map(
    (s, i) =>
      `<div class="dot" style="width:${i === slideIdx ? 48 : 8}px"><div class="dot-fill" style="width:${i === slideIdx ? slideProg : i < slideIdx ? 100 : 0}%"></div></div>`,
  ).join("");
}

function showSlide(idx) {
  SCREENS.forEach(
    (s) => (document.getElementById("screen-" + s).style.display = "none"),
  );
  document.getElementById("screen-" + SCREENS[idx]).style.display = "flex";
}

function renderAll() {
  renderBus();
  renderRoosterScreen();
  renderWeer();
  renderBerichten();
  renderDots();
}

function startSlide() {
  clearInterval(slideTimer);
  slideProg = 0;
  showSlide(slideIdx);
  renderAll();
  const dur = DURATIONS[SCREENS[slideIdx]];
  slideTimer = setInterval(() => {
    slideProg = Math.min(slideProg + 100 / dur, 100);
    renderDots();
    if (slideProg >= 100) {
      slideIdx = (slideIdx + 1) % SCREENS.length;
      slideProg = 0;
      showSlide(slideIdx);
      renderAll();
    }
  }, 1000);
}

renderWeer();
startSlide();
