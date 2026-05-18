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
    label: "7",
    lx: 270, ly: 254,
    title: "A ∩ B ∩ C",
    details: "The center where all three circles meet. Edit this in script.js."
  },
];

// ─────────────────────────────────────────────
//  RENDERING
// ─────────────────────────────────────────────

const SVG_NS   = "http://www.w3.org/2000/svg";
const circleMap = Object.fromEntries(CIRCLES.map(c => [c.id, c]));

let activeEl = null;

function svgEl(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

function showPanel(item, dotColor) {
  const panel = document.getElementById("panel");
  panel.classList.add("fading");
  setTimeout(() => {
    const isIntersection = !item.color;
    panel.innerHTML = `
      <div id="panel-type">
        ${dotColor ? `<span id="panel-dot" style="background:${dotColor}"></span>` : ""}
        ${isIntersection ? "Intersection" : "Skill area"}
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
  showPanel(item, dotColor);
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

render();

document.addEventListener("click", () => {
  if (!activeEl) return;
  activeEl.classList.remove("active");
  activeEl = null;
  const panel = document.getElementById("panel");
  panel.classList.add("fading");
  setTimeout(() => {
    panel.innerHTML = '<p class="hint">Click a circle or an overlapping region to learn more.</p>';
    panel.classList.remove("fading");
  }, 140);
});
