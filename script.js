// ─────────────────────────────────────────────
//  DATA  — edit this to customise your diagram
// ─────────────────────────────────────────────

const CIRCLES = [
  {
    id: "c1",
    label: "1",
    cx: 270, cy: 155, r: 130,
    lx: 270, ly: 98,
    color: "#4361ee",
    title: "Circle A",
    details: "Unique to Circle A. Edit this in script.js to describe what belongs only here."
  },
  {
    id: "c2",
    label: "2",
    cx: 355, cy: 295, r: 130,
    lx: 412, ly: 322,
    color: "#f72585",
    title: "Circle B",
    details: "Unique to Circle B. Edit this in script.js to describe what belongs only here."
  },
  {
    id: "c3",
    label: "3",
    cx: 185, cy: 295, r: 130,
    lx: 128, ly: 322,
    color: "#06d6a0",
    title: "Circle C",
    details: "Unique to Circle C. Edit this in script.js to describe what belongs only here."
  },
];

// Pairwise entries come first (lower z-order); triple is last (topmost, wins center clicks).
// clipBy as a string → pairwise intersection.
// clipBy as an array [b, c] → triple intersection using nested clipPath.
const INTERSECTIONS = [
  {
    id: "i12",
    clipOf: "c1", clipBy: "c2",
    label: "4",
    lx: 328, ly: 210,
    title: "A ∩ B",
    details: "The overlap between Circle A and Circle B. Edit this in script.js."
  },
  {
    id: "i23",
    clipOf: "c2", clipBy: "c3",
    label: "5",
    lx: 270, ly: 322,
    title: "B ∩ C",
    details: "The overlap between Circle B and Circle C. Edit this in script.js."
  },
  {
    id: "i13",
    clipOf: "c1", clipBy: "c3",
    label: "6",
    lx: 212, ly: 210,
    title: "A ∩ C",
    details: "The overlap between Circle A and Circle C. Edit this in script.js."
  },
  {
    id: "i123",
    clipOf: "c1", clipBy: ["c2", "c3"],
    label: "Societal Resilience",
    lx: 270, ly: 254,
    title: "A ∩ B ∩ C",
    details: "The center where all three circles meet. Edit this in script.js."
  },
];

// Pairwise entries come first (lower z-order); triple is last (topmost, wins center clicks).
// bi:true = bidirectional (marker on both ends); bi:false = single direction (marker-end only).
const ARROW_SETS = [
  {
    id: 'green',
    color: '#ffd700',
    label: 'Green',
    title: 'Bilateral Relationships',
    details: 'Long-range bilateral connections between all three actors. Edit this in script.js to describe what this relationship type represents.',
    arrows: [
      { x1: 338, y1: 72,  x2: 448, y2: 318, bi: true },
      { x1: 202, y1: 72,  x2: 92,  y2: 318, bi: true },
      { x1: 165, y1: 408, x2: 375, y2: 408, bi: true },
    ]
  },
  {
    id: 'orange',
    color: '#ff7043',
    label: 'Orange',
    title: 'Collaborative Flows',
    details: 'Closer-range bilateral connections between each pair of actors. Edit this in script.js to describe what this relationship type represents.',
    arrows: [
      // Region 6 (c1∩c3): one arrow from each contributing circle
      { x1: 255, y1: 112, x2: 220, y2: 205, bi: false },  // 1 → 6
      { x1: 165, y1: 318, x2: 208, y2: 218, bi: false },  // 3 → 6
      // Region 4 (c1∩c2): one arrow from each contributing circle
      { x1: 285, y1: 112, x2: 320, y2: 205, bi: false },  // 1 → 4
      { x1: 375, y1: 318, x2: 332, y2: 218, bi: false },  // 2 → 4
      // Region 5 (c2∩c3): one arrow from each contributing circle
      { x1: 370, y1: 330, x2: 285, y2: 325, bi: false },  // 2 → 5
      { x1: 170, y1: 330, x2: 255, y2: 325, bi: false },  // 3 → 5
    ]
  },
  {
    id: 'blue',
    color: '#29b6f6',
    label: 'Blue',
    title: 'Direct Contributions',
    details: "Each actor’s unique area contributes directly toward the center (region 7). Edit this in script.js to describe what this flow represents.",
    arrows: [
      { x1: 270, y1: 112, x2: 270, y2: 232, bi: false },
      { x1: 392, y1: 295, x2: 304, y2: 259, bi: false },
      { x1: 148, y1: 295, x2: 236, y2: 259, bi: false },
    ]
  },
  {
    id: 'purple',
    color: '#ce93d8',
    label: 'Purple',
    title: 'Partnership Contributions',
    details: 'Flows from each pairwise overlap into the shared center. Where two actors already collaborate, that synergy feeds into the core. Edit this in script.js.',
    arrows: [
      { x1: 316, y1: 204, x2: 283, y2: 247, bi: false },
      { x1: 270, y1: 310, x2: 270, y2: 263, bi: false },
      { x1: 224, y1: 204, x2: 257, y2: 247, bi: false },
    ]
  },
];

