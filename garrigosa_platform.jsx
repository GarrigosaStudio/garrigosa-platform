import { useState, useEffect, useRef } from "react";

// ─── INITIAL DATA ────────────────────────────────────────────────────────────
const TEAM = [
  { id: "joan",  name: "Joan",   role: "CEO / Photographer",    initials: "JO", color: "#1a1a18" },
  { id: "alex_t",name: "Alex T.", role: "Head of Art / Post",   initials: "AT", color: "#2d6a9f" },
  { id: "juan",  name: "Juan",   role: "EP / Business Dev",     initials: "JU", color: "#1a6648" },
  { id: "alvaro",name: "Álvaro", role: "Post Producer",         initials: "AL", color: "#7b3f00" },
  { id: "dani",  name: "Dani",   role: "Post Producer",         initials: "DA", color: "#6b21a8" },
  { id: "tati",  name: "Tati",   role: "Producer",              initials: "TA", color: "#be185d" },
  { id: "oscar", name: "Oscar",  role: "3D Artist",             initials: "OS", color: "#0e7490" },
  { id: "alex_l",name: "Alex L.", role: "Head of 3D",           initials: "AL", color: "#b45309" },
];

const PROJECT_TYPES = ["Digital Campaign","Photo/CGI","Post-Production","Pharma","Mixed"];
const STATUSES = ["Not started","In progress","Review","Done"];
const STATUS_COLORS = {
  "Not started": { bg: "#f4f4f1", text: "#9a9a96", border: "#e2e2de" },
  "In progress": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "Review":      { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Done":        { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
};

const SEED_PROJECTS = [
  {
    id: "p1", name: "Palmolive Thermal Spa", client: "Colgate-Palmolive",
    type: "Digital Campaign", status: "In progress",
    dueDate: "2026-04-15", description: "Digital assets 2026 — YT Bumpers, TT Stories, Meta Static/GIF, OOH",
    team: ["juan","alvaro"],
    deliverables: [
      { id:"d1",  label:"YT Bumper — Gentle Massage",   format:"Video 16:9", owner:"juan",   status:"In progress", delivery:true },
      { id:"d2",  label:"YT Bumper — Mineral Massage",  format:"Video 16:9", owner:"alvaro", status:"Not started", delivery:true },
      { id:"d3",  label:"YT Bumper — Refreshing Scrub", format:"Video 16:9", owner:"alvaro", status:"Not started", delivery:true },
      { id:"d4",  label:"YT Bumper — Smooth Butter",    format:"Video 16:9", owner:"juan",   status:"Not started", delivery:true },
      { id:"d5",  label:"TT Story — Gentle Massage",    format:"Video 9:16", owner:"alvaro", status:"Review",      delivery:true },
      { id:"d6",  label:"TT Story — Mineral Massage",   format:"Video 9:16", owner:"alvaro", status:"Not started", delivery:true },
      { id:"d7",  label:"TT Story — Refreshing Scrub",  format:"Video 9:16", owner:"alvaro", status:"Not started", delivery:true },
      { id:"d8",  label:"TT Story — Smooth Butter",     format:"Video 9:16", owner:"juan",   status:"Not started", delivery:true },
      { id:"d9",  label:"Meta Static — Gentle Massage", format:"Static 1:1", owner:"juan",   status:"Done",        delivery:false },
      { id:"d10", label:"Meta Static — Mineral Massage",format:"Static 1:1", owner:"alvaro", status:"Done",        delivery:false },
      { id:"d11", label:"Meta Static — Refreshing Scrub",format:"Static 1:1",owner:"alvaro", status:"Not started", delivery:false },
      { id:"d12", label:"Meta Static — Smooth Butter",  format:"Static 1:1", owner:"juan",   status:"Not started", delivery:false },
      { id:"d13", label:"Meta Static — Butter + Oil",   format:"Static 1:1", owner:"alvaro", status:"Not started", delivery:false },
      { id:"d14", label:"Meta GIF — Gentle Massage",    format:"GIF 1:1",    owner:"alvaro", status:"Not started", delivery:true },
      { id:"d15", label:"Meta GIF — Mineral Massage",   format:"GIF 1:1",    owner:"alvaro", status:"Not started", delivery:true },
      { id:"d16", label:"Meta GIF — Refreshing Scrub",  format:"GIF 1:1",    owner:"alvaro", status:"Not started", delivery:true },
      { id:"d17", label:"Meta GIF — Smooth Butter A",   format:"GIF 1:1",    owner:"juan",   status:"Not started", delivery:true },
      { id:"d18", label:"Meta GIF — Smooth Butter B",   format:"GIF 1:1",    owner:"juan",   status:"Not started", delivery:true },
      { id:"d19", label:"Banner Static — Option A",     format:"Static 1:1", owner:"juan",   status:"Not started", delivery:false },
      { id:"d20", label:"Banner Static — Option B",     format:"Static 1:1", owner:"juan",   status:"Not started", delivery:false },
      { id:"d21", label:"Meta Carousel",                format:"Static 1:1", owner:"alvaro", status:"Not started", delivery:false },
      { id:"d22", label:"Digital OOH",                  format:"Video 9:16", owner:"juan",   status:"Not started", delivery:true },
    ]
  },
  {
    id: "p2", name: "Vertex — Designed to Defy", client: "BGB Group / Vertex Pharma",
    type: "Pharma", status: "In progress",
    dueDate: "2026-05-30", description: "Povtenzi/povetacicept IgA Nephropathy campaign",
    team: ["juan","joan","alex_t","oscar"],
    deliverables: [
      { id:"e1", label:"CGI Hero Shot — Povtenzi pack", format:"CGI Still", owner:"oscar",  status:"In progress", delivery:false },
      { id:"e2", label:"CGI Animation — MOA sequence",  format:"Animation", owner:"alex_l", status:"Not started", delivery:true },
      { id:"e3", label:"Print KV — A4 landscape",       format:"Print",     owner:"alex_t", status:"Not started", delivery:false },
      { id:"e4", label:"Digital Banner 300x250",        format:"Digital",   owner:"alvaro", status:"Not started", delivery:false },
      { id:"e5", label:"Digital Banner 728x90",         format:"Digital",   owner:"alvaro", status:"Not started", delivery:false },
    ]
  },
  {
    id: "p3", name: "LVM Versicherung — Reise 2026", client: "Accenture Song / LVM",
    type: "Mixed", status: "In progress",
    dueDate: "2026-03-31", description: "Travel campaign — photography + outsourced 3D elements",
    team: ["joan","tati","dani"],
    deliverables: [
      { id:"f1", label:"Photography — Hero Travel Shot", format:"Photo",    owner:"joan",  status:"Done",        delivery:false },
      { id:"f2", label:"Photography — Lifestyle Set A",  format:"Photo",    owner:"joan",  status:"Done",        delivery:false },
      { id:"f3", label:"3D Environment — Beach Scene",   format:"CGI",      owner:"oscar", status:"In progress", delivery:false },
      { id:"f4", label:"Post — Hero Retouch",            format:"Post",     owner:"alex_t",status:"Review",      delivery:false },
      { id:"f5", label:"Post — Full Set Delivery",       format:"Post",     owner:"dani",  status:"Not started", delivery:false },
    ]
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getMember = (id) => TEAM.find(m => m.id === id);
const uid = () => Math.random().toString(36).slice(2, 9);
const daysUntil = (date) => {
  const d = new Date(date) - new Date();
  return Math.ceil(d / (1000 * 60 * 60 * 24));
};

// ─── AVATAR ──────────────────────────────────────────────────────────────────
function Avatar({ memberId, size = 28 }) {
  const m = getMember(memberId);
  if (!m) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: m.color + "22", border: `1.5px solid ${m.color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 600, color: m.color,
      fontFamily: "var(--mono)", flexShrink: 0, userSelect: "none"
    }}>{m.initials}</div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status, onClick, small }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS["Not started"];
  return (
    <span onClick={onClick} style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 99, padding: small ? "2px 8px" : "3px 10px",
      fontSize: small ? 10 : 11, fontFamily: "var(--mono)", fontWeight: 500,
      cursor: onClick ? "pointer" : "default", whiteSpace: "nowrap",
      userSelect: "none", transition: "opacity 0.15s"
    }}>{status}</span>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ value, color = "#1a6648" }) {
  return (
    <div style={{ height: 4, background: "#e8e8e4", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.4s ease" }} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [view, setView] = useState("dashboard"); // dashboard | project | workload | archive
  const [activeProject, setActiveProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewDeliverable, setShowNewDeliverable] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const updateDeliverable = (projectId, deliverableId, field, value) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : {
      ...p,
      deliverables: p.deliverables.map(d => d.id !== deliverableId ? d : { ...d, [field]: value })
    }));
    showToast("Saved");
  };

  const addDeliverable = (projectId, data) => {
    setProjects(prev => prev.map(p => p.id !== projectId ? p : {
      ...p, deliverables: [...p.deliverables, { id: uid(), ...data, status: "Not started" }]
    }));
    showToast("Deliverable added");
  };

  const addProject = (data) => {
    setProjects(prev => [...prev, { id: uid(), ...data, deliverables: [] }]);
    showToast("Project created");
  };

  const proj = activeProject ? projects.find(p => p.id === activeProject) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f1", fontFamily: "var(--body)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        :root { --body: 'DM Sans', sans-serif; --display: 'Instrument Serif', serif; --mono: 'DM Mono', monospace; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; font-family: var(--body); }
        input, select, textarea { font-family: var(--body); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #d0d0cc; border-radius: 99px; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, background: "#1a1a18", display: "flex", flexDirection: "column", zIndex: 100 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #2e2e2b" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 20, color: "#f4f4f1", lineHeight: 1.1 }}>Garrigosa</div>
          <div style={{ fontSize: 10, color: "#6b6b68", fontFamily: "var(--mono)", marginTop: 4, letterSpacing: "0.08em" }}>STUDIO PLATFORM</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { id: "dashboard", icon: "⬡", label: "Dashboard" },
            { id: "workload",  icon: "◎", label: "Workload" },
            { id: "archive",   icon: "○", label: "Archive" },
          ].map(item => (
            <button key={item.id} onClick={() => { setView(item.id); setActiveProject(null); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              borderRadius: 8, border: "none", background: view === item.id && !activeProject ? "#2e2e2b" : "transparent",
              color: view === item.id && !activeProject ? "#f4f4f1" : "#9a9a96",
              fontSize: 13, fontWeight: 500, textAlign: "left", transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
            </button>
          ))}
          <div style={{ margin: "16px 0 8px 12px", fontSize: 10, color: "#4a4a47", fontFamily: "var(--mono)", letterSpacing: "0.08em" }}>PROJECTS</div>
          {projects.filter(p => p.status !== "Done").map(p => {
            const done = p.deliverables.filter(d => d.status === "Done").length;
            const pct = p.deliverables.length ? Math.round(done / p.deliverables.length * 100) : 0;
            return (
              <button key={p.id} onClick={() => { setView("project"); setActiveProject(p.id); }} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                borderRadius: 8, border: "none",
                background: activeProject === p.id ? "#2e2e2b" : "transparent",
                color: activeProject === p.id ? "#f4f4f1" : "#9a9a96",
                fontSize: 12, fontWeight: 500, textAlign: "left", transition: "all 0.15s"
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: pct === 100 ? "#4ade80" : pct > 0 ? "#60a5fa" : "#4a4a47", flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{p.name}</span>
                <span style={{ fontSize: 10, color: "#6b6b68", fontFamily: "var(--mono)", flexShrink: 0 }}>{pct}%</span>
              </button>
            );
          })}
          <button onClick={() => setShowNewProject(true)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
            borderRadius: 8, border: "1px dashed #3a3a38", background: "transparent",
            color: "#6b6b68", fontSize: 12, marginTop: 4, transition: "all 0.15s"
          }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New project
          </button>
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #2e2e2b" }}>
          <div style={{ fontSize: 11, color: "#4a4a47", fontFamily: "var(--mono)" }}>v1.0 · internal</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 220, minHeight: "100vh" }}>
        {view === "dashboard" && !activeProject && <Dashboard projects={projects} onOpenProject={(id) => { setActiveProject(id); setView("project"); }} onNewProject={() => setShowNewProject(true)} />}
        {view === "project" && proj && <ProjectView project={proj} team={TEAM} onUpdate={(did, field, val) => updateDeliverable(proj.id, did, field, val)} onAddDeliverable={(data) => addDeliverable(proj.id, data)} showNewDeliverable={showNewDeliverable} setShowNewDeliverable={setShowNewDeliverable} showToast={showToast} />}
        {view === "workload" && <WorkloadView projects={projects} />}
        {view === "archive" && <ArchiveView projects={projects.filter(p => p.status === "Done")} />}
      </div>

      {/* NEW PROJECT MODAL */}
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} onSave={(data) => { addProject(data); setShowNewProject(false); }} />}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#1a1a18", color: "#f4f4f1", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontFamily: "var(--mono)", zIndex: 999, animation: "fadeIn 0.2s ease" }}>
          ✓ {toast}
          <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px)} to { opacity:1; transform:translateY(0)} }`}</style>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ projects, onOpenProject, onNewProject }) {
  const active = projects.filter(p => p.status !== "Done");
  const totalDeliverables = active.reduce((a, p) => a + p.deliverables.length, 0);
  const doneDeliverables = active.reduce((a, p) => a + p.deliverables.filter(d => d.status === "Done").length, 0);
  const inReview = active.reduce((a, p) => a + p.deliverables.filter(d => d.status === "Review").length, 0);

  return (
    <div style={{ padding: "40px 40px 60px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 32, color: "#1a1a18", marginBottom: 6 }}>
          Studio Overview
        </div>
        <div style={{ fontSize: 13, color: "#9a9a96" }}>
          {active.length} active projects · {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Active Projects", value: active.length, color: "#1a1a18" },
          { label: "Total Deliverables", value: totalDeliverables, color: "#1a1a18" },
          { label: "Delivered", value: doneDeliverables, color: "#166534" },
          { label: "In Review", value: inReview, color: "#c2410c" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", border: "1px solid #e2e2de", borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontSize: 32, fontWeight: 600, color: s.color, fontFamily: "var(--display)", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#9a9a96", marginTop: 6, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* PROJECT CARDS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a18", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "var(--mono)" }}>Active Projects</div>
        <button onClick={onNewProject} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 99, border: "1px solid #1a1a18", background: "#1a1a18", color: "white", fontWeight: 500 }}>+ New project</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {active.map(p => <ProjectCard key={p.id} project={p} onClick={() => onOpenProject(p.id)} />)}
      </div>
    </div>
  );
}

function ProjectCard({ project: p, onClick }) {
  const done = p.deliverables.filter(d => d.status === "Done").length;
  const pct = p.deliverables.length ? Math.round(done / p.deliverables.length * 100) : 0;
  const days = daysUntil(p.dueDate);
  const urgent = days <= 7;

  return (
    <div onClick={onClick} style={{
      background: "white", border: "1px solid #e2e2de", borderRadius: 12,
      padding: "20px", cursor: "pointer", transition: "all 0.15s",
      borderLeft: `3px solid ${urgent ? "#f97316" : "#1a1a18"}`
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18", marginBottom: 2 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: "#9a9a96", fontFamily: "var(--mono)" }}>{p.client}</div>
        </div>
        <StatusBadge status={p.status} small />
      </div>
      <div style={{ fontSize: 11, color: "#9a9a96", fontFamily: "var(--mono)", marginBottom: 12,
        background: "#f7f7f5", padding: "3px 8px", borderRadius: 99, display: "inline-block" }}>{p.type}</div>
      <ProgressBar value={pct} color={pct === 100 ? "#16a34a" : "#1a6648"} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <div style={{ fontSize: 11, color: "#9a9a96" }}>{done}/{p.deliverables.length} delivered</div>
        <div style={{ fontSize: 11, color: urgent ? "#f97316" : "#9a9a96", fontFamily: "var(--mono)", fontWeight: urgent ? 600 : 400 }}>
          {days > 0 ? `${days}d left` : days === 0 ? "due today" : "overdue"}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
        {p.team.slice(0, 5).map(id => <Avatar key={id} memberId={id} size={24} />)}
        {p.team.length > 5 && <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f4f4f1", border: "1px solid #e2e2de", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#9a9a96" }}>+{p.team.length - 5}</div>}
      </div>
    </div>
  );
}

// ─── PROJECT VIEW ─────────────────────────────────────────────────────────────
function ProjectView({ project: p, team, onUpdate, onAddDeliverable, showNewDeliverable, setShowNewDeliverable, showToast }) {
  const done = p.deliverables.filter(d => d.status === "Done").length;
  const pct = p.deliverables.length ? Math.round(done / p.deliverables.length * 100) : 0;
  const [filter, setFilter] = useState("All");
  const [cycleStatus, setCycleStatus] = useState({});

  const nextStatus = (current) => {
    const idx = STATUSES.indexOf(current);
    return STATUSES[(idx + 1) % STATUSES.length];
  };

  const handleStatusCycle = (d) => {
    const next = nextStatus(d.status);
    onUpdate(d.id, "status", next);
  };

  const filtered = filter === "All" ? p.deliverables : p.deliverables.filter(d =>
    filter === "Mine" ? d.owner === "juan" : d.status === filter
  );

  const DELIVERY_SPEC = ["Master in .mov", "Master in .mp4", "Clean version .mov (no supers)", "Supers", "Stems", "Mixes"];
  const [expandedDelivery, setExpandedDelivery] = useState({});

  return (
    <div style={{ padding: "40px 40px 60px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 30, color: "#1a1a18", lineHeight: 1.2 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: "#9a9a96", marginTop: 4 }}>{p.client} · <span style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{p.type}</span></div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <StatusBadge status={p.status} />
            <button onClick={() => setShowNewDeliverable(true)} style={{
              fontSize: 12, padding: "7px 16px", borderRadius: 99, border: "none",
              background: "#1a1a18", color: "white", fontWeight: 500
            }}>+ Add deliverable</button>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#6b6b68", marginBottom: 16 }}>{p.description}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 320 }}>
            <ProgressBar value={pct} />
          </div>
          <div style={{ fontSize: 12, color: "#9a9a96", fontFamily: "var(--mono)", whiteSpace: "nowrap" }}>
            {done}/{p.deliverables.length} · {pct}%
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {p.team.map(id => <Avatar key={id} memberId={id} size={26} />)}
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {STATUSES.map(s => {
          const count = p.deliverables.filter(d => d.status === s).length;
          const c = STATUS_COLORS[s];
          return (
            <div key={s} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px 14px", display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: c.text }}>{count}</span>
              <span style={{ fontSize: 10, color: c.text, fontFamily: "var(--mono)" }}>{s}</span>
            </div>
          );
        })}
      </div>

      {/* FILTER */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["All", "In progress", "Review", "Done", "Not started"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontSize: 11, padding: "5px 12px", borderRadius: 99, fontFamily: "var(--mono)",
            border: `1px solid ${filter === f ? "#1a1a18" : "#e2e2de"}`,
            background: filter === f ? "#1a1a18" : "white",
            color: filter === f ? "white" : "#6b6b68", fontWeight: 500
          }}>{f}</button>
        ))}
      </div>

      {/* DELIVERABLES TABLE */}
      <div style={{ background: "white", border: "1px solid #e2e2de", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 130px 80px 80px", padding: "10px 16px", borderBottom: "1px solid #f4f4f1", background: "#fafaf8" }}>
          {["Deliverable", "Format", "Owner", "Status", "Delivery"].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, color: "#9a9a96", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</div>
          ))}
        </div>
        {filtered.map((d, i) => {
          const owner = getMember(d.owner);
          const isExpanded = expandedDelivery[d.id];
          return (
            <div key={d.id}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 110px 130px 80px 80px",
                padding: "11px 16px", borderBottom: i < filtered.length - 1 ? "1px solid #f4f4f1" : "none",
                background: d.status === "Done" ? "#fafff9" : "white", alignItems: "center",
                transition: "background 0.15s"
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: d.status === "Done" ? "#9a9a96" : "#1a1a18",
                  textDecoration: d.status === "Done" ? "line-through" : "none" }}>{d.label}</div>
                <div style={{ fontSize: 11, color: "#9a9a96", fontFamily: "var(--mono)" }}>{d.format}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {owner && <><Avatar memberId={d.owner} size={22} /><span style={{ fontSize: 12, color: "#6b6b68" }}>{owner.name}</span></>}
                </div>
                <div><StatusBadge status={d.status} small onClick={() => handleStatusCycle(d)} /></div>
                <div>
                  {d.delivery && (
                    <button onClick={() => setExpandedDelivery(prev => ({ ...prev, [d.id]: !prev[d.id] }))} style={{
                      fontSize: 10, padding: "3px 8px", borderRadius: 6,
                      border: "1px solid #e2e2de", background: "transparent",
                      color: "#9a9a96", fontFamily: "var(--mono)"
                    }}>{isExpanded ? "▾" : "▸"} specs</button>
                  )}
                </div>
              </div>
              {isExpanded && d.delivery && (
                <div style={{ padding: "10px 16px 14px 16px", background: "#fafaf8", borderBottom: "1px solid #f4f4f1" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#9a9a96", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Delivery package required</div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {DELIVERY_SPEC.map(spec => (
                      <div key={spec} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b6b68" }}>
                        <div style={{ width: 14, height: 14, borderRadius: 4, border: "1.5px solid #d0d0cc", background: "white", flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#9a9a96", fontSize: 13 }}>No deliverables match this filter</div>
        )}
      </div>

      {showNewDeliverable && (
        <NewDeliverableModal team={team} onClose={() => setShowNewDeliverable(false)} onSave={(data) => { onAddDeliverable(data); setShowNewDeliverable(false); }} />
      )}
    </div>
  );
}

// ─── WORKLOAD VIEW ────────────────────────────────────────────────────────────
function WorkloadView({ projects }) {
  const active = projects.filter(p => p.status !== "Done");
  const workload = TEAM.map(m => {
    const items = active.flatMap(p => p.deliverables.filter(d => d.owner === m.id).map(d => ({ ...d, project: p.name })));
    const todo = items.filter(d => d.status !== "Done").length;
    const done = items.filter(d => d.status === "Done").length;
    return { ...m, items, todo, done, total: items.length };
  }).filter(m => m.total > 0);

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ fontFamily: "var(--display)", fontSize: 30, color: "#1a1a18", marginBottom: 6 }}>Workload</div>
      <div style={{ fontSize: 13, color: "#9a9a96", marginBottom: 28 }}>Active deliverables per team member across all projects</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {workload.map(m => {
          const pct = m.total ? Math.round(m.done / m.total * 100) : 0;
          return (
            <div key={m.id} style={{ background: "white", border: "1px solid #e2e2de", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Avatar memberId={m.id} size={36} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18" }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "#9a9a96" }}>{m.role}</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: m.todo > 0 ? "#1a1a18" : "#4ade80", fontFamily: "var(--display)" }}>{m.todo}</div>
                  <div style={{ fontSize: 10, color: "#9a9a96", fontFamily: "var(--mono)" }}>pending</div>
                </div>
              </div>
              <ProgressBar value={pct} color={m.color} />
              <div style={{ fontSize: 11, color: "#9a9a96", marginTop: 6, marginBottom: 12, fontFamily: "var(--mono)" }}>{m.done}/{m.total} delivered · {pct}%</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {m.items.slice(0, 4).map(d => (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", background: "#fafaf8", borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: "#6b6b68", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{d.label}</div>
                    <StatusBadge status={d.status} small />
                  </div>
                ))}
                {m.items.length > 4 && <div style={{ fontSize: 11, color: "#9a9a96", textAlign: "center", fontFamily: "var(--mono)", padding: "4px 0" }}>+{m.items.length - 4} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ARCHIVE VIEW ─────────────────────────────────────────────────────────────
function ArchiveView({ projects }) {
  if (projects.length === 0) return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--display)", fontSize: 30, color: "#1a1a18", marginBottom: 8 }}>Archive</div>
      <div style={{ fontSize: 13, color: "#9a9a96" }}>Completed projects will appear here.</div>
    </div>
  );
  return (
    <div style={{ padding: "40px" }}>
      <div style={{ fontFamily: "var(--display)", fontSize: 30, color: "#1a1a18", marginBottom: 24 }}>Archive</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 12 }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: "white", border: "1px solid #e2e2de", borderRadius: 12, padding: "18px 20px", opacity: 0.7 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a18", marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#9a9a96", fontFamily: "var(--mono)", marginBottom: 10 }}>{p.client}</div>
            <div style={{ fontSize: 12, color: "#166534" }}>✓ {p.deliverables.length} deliverables completed</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
      <div style={{ background: "white", borderRadius: 14, padding: "28px 28px 24px", width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 22, color: "#1a1a18" }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#9a9a96", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid #e2e2de", borderRadius: 8, fontSize: 13, marginTop: 6, outline: "none", background: "#fafaf8" };
const labelStyle = { fontSize: 11, fontWeight: 600, color: "#6b6b68", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "DM Mono, monospace" };

function NewProjectModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", client: "", type: "Digital Campaign", status: "Not started", dueDate: "", description: "", team: [] });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleTeam = (id) => set("team", form.team.includes(id) ? form.team.filter(x => x !== id) : [...form.team, id]);
  return (
    <Modal title="New project" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div><label style={labelStyle}>Project name</label><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Vertex — Designed to Defy" /></div>
        <div><label style={labelStyle}>Client</label><input style={inputStyle} value={form.client} onChange={e => set("client", e.target.value)} placeholder="e.g. BGB Group / Vertex Pharma" /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label style={labelStyle}>Type</label><select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value)}>{PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label style={labelStyle}>Due date</label><input type="date" style={inputStyle} value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></div>
        </div>
        <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 70 }} value={form.description} onChange={e => set("description", e.target.value)} /></div>
        <div>
          <label style={labelStyle}>Team</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {TEAM.map(m => (
              <button key={m.id} onClick={() => toggleTeam(m.id)} style={{
                padding: "5px 12px", borderRadius: 99, fontSize: 12, border: `1.5px solid ${form.team.includes(m.id) ? m.color : "#e2e2de"}`,
                background: form.team.includes(m.id) ? m.color + "18" : "white", color: form.team.includes(m.id) ? m.color : "#6b6b68", fontWeight: 500
              }}>{m.name}</button>
            ))}
          </div>
        </div>
        <button onClick={() => form.name && onSave(form)} style={{ marginTop: 4, padding: "10px", borderRadius: 8, border: "none", background: "#1a1a18", color: "white", fontSize: 13, fontWeight: 600 }}>Create project</button>
      </div>
    </Modal>
  );
}

function NewDeliverableModal({ team, onClose, onSave }) {
  const [form, setForm] = useState({ label: "", format: "", owner: "juan", delivery: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title="Add deliverable" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div><label style={labelStyle}>Deliverable name</label><input style={inputStyle} value={form.label} onChange={e => set("label", e.target.value)} placeholder="e.g. YT Bumper — Gentle Massage" /></div>
        <div><label style={labelStyle}>Format</label><input style={inputStyle} value={form.format} onChange={e => set("format", e.target.value)} placeholder="e.g. Video 16:9, Static 1:1" /></div>
        <div><label style={labelStyle}>Owner</label>
          <select style={inputStyle} value={form.owner} onChange={e => set("owner", e.target.value)}>
            {team.map(m => <option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <input type="checkbox" id="delivery" checked={form.delivery} onChange={e => set("delivery", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1a1a18" }} />
          <label htmlFor="delivery" style={{ ...labelStyle, textTransform: "none", letterSpacing: 0, fontSize: 13, cursor: "pointer" }}>Requires full delivery package (mov, mp4, stems, mixes)</label>
        </div>
        <button onClick={() => form.label && onSave(form)} style={{ marginTop: 4, padding: "10px", borderRadius: 8, border: "none", background: "#1a1a18", color: "white", fontSize: 13, fontWeight: 600 }}>Add deliverable</button>
      </div>
    </Modal>
  );
}
