// ─────────────────────────────────────────────
//  DATA  — edit this to customise your diagram
// ─────────────────────────────────────────────

const CIRCLES = [
  {
    id: "leadership",
    label: "Leadership",
    cx: 195, cy: 170, r: 118,
    color: "#4361ee",
    title: "Leadership",
    details: "The ability to guide teams, set direction, and make decisions under uncertainty. Good leaders amplify the strengths of everyone around them and create the conditions for others to do their best work."
  },
  {
    id: "technical",
    label: "Technical",
    cx: 368, cy: 170, r: 118,
    color: "#f72585",
    title: "Technical Skills",
    details: "Core engineering and systems thinking — writing code, architecting solutions, debugging complex problems, and continuously learning as the landscape evolves."
  },
  {
    id: "creative",
    label: "Creative",
    cx: 115, cy: 328, r: 104,
    color: "#7209b7",
    title: "Creative",
    details: "Generating novel ideas and approaching problems from unexpected angles. Creativity isn't only about art — it's the willingness to experiment and the courage to pursue ideas that don't exist yet."
  },
  {
    id: "analytical",
    label: "Analytical",
    cx: 448, cy: 328, r: 104,
    color: "#f77f00",
    title: "Analytical",
    details: "Breaking down complex problems, interpreting data, spotting patterns, and forming evidence-based conclusions. The foundation of sound decision-making in any field."
  },
  {
    id: "communication",
    label: "Communication",
    cx: 282, cy: 306, r: 118,
    color: "#06d6a0",
    title: "Communication",
    details: "Expressing ideas clearly in writing and speech, listening actively, and adapting your message to the audience. The force-multiplier for every other skill on this diagram."
  }
];

// Each intersection references two circle IDs.
// "clipOf" is the circle whose shape is used as the overlay.
// "clipBy" is the circle that clips it — giving the intersection region.
const INTERSECTIONS = [
  {
    id: "ix-lead-tech",
    clipOf: "technical", clipBy: "leadership",
    title: "Technical Leadership",
    details: "Leading engineering teams — setting technical standards, mentoring engineers, and making architecture decisions that balance speed with long-term maintainability."
  },
  {
    id: "ix-lead-creative",
    clipOf: "creative", clipBy: "leadership",
    title: "Visionary Leadership",
    details: "Inspiring creative direction and building a culture of innovation. The courage to pursue bold, unproven ideas and bring a team along for the journey."
  },
  {
    id: "ix-lead-comm",
    clipOf: "communication", clipBy: "leadership",
    title: "Influence",
    details: "Rallying stakeholders, negotiating priorities, and communicating strategy in a way that motivates action. The art of getting alignment without relying on authority."
  },
  {
    id: "ix-tech-anal",
    clipOf: "analytical", clipBy: "technical",
    title: "Data Engineering",
    details: "Building systems that collect, store, and process data at scale — pipelines, warehouses, and infrastructure that turns raw events into reliable, queryable assets."
  },
  {
    id: "ix-tech-comm",
    clipOf: "communication", clipBy: "technical",
    title: "Developer Relations",
    details: "Bridging technical depth with clear communication — writing great documentation, giving talks, and supporting communities to help others build successfully."
  },
  {
    id: "ix-creative-comm",
    clipOf: "communication", clipBy: "creative",
    title: "Storytelling",
    details: "Crafting narratives that engage and stick. Using design and language together to make ideas land with emotional resonance. The most human of all skills."
  },
  {
    id: "ix-anal-comm",
    clipOf: "communication", clipBy: "analytical",
    title: "Data Storytelling",
    details: "Translating analysis into decisions — presenting findings in ways that non-technical stakeholders can understand and act on. Numbers only matter if they change minds."
  }
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
  const defs          = document.getElementById("clip-defs");
  const circlesLayer  = document.getElementById("g-circles");
  const ixLayer       = document.getElementById("g-intersections");
  const labelsLayer   = document.getElementById("g-labels");

  // Clip paths for intersection regions
  INTERSECTIONS.forEach(ix => {
    const bound = circleMap[ix.clipBy];
    const cp    = svgEl("clipPath", { id: `cp-${ix.id}` });
    cp.appendChild(svgEl("circle", { cx: bound.cx, cy: bound.cy, r: bound.r }));
    defs.appendChild(cp);
  });

  // Base circles
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

  // Intersection overlays — rendered above circles so they win hit testing
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

  // Labels (non-interactive)
  CIRCLES.forEach(c => {
    const txt = svgEl("text", { x: c.cx, y: c.cy, class: "venn-label" });
    txt.textContent = c.label;
    labelsLayer.appendChild(txt);
  });
}

render();
