// ─────────────────────────────────────────────
//  DATA  — edit this to customise your diagram
// ─────────────────────────────────────────────

const CIRCLES = [
  {
    id: "c1",
    label: "Public sector",
    cx: 270, cy: 155, r: 130,
    lx: 270, ly: 98,
    color: "#4361ee",
    title: "The public sector",
    details: "The public sector includes institutions at national, regional, and local levels (e.g., municipalities, government agencies, public operators) that implement risk prevention policies and play a central role in Disaster Risk Reduction (DRR) through planning, regulation, and resource provision."
  },
  {
    id: "c2",
    label: "Civil society",
    cx: 355, cy: 295, r: 130,
    lx: 412, ly: 322,
    color: "#f72585",
    title: "The civil society",
    details: "Civil society includes NGOs, associations, community groups, trade unions, and citizen collectives committed to environmental or social causes, offering knowledge of vulnerabilities and uses."
  },
  {
    id: "c3",
    label: "Private sector",
    cx: 185, cy: 295, r: 130,
    lx: 128, ly: 322,
    color: "#06d6a0",
    title: "The private sector",
    details: "The private sector comprises for-profit entities of all sizes: companies, start-ups, chambers of commerce, service providers, technology suppliers (and contributes innovation, financing, and operational capacity). Their engagement often depends on social responsibility, economic interests, or risk exposure (e.g., in flood-prone areas)."
  },
];

// Pairwise entries come first (lower z-order); triple is last (topmost, wins center clicks).
// clipBy as a string → pairwise intersection.
// clipBy as an array [b, c] → triple intersection using nested clipPath.
const INTERSECTIONS = [
  {
    id: "i12",
    clipOf: "c1", clipBy: "c2",
    label: "Public-civil collaboration",
    lx: 328, ly: 210,
    title: "Public-civil collaboration",
    details: "Public-civil collaboration refers to partnerships between governments, public institutions, civil society organizations, community groups, academia, and other non-governmental stakeholders to strengthen disaster risk reduction, resilience, and sustainable development. By combining public sector leadership, policy, and coordination with the local knowledge, advocacy, and community engagement of civil society, these collaborations help promote inclusive decision-making, strengthen preparedness, reduce vulnerabilities, and support resilient communities and public systems."
  },
  {
    id: "i23",
    clipOf: "c2", clipBy: "c3",
    label: "5",
    lx: 270, ly: 322,
    title: "Private-civil collaboration",
    details: "Private-civil collaboration refers to partnerships between businesses, civil society organizations, community groups, academia, and other non-governmental stakeholders to advance disaster risk reduction, resilience, and sustainable development. By combining private sector innovation, resources, and technical expertise with the local knowledge, advocacy, and community engagement of civil society, these collaborations help strengthen preparedness, promote inclusive and people-centered solutions, and support more resilient communities and livelihoods."
  },
  {
    id: "i13",
    clipOf: "c1", clipBy: "c3",
    label: "6",
    lx: 212, ly: 210,
    title: "Public-private collaboration",
    details: "Public-private collaboration brings together governments, international organizations, businesses, and other private sector partners to strengthen disaster risk reduction, resilience, and sustainable development. By combining public leadership and policy with private sector innovation, technology, investment, and expertise, these partnerships help communities and economies better prepare for disasters, reduce risks and vulnerabilities, and build more resilient infrastructure and systems."
  },
  {
    id: "i123",
    clipOf: "c1", clipBy: ["c2", "c3"],
    label: "Societal Resilience",
    lx: 270, ly: 254,
    title: "Societal Resilience",
    details: "Societal resilience is built through the intersection of public, private, and civil sectors and their cross-sectoral, multi-level collaboration. It reflects a whole-of-society approach in which governments, businesses, civil society, communities, academia, and international organizations combine their leadership, knowledge, resources, innovation, and engagement to create safer, more inclusive, sustainable, and disaster-resilient societies. Through coordinated action and shared responsibility, societal resilience helps protect lives, livelihoods, infrastructure, ecosystems, and development gains while strengthening the capacity to face future risks and uncertainties."
  },
];

// Pairwise entries come first (lower z-order); triple is last (topmost, wins center clicks).
// bi:true = bidirectional (marker on both ends); bi:false = single direction (marker-end only).
const ARROW_SETS = [
  {
    id: 'green',
    color: '#ffd700',
    label: 'Strategic level: communication and coordination',
    title: 'Strategic level: communication and coordination',
    details: 'Communication and coordination help public, private, and civil sector actors understand each other’s roles, responsibilities, and resilience actions. While each sector operates independently within its own mandate and capacities, effective communication ensures that these actions are aligned, mutually supportive, and do not unintentionally hinder one another.',
    arrows: [
      { x1: 338, y1: 72,  x2: 448, y2: 318, bi: true },
      { x1: 202, y1: 72,  x2: 92,  y2: 318, bi: true },
      { x1: 165, y1: 408, x2: 375, y2: 408, bi: true },
    ]
  },
  {
    id: 'orange',
    color: '#ff7043',
    label: 'Strategic level: collaboration',
    title: 'Strategic level: collaboration',
    details: 'Collaboration refers to a higher level of engagement where public, private, and civil sector actors work together to design and implement shared actions that no single group could achieve alone. Through a holistic approach, stakeholders combine their expertise, resources, and capacities to strengthen community resilience through coordinated and integrated action. \n While some resilience actions remain sector-specific, collaborative initiatives create shared solutions across emergency planning, infrastructure protection, continuity of essential services, and support for vulnerable populations. In this way, collaboration strengthens societal resilience beyond what individual sectors can achieve independently. \n The TOGETHER project applied the PPCP® Framework, which provides the structure and governance needed to support this collaboration, including guidance, tools, governance models, and coordination mechanisms that enable effective interaction and joint decision-making across sectors and levels.',
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
    label: 'Operational leve: coordinated sectoral resilience actions',
    title: 'Operational leve: coordinated sectoral resilience actions',
    details: "In operation, each sector undertakes its own resilience actions while aligning them with the activities of others through strategic communication and coordination. For example, businesses may focus on maintaining operations during and after a crisis to support economic and community continuity. Public authorities may implement measures such as temporary flood defences to protect communities and critical infrastructure. Civil society organizations and community groups, such as food banks, may prepare their own response plans to continue supporting vulnerable populations during disasters. Coordination between these actors helps ensure that actions taken by one group — such as road closures or flood barriers — do not unintentionally disrupt the activities and access needs of another. In this way, communication and coordination strengthen synergies across sectors and support a more coherent whole-of-society approach to disaster resilience.",
    arrows: [
      { x1: 270, y1: 112, x2: 270, y2: 232, bi: false },
      { x1: 392, y1: 295, x2: 304, y2: 259, bi: false },
      { x1: 148, y1: 295, x2: 236, y2: 259, bi: false },
    ]
  },
  {
    id: 'purple',
    color: '#ce93d8',
    label: 'Operational leve: collabrative actions',
    title: 'Operational leve: collabrative actions',
    details: 'While some resilience actions remain sector-specific, collaborative initiatives create shared solutions across emergency planning, infrastructure protection, continuity of essential services, and support for vulnerable populations. In this way, collaboration strengthens societal resilience beyond what individual sectors can achieve independently. For example, public authorities, businesses, and community organizations may jointly develop resilience solutions that integrate emergency planning, infrastructure protection, continuity of essential services, and support for vulnerable populations. Through this process, collaboration enables collective action that strengthens societal resilience beyond what individual sectors could achieve independently.',
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