// ─────────────────────────────────────────────
//  RENDERING
// ─────────────────────────────────────────────

const SVG_NS   = "http://www.w3.org/2000/svg";
const circleMap = Object.fromEntries(CIRCLES.map(c => [c.id, c]));

let activeEl        = null;
let activePanelItem  = null;
let activePanelColor = null;

function svgEl(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

function showPanel(item, dotColor) {
  const panel = document.getElementById("panel");
  panel.classList.add("fading");
  setTimeout(() => {
    const typeLabel = item.arrows ? 'Arrow set' : item.color ? 'Skill area' : 'Intersection';
    panel.innerHTML = `
      <div id="panel-type">
        ${dotColor ? `<span id="panel-dot" style="background:${dotColor}"></span>` : ""}
        ${typeLabel}
      </div>
      <h2 id="panel-title">${item.title}</h2>
      <p  id="panel-body">${item.details}</p>
    `;
    panel.classList.remove("fading");
  }, 140);
}

function activate(e, item, el, dotColor) {
  e.stopPropagation();
  if (activeEl) activeEl.classList.remove("active");
  el.classList.remove("clicked");
  void el.offsetWidth; // restart animation
  el.classList.add("clicked", "active");
  activeEl = el;
  activePanelItem  = item;
  activePanelColor = dotColor;
  showPanel(item, dotColor);
}

function restorePanel() {
  if (activePanelItem) {
    showPanel(activePanelItem, activePanelColor);
  } else {
    const panel = document.getElementById("panel");
    panel.classList.add("fading");
    setTimeout(() => {
      panel.innerHTML = '<p class="hint">Click a circle or an overlapping region to learn more.</p>';
      panel.classList.remove("fading");
    }, 140);
  }
}

function render() {
  const defs         = document.getElementById("clip-defs");
  const circlesLayer = document.getElementById("g-circles");
  const ixLayer      = document.getElementById("g-intersections");
  const labelsLayer  = document.getElementById("g-labels");

  // Per-circle base clipPaths — required for the nested triple intersection clip.
  CIRCLES.forEach(c => {
    const cp = svgEl("clipPath", { id: `cp-${c.id}` });
    cp.appendChild(svgEl("circle", { cx: c.cx, cy: c.cy, r: c.r }));
    defs.appendChild(cp);
  });

  // Intersection clipPaths.
  INTERSECTIONS.forEach(ix => {
    const cp = svgEl("clipPath", { id: `cp-${ix.id}` });
    if (Array.isArray(ix.clipBy)) {
      // Triple: circle[clipBy[0]] clipped by cp-clipBy[1] → represents clipBy[0] ∩ clipBy[1].
      // Applying this to clipOf circle gives clipOf ∩ clipBy[0] ∩ clipBy[1].
      const b = circleMap[ix.clipBy[0]];
      const inner = svgEl("circle", {
        cx: b.cx, cy: b.cy, r: b.r,
        "clip-path": `url(#cp-${ix.clipBy[1]})`,
      });
      cp.appendChild(inner);
    } else {
      const b = circleMap[ix.clipBy];
      cp.appendChild(svgEl("circle", { cx: b.cx, cy: b.cy, r: b.r }));
    }
    defs.appendChild(cp);
  });

  // Base circles — handle clicks for unique regions (1, 2, 3).
  CIRCLES.forEach(c => {
    const circle = svgEl("circle", {
      cx: c.cx, cy: c.cy, r: c.r,
      fill: c.color,
      "fill-opacity": "0.42",
      class: "venn-circle",
    });
    circle.addEventListener("click", e => activate(e, c, circle, c.color));
    circlesLayer.appendChild(circle);
  });

  // Intersection overlays — pairwise first, triple last so it wins center clicks (regions 4–7).
  INTERSECTIONS.forEach(ix => {
    const src     = circleMap[ix.clipOf];
    const overlay = svgEl("circle", {
      cx: src.cx, cy: src.cy, r: src.r,
      "clip-path": `url(#cp-${ix.id})`,
      class: "venn-intersection",
    });
    overlay.addEventListener("click", e => activate(e, ix, overlay, null));
    ixLayer.appendChild(overlay);
  });

  // Non-interactive region labels — one per clickable area (7 total).
  CIRCLES.forEach(c => {
    const txt = svgEl("text", { x: c.lx, y: c.ly, class: "venn-label" });
    txt.textContent = c.label;
    labelsLayer.appendChild(txt);
  });
  INTERSECTIONS.forEach(ix => {
    const txt = svgEl("text", { x: ix.lx, y: ix.ly, class: "venn-label" });
    txt.textContent = ix.label;
    labelsLayer.appendChild(txt);
  });
}

function renderArrows() {
  const arrowLayer = document.getElementById("g-arrows");
  const toggleDiv  = document.getElementById("arrow-toggles");

  const HEAD_LEN = 13;  // arrowhead length in px
  const HEAD_W   = 7;   // arrowhead half-width in px

  // Returns SVG polygon points string for an arrowhead tip at (tx,ty) pointing in `angle`.
  function headPoints(tx, ty, angle) {
    const bx = tx - HEAD_LEN * Math.cos(angle);
    const by = ty - HEAD_LEN * Math.sin(angle);
    const lx = bx + HEAD_W * Math.cos(angle + Math.PI / 2);
    const ly = by + HEAD_W * Math.sin(angle + Math.PI / 2);
    const rx = bx - HEAD_W * Math.cos(angle + Math.PI / 2);
    const ry = by - HEAD_W * Math.sin(angle + Math.PI / 2);
    return `${tx},${ty} ${lx},${ly} ${rx},${ry}`;
  }

  ARROW_SETS.forEach(set => {
    const group = svgEl("g", { id: `arrows-${set.id}`, class: "arrow-group" });
    group.style.display = "none";

    set.arrows.forEach(a => {
      const angle = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);

      // Shaft endpoints pulled back from the tips so the line stops at the arrowhead base.
      const sx2 = a.x2 - HEAD_LEN * Math.cos(angle);
      const sy2 = a.y2 - HEAD_LEN * Math.sin(angle);
      const sx1 = a.bi ? a.x1 + HEAD_LEN * Math.cos(angle) : a.x1;
      const sy1 = a.bi ? a.y1 + HEAD_LEN * Math.sin(angle) : a.y1;

      // Visible shaft — not interactive, purely visual.
      group.appendChild(svgEl("line", {
        x1: sx1, y1: sy1, x2: sx2, y2: sy2,
        stroke: set.color, "stroke-width": "5", "stroke-linecap": "butt",
        "pointer-events": "none",
      }));

      // Wide transparent hit area covering the full arrow length including arrowhead zones.
      const hit = svgEl("line", {
        x1: a.x1, y1: a.y1, x2: a.x2, y2: a.y2,
        stroke: "rgba(255,255,255,0)", "stroke-width": "18",
        "pointer-events": "all",
      });
      hit.addEventListener("click", e => { e.stopPropagation(); activePanelItem = set; activePanelColor = set.color; showPanel(set, set.color); });
      group.appendChild(hit);

      // Arrowhead polygon at (x2, y2) — visible and clickable.
      const h2 = svgEl("polygon", {
        points: headPoints(a.x2, a.y2, angle),
        fill: set.color, "pointer-events": "all",
      });
      h2.addEventListener("click", e => { e.stopPropagation(); activePanelItem = set; activePanelColor = set.color; showPanel(set, set.color); });
      group.appendChild(h2);

      // Second arrowhead at (x1, y1) for bidirectional arrows.
      if (a.bi) {
        const h1 = svgEl("polygon", {
          points: headPoints(a.x1, a.y1, angle + Math.PI),
          fill: set.color, "pointer-events": "all",
        });
        h1.addEventListener("click", e => { e.stopPropagation(); activePanelItem = set; activePanelColor = set.color; showPanel(set, set.color); });
        group.appendChild(h1);
      }
    });

    arrowLayer.appendChild(group);

    const btn = document.createElement("button");
    btn.className = "arrow-btn";
    btn.textContent = set.label;
    btn.style.setProperty("--set-color", set.color);
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const visible = btn.classList.toggle("active");
      group.style.display = visible ? "block" : "none";
      activePanelItem  = visible ? set  : null;
      activePanelColor = visible ? set.color : null;
      if (visible) showPanel(set, set.color);
    });
    btn.addEventListener("mouseenter", () => showPanel(set, set.color));
    btn.addEventListener("mouseleave", restorePanel);
    toggleDiv.appendChild(btn);
  });
}

render();
renderArrows();

document.addEventListener("click", () => {
  if (activeEl) { activeEl.classList.remove("active"); activeEl = null; }
  activePanelItem  = null;
  activePanelColor = null;
  const panel = document.getElementById("panel");
  panel.classList.add("fading");
  setTimeout(() => {
    panel.innerHTML = '<p class="hint">Click a circle or an overlapping region to learn more.</p>';
    panel.classList.remove("fading");
  }, 140);
});
