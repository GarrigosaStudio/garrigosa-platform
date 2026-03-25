import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

// ─── TEAM ────────────────────────────────────────────────────────────────────
const TEAM = [
  { id: "joan",   name: "Joan",    role: "CEO / Photographer",  initials: "JO", color: "#1a1a18" },
  { id: "alex_t", name: "Alex T.", role: "Head of Art / Post",  initials: "AT", color: "#2d6a9f" },
  { id: "juan",   name: "Juan",    role: "EP / Business Dev",   initials: "JU", color: "#1a6648" },
  { id: "alvaro", name: "Álvaro",  role: "Post Producer",       initials: "AL", color: "#7b3f00" },
  { id: "dani",   name: "Dani",    role: "Post Producer",       initials: "DA", color: "#6b21a8" },
  { id: "tati",   name: "Tati",    role: "Producer",            initials: "TA", color: "#be185d" },
  { id: "oscar",  name: "Oscar",   role: "3D Artist",           initials: "OS", color: "#0e7490" },
  { id: "alex_l", name: "Alex L.", role: "Head of 3D",          initials: "AL", color: "#b45309" },
];

const PROJECT_TYPES = ["Digital Campaign","Photo/CGI","Post-Production","Pharma","Mixed"];
const STATUSES = ["Not started","In progress","Review","Done"];
const SC = {
  "Not started": { bg:"#f4f4f1", text:"#9a9a96", border:"#e2e2de" },
  "In progress":  { bg:"#eff6ff", text:"#1d4ed8", border:"#bfdbfe" },
  "Review":       { bg:"#fff7ed", text:"#c2410c", border:"#fed7aa" },
  "Done":         { bg:"#f0fdf4", text:"#166534", border:"#bbf7d0" },
};
const DELIVERY_SPECS = ["Master in .mov","Master in .mp4","Clean version .mov (no supers)","Supers","Stems","Mixes"];

const SEED_PROJECTS = [
  { id:"p1", name:"Palmolive Thermal Spa", client:"Colgate-Palmolive", type:"Digital Campaign", status:"In progress", due_date:"2026-04-15", description:"Digital assets 2026 — YT Bumpers, TT Stories, Meta Static/GIF, OOH", team:["juan","alvaro"] },
  { id:"p2", name:"Vertex — Designed to Defy", client:"BGB Group / Vertex Pharma", type:"Pharma", status:"In progress", due_date:"2026-05-30", description:"Povtenzi IgA Nephropathy campaign — CGI + print", team:["juan","joan","oscar","alex_l"] },
  { id:"p3", name:"LVM Versicherung — Reise 2026", client:"Accenture Song / LVM", type:"Mixed", status:"In progress", due_date:"2026-03-31", description:"Travel campaign — photography + outsourced 3D elements", team:["joan","tati","dani"] },
];

const SEED_DELIVERABLES = [
  {id:"d1",project_id:"p1",label:"YT Bumper — Gentle Massage",format:"Video 16:9",owner:"juan",status:"In progress",delivery:true},
  {id:"d2",project_id:"p1",label:"YT Bumper — Mineral Massage",format:"Video 16:9",owner:"alvaro",status:"Not started",delivery:true},
  {id:"d3",project_id:"p1",label:"YT Bumper — Refreshing Scrub",format:"Video 16:9",owner:"alvaro",status:"Not started",delivery:true},
  {id:"d4",project_id:"p1",label:"YT Bumper — Smooth Butter",format:"Video 16:9",owner:"juan",status:"Not started",delivery:true},
  {id:"d5",project_id:"p1",label:"TT Story — Gentle Massage",format:"Video 9:16",owner:"alvaro",status:"Review",delivery:true},
  {id:"d6",project_id:"p1",label:"TT Story — Mineral Massage",format:"Video 9:16",owner:"alvaro",status:"Not started",delivery:true},
  {id:"d7",project_id:"p1",label:"TT Story — Refreshing Scrub",format:"Video 9:16",owner:"alvaro",status:"Not started",delivery:true},
  {id:"d8",project_id:"p1",label:"TT Story — Smooth Butter",format:"Video 9:16",owner:"juan",status:"Not started",delivery:true},
  {id:"d9",project_id:"p1",label:"Meta Static — Gentle Massage",format:"Static 1:1",owner:"juan",status:"Done",delivery:false},
  {id:"d10",project_id:"p1",label:"Meta Static — Mineral Massage",format:"Static 1:1",owner:"alvaro",status:"Done",delivery:false},
  {id:"d11",project_id:"p1",label:"Meta Static — Refreshing Scrub",format:"Static 1:1",owner:"alvaro",status:"Not started",delivery:false},
  {id:"d12",project_id:"p1",label:"Meta Static — Smooth Butter",format:"Static 1:1",owner:"juan",status:"Not started",delivery:false},
  {id:"d13",project_id:"p1",label:"Meta Static — Butter + Oil",format:"Static 1:1",owner:"alvaro",status:"Not started",delivery:false},
  {id:"d14",project_id:"p1",label:"Meta GIF — Gentle Massage",format:"GIF 1:1",owner:"alvaro",status:"Not started",delivery:true},
  {id:"d15",project_id:"p1",label:"Meta GIF — Mineral Massage",format:"GIF 1:1",owner:"alvaro",status:"Not started",delivery:true},
  {id:"d16",project_id:"p1",label:"Meta GIF — Refreshing Scrub",format:"GIF 1:1",owner:"alvaro",status:"Not started",delivery:true},
  {id:"d17",project_id:"p1",label:"Meta GIF — Smooth Butter A",format:"GIF 1:1",owner:"juan",status:"Not started",delivery:true},
  {id:"d18",project_id:"p1",label:"Meta GIF — Smooth Butter B",format:"GIF 1:1",owner:"juan",status:"Not started",delivery:true},
  {id:"d19",project_id:"p1",label:"Banner Static — Option A",format:"Static 1:1",owner:"juan",status:"Not started",delivery:false},
  {id:"d20",project_id:"p1",label:"Banner Static — Option B",format:"Static 1:1",owner:"juan",status:"Not started",delivery:false},
  {id:"d21",project_id:"p1",label:"Meta Carousel",format:"Static 1:1",owner:"alvaro",status:"Not started",delivery:false},
  {id:"d22",project_id:"p1",label:"Digital OOH",format:"Video 9:16",owner:"juan",status:"Not started",delivery:true},
  {id:"e1",project_id:"p2",label:"CGI Hero Shot — Povtenzi pack",format:"CGI Still",owner:"oscar",status:"In progress",delivery:false},
  {id:"e2",project_id:"p2",label:"CGI Animation — MOA sequence",format:"Animation",owner:"alex_l",status:"Not started",delivery:true},
  {id:"e3",project_id:"p2",label:"Print KV — A4 landscape",format:"Print",owner:"alex_t",status:"Not started",delivery:false},
  {id:"e4",project_id:"p2",label:"Digital Banner 300x250",format:"Digital",owner:"alvaro",status:"Not started",delivery:false},
  {id:"e5",project_id:"p2",label:"Digital Banner 728x90",format:"Digital",owner:"alvaro",status:"Not started",delivery:false},
  {id:"f1",project_id:"p3",label:"Photography — Hero Travel Shot",format:"Photo",owner:"joan",status:"Done",delivery:false},
  {id:"f2",project_id:"p3",label:"Photography — Lifestyle Set A",format:"Photo",owner:"joan",status:"Done",delivery:false},
  {id:"f3",project_id:"p3",label:"3D Environment — Beach Scene",format:"CGI",owner:"oscar",status:"In progress",delivery:false},
  {id:"f4",project_id:"p3",label:"Post — Hero Retouch",format:"Post",owner:"alex_t",status:"Review",delivery:false},
  {id:"f5",project_id:"p3",label:"Post — Full Set Delivery",format:"Post",owner:"dani",status:"Not started",delivery:false},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getMember = (id) => TEAM.find(m => m.id === id);
const uid = () => Math.random().toString(36).slice(2, 9);
const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / (1000*60*60*24));
const pct = (deliverables) => deliverables.length ? Math.round(deliverables.filter(d => d.status==="Done").length / deliverables.length * 100) : 0;
const nextStatus = (s) => { const i = STATUSES.indexOf(s); return STATUSES[(i+1) % STATUSES.length]; };

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Avatar({ memberId, size=28 }) {
  const m = getMember(memberId);
  if (!m) return null;
  return <div style={{width:size,height:size,borderRadius:"50%",background:m.color+"22",border:`1.5px solid ${m.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.32,fontWeight:600,color:m.color,fontFamily:"'DM Mono',monospace",flexShrink:0,userSelect:"none"}}>{m.initials}</div>;
}

function StatusBadge({ status, onClick, small }) {
  const c = SC[status] || SC["Not started"];
  return <span onClick={onClick} style={{background:c.bg,color:c.text,border:`1px solid ${c.border}`,borderRadius:99,padding:small?"2px 8px":"3px 10px",fontSize:small?10:11,fontFamily:"'DM Mono',monospace",fontWeight:500,cursor:onClick?"pointer":"default",whiteSpace:"nowrap",userSelect:"none"}}>{status}</span>;
}

function ProgressBar({ value, color="#1a6648" }) {
  return <div style={{height:4,background:"#e8e8e4",borderRadius:99,overflow:"hidden"}}><div style={{width:`${value}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.4s ease"}}/></div>;
}

function Toast({ msg }) {
  return <div style={{position:"fixed",bottom:22,right:22,background:"#1a1a18",color:"#f4f4f1",padding:"10px 18px",borderRadius:8,fontSize:11,fontFamily:"'DM Mono',monospace",zIndex:300,animation:"fadeUp 0.2s ease"}}>✓ {msg}<style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style></div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [expandedDelivery, setExpandedDelivery] = useState({});
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewDeliverable, setShowNewDeliverable] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // ── LOAD DATA ──────────────────────────────────────────────────────────────
  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      let { data: projData } = await supabase.from("projects").select("*").order("created_at");
      let { data: delData } = await supabase.from("deliverables").select("*").order("created_at");

      // Seed initial data if empty
      if (!projData || projData.length === 0) {
        await supabase.from("projects").insert(SEED_PROJECTS);
        await supabase.from("deliverables").insert(SEED_DELIVERABLES);
        projData = SEED_PROJECTS;
        delData = SEED_DELIVERABLES;
      }

      setProjects(projData || []);
      setDeliverables(delData || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setProjects(SEED_PROJECTS);
      setDeliverables(SEED_DELIVERABLES);
    }
    setLoading(false);
  }

  // ── MUTATIONS ──────────────────────────────────────────────────────────────
  async function updateDeliverableStatus(id, newStatus) {
    setDeliverables(prev => prev.map(d => d.id === id ? {...d, status: newStatus} : d));
    await supabase.from("deliverables").update({ status: newStatus }).eq("id", id);
    showToast("Status updated");
  }

  async function addProject(data) {
    const newProj = { id: uid(), ...data, status: "Not started" };
    setProjects(prev => [...prev, newProj]);
    await supabase.from("projects").insert(newProj);
    showToast("Project created");
  }

  async function addDeliverable(data) {
    const newDel = { id: uid(), project_id: activeProjectId, ...data, status: "Not started" };
    setDeliverables(prev => [...prev, newDel]);
    await supabase.from("deliverables").insert(newDel);
    showToast("Deliverable added");
  }

  // ── DERIVED ────────────────────────────────────────────────────────────────
  const activeProjects = projects.filter(p => p.status !== "Done");
  const proj = projects.find(p => p.id === activeProjectId);
  const projDeliverables = (id) => deliverables.filter(d => d.project_id === id);

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#f4f4f1"}}>
      <div style={{fontFamily:"'Instrument Serif',serif",fontSize:24,color:"#1a1a18"}}>Loading Garrigosa Platform…</div>
    </div>
  );

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`button{cursor:pointer;font-family:'DM Sans',sans-serif}input,select,textarea{font-family:'DM Sans',sans-serif}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#d0d0cc;border-radius:99px}`}</style>

      {/* SIDEBAR */}
      <div style={{width:210,background:"#1a1a18",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"20px 18px 16px",borderBottom:"1px solid #2e2e2b"}}>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20,color:"#f4f4f1",lineHeight:1.1}}>Garrigosa</div>
          <div style={{fontSize:9,color:"#6b6b68",fontFamily:"'DM Mono',monospace",marginTop:4,letterSpacing:"0.08em"}}>STUDIO PLATFORM</div>
        </div>
        <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {[["dashboard","⬡","Dashboard"],["workload","◎","Workload"],["archive","○","Archive"]].map(([id,icon,label]) => (
            <button key={id} onClick={() => {setView(id);setActiveProjectId(null);setFilter("All");}} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",borderRadius:7,border:"none",background:view===id&&!activeProjectId?"#2e2e2b":"transparent",color:view===id&&!activeProjectId?"#f4f4f1":"#9a9a96",fontSize:12,fontWeight:500,textAlign:"left",transition:"all 0.15s"}}>
              <span style={{fontSize:14}}>{icon}</span>{label}
            </button>
          ))}
          <div style={{margin:"14px 0 6px 11px",fontSize:9,color:"#4a4a47",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em"}}>PROJECTS</div>
          {activeProjects.map(p => {
            const dels = projDeliverables(p.id);
            const pc = pct(dels);
            return (
              <button key={p.id} onClick={() => {setView("project");setActiveProjectId(p.id);setFilter("All");}} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 11px",borderRadius:7,border:"none",background:activeProjectId===p.id?"#2e2e2b":"transparent",color:activeProjectId===p.id?"#f4f4f1":"#9a9a96",fontSize:11,fontWeight:500,textAlign:"left",transition:"all 0.15s"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:pc===100?"#4ade80":pc>0?"#60a5fa":"#4a4a47",flexShrink:0}}/>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{p.name}</span>
                <span style={{fontSize:9,color:"#6b6b68",fontFamily:"'DM Mono',monospace",flexShrink:0}}>{pc}%</span>
              </button>
            );
          })}
          <button onClick={() => setShowNewProject(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 11px",borderRadius:7,border:"1px dashed #3a3a38",background:"transparent",color:"#6b6b68",fontSize:11,marginTop:4,transition:"all 0.15s"}}>
            <span style={{fontSize:15,lineHeight:1}}>+</span> New project
          </button>
        </nav>
        <div style={{padding:"14px 18px",borderTop:"1px solid #2e2e2b",fontSize:10,color:"#4a4a47",fontFamily:"'DM Mono',monospace"}}>v1.0 · garrigosa studio</div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflowY:"auto",minWidth:0}}>
        {view==="dashboard" && !activeProjectId && <Dashboard projects={activeProjects} projDeliverables={projDeliverables} onOpenProject={(id) => {setActiveProjectId(id);setView("project");}} onNewProject={() => setShowNewProject(true)} />}
        {view==="project" && proj && <ProjectView project={proj} deliverables={projDeliverables(proj.id)} filter={filter} setFilter={setFilter} expandedDelivery={expandedDelivery} setExpandedDelivery={setExpandedDelivery} onStatusChange={updateDeliverableStatus} onAddDeliverable={() => setShowNewDeliverable(true)} />}
        {view==="workload" && <WorkloadView projects={activeProjects} projDeliverables={projDeliverables} />}
        {view==="archive" && <ArchiveView projects={projects.filter(p=>p.status==="Done")} projDeliverables={projDeliverables} />}
      </div>

      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} onSave={(d) => {addProject(d);setShowNewProject(false);}} />}
      {showNewDeliverable && activeProjectId && <NewDeliverableModal onClose={() => setShowNewDeliverable(false)} onSave={(d) => {addDeliverable(d);setShowNewDeliverable(false);}} />}
      {toast && <Toast msg={toast} />}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ projects, projDeliverables, onOpenProject, onNewProject }) {
  const allDels = projects.flatMap(p => projDeliverables(p.id));
  const stats = [
    ["Active Projects", projects.length, "#1a1a18"],
    ["Total Deliverables", allDels.length, "#1a1a18"],
    ["Delivered", allDels.filter(d=>d.status==="Done").length, "#166534"],
    ["In Review", allDels.filter(d=>d.status==="Review").length, "#c2410c"],
  ];
  return (
    <div style={{padding:"32px 36px 56px"}}>
      <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,color:"#1a1a18",marginBottom:5}}>Studio Overview</div>
      <div style={{fontSize:12,color:"#9a9a96",marginBottom:24}}>{projects.length} active projects · {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:26}}>
        {stats.map(([l,v,c]) => (
          <div key={l} style={{background:"white",border:"1px solid #e2e2de",borderRadius:10,padding:"16px 18px"}}>
            <div style={{fontSize:28,fontWeight:600,color:c,fontFamily:"'Instrument Serif',serif",lineHeight:1}}>{v}</div>
            <div style={{fontSize:10,color:"#9a9a96",marginTop:5,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:600,color:"#1a1a18",textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:"'DM Mono',monospace"}}>Active Projects</div>
        <button onClick={onNewProject} style={{fontSize:11,padding:"7px 16px",borderRadius:99,border:"none",background:"#1a1a18",color:"white",fontWeight:500}}>+ New project</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
        {projects.map(p => <ProjectCard key={p.id} project={p} deliverables={projDeliverables(p.id)} onClick={() => onOpenProject(p.id)} />)}
      </div>
    </div>
  );
}

function ProjectCard({ project: p, deliverables, onClick }) {
  const pc = pct(deliverables);
  const days = daysUntil(p.due_date);
  const urgent = days <= 7;
  const tc = SC[p.status] || SC["Not started"];
  return (
    <div onClick={onClick} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"} style={{background:"white",border:"1px solid #e2e2de",borderRadius:10,padding:18,cursor:"pointer",transition:"all 0.15s",borderLeft:`3px solid ${urgent?"#f97316":"#1a1a18"}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
        <div><div style={{fontSize:13,fontWeight:600,color:"#1a1a18",marginBottom:2}}>{p.name}</div><div style={{fontSize:10,color:"#9a9a96",fontFamily:"'DM Mono',monospace"}}>{p.client}</div></div>
        <StatusBadge status={p.status} small />
      </div>
      <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",padding:"2px 8px",borderRadius:99,background:"#f4f4f1",color:"#6b6b68",border:"1px solid #e2e2de",display:"inline-block",marginBottom:10}}>{p.type}</div>
      <ProgressBar value={pc} color={pc===100?"#16a34a":"#1a6648"} />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7}}>
        <div style={{fontSize:11,color:"#9a9a96"}}>{deliverables.filter(d=>d.status==="Done").length}/{deliverables.length} delivered</div>
        <div style={{fontSize:10,color:urgent?"#f97316":"#9a9a96",fontFamily:"'DM Mono',monospace",fontWeight:urgent?600:400}}>{days>0?`${days}d left`:days===0?"due today":"overdue"}</div>
      </div>
      <div style={{display:"flex",gap:3,marginTop:10}}>{p.team?.slice(0,5).map(id => <Avatar key={id} memberId={id} size={22} />)}</div>
    </div>
  );
}

// ─── PROJECT VIEW ─────────────────────────────────────────────────────────────
function ProjectView({ project: p, deliverables, filter, setFilter, expandedDelivery, setExpandedDelivery, onStatusChange, onAddDeliverable }) {
  const pc = pct(deliverables);
  const tc = SC[p.status] || SC["Not started"];
  const filtered = filter==="All" ? deliverables : deliverables.filter(d => d.status===filter);
  return (
    <div style={{padding:"32px 36px 56px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:26,color:"#1a1a18",lineHeight:1.2}}>{p.name}</div>
          <div style={{fontSize:12,color:"#9a9a96",marginTop:3}}>{p.client} · <span style={{fontFamily:"'DM Mono',monospace",fontSize:10}}>{p.type}</span></div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          <StatusBadge status={p.status} />
          <button onClick={onAddDeliverable} style={{fontSize:11,padding:"7px 16px",borderRadius:99,border:"none",background:"#1a1a18",color:"white",fontWeight:500}}>+ Add deliverable</button>
        </div>
      </div>
      <div style={{fontSize:12,color:"#6b6b68",marginBottom:14}}>{p.description}</div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{flex:1,maxWidth:300}}><ProgressBar value={pc} /></div>
        <div style={{fontSize:11,color:"#9a9a96",fontFamily:"'DM Mono',monospace"}}>{deliverables.filter(d=>d.status==="Done").length}/{deliverables.length} · {pc}%</div>
        <div style={{display:"flex",gap:3}}>{p.team?.map(id => <Avatar key={id} memberId={id} size={24} />)}</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {STATUSES.map(s => { const c=SC[s]; const cnt=deliverables.filter(d=>d.status===s).length; return <div key={s} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:8,padding:"7px 12px",display:"flex",gap:7,alignItems:"center"}}><span style={{fontSize:17,fontWeight:600,color:c.text}}>{cnt}</span><span style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:c.text}}>{s}</span></div>; })}
      </div>
      <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
        {["All","In progress","Review","Done","Not started"].map(f => <button key={f} onClick={() => setFilter(f)} style={{fontSize:10,padding:"4px 11px",borderRadius:99,fontFamily:"'DM Mono',monospace",border:`1px solid ${filter===f?"#1a1a18":"#e2e2de"}`,background:filter===f?"#1a1a18":"white",color:filter===f?"white":"#6b6b68",fontWeight:500}}>{f}</button>)}
      </div>
      <div style={{background:"white",border:"1px solid #e2e2de",borderRadius:10,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 95px 115px 95px 72px",padding:"9px 16px",borderBottom:"1px solid #f4f4f1",background:"#fafaf8"}}>
          {["Deliverable","Format","Owner","Status","Delivery"].map(h => <div key={h} style={{fontSize:9,fontWeight:600,color:"#9a9a96",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</div>)}
        </div>
        {filtered.map((d, i) => {
          const owner = getMember(d.owner);
          const c = SC[d.status] || SC["Not started"];
          const isExp = expandedDelivery[d.id];
          return (
            <div key={d.id}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 95px 115px 95px 72px",padding:"10px 16px",borderBottom:i<filtered.length-1?"1px solid #f7f7f5":"none",background:d.status==="Done"?"#fafff9":"white",alignItems:"center"}}>
                <div style={{fontSize:12,fontWeight:500,color:d.status==="Done"?"#9a9a96":"#1a1a18",textDecoration:d.status==="Done"?"line-through":"none"}}>{d.label}</div>
                <div style={{fontSize:10,color:"#9a9a96",fontFamily:"'DM Mono',monospace"}}>{d.format}</div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>{owner && <><Avatar memberId={d.owner} size={20}/><span style={{fontSize:11,color:"#6b6b68"}}>{owner.name}</span></>}</div>
                <div><StatusBadge status={d.status} small onClick={() => onStatusChange(d.id, nextStatus(d.status))} /></div>
                <div>{d.delivery && <button onClick={() => setExpandedDelivery(prev=>({...prev,[d.id]:!prev[d.id]}))} style={{fontSize:9,padding:"2px 7px",borderRadius:6,border:"1px solid #e2e2de",background:"transparent",color:"#9a9a96",fontFamily:"'DM Mono',monospace"}}>{isExp?"▾":"▸"} specs</button>}</div>
              </div>
              {isExp && d.delivery && (
                <div style={{padding:"10px 16px 13px",background:"#fafaf8",borderBottom:"1px solid #f4f4f1"}}>
                  <div style={{fontSize:9,fontWeight:600,color:"#9a9a96",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Delivery package required</div>
                  <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                    {DELIVERY_SPECS.map(s => <div key={s} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#6b6b68",fontFamily:"'DM Mono',monospace"}}><div style={{width:13,height:13,borderRadius:3,border:"1.5px solid #d0d0cc",background:"white",flexShrink:0}}/>{s}</div>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length===0 && <div style={{padding:36,textAlign:"center",color:"#9a9a96",fontSize:12}}>No deliverables match this filter</div>}
      </div>
    </div>
  );
}

// ─── WORKLOAD ─────────────────────────────────────────────────────────────────
function WorkloadView({ projects, projDeliverables }) {
  const workload = TEAM.map(m => {
    const items = projects.flatMap(p => projDeliverables(p.id).filter(d => d.owner===m.id).map(d => ({...d, project:p.name})));
    return {...m, items, todo:items.filter(d=>d.status!=="Done").length, done:items.filter(d=>d.status==="Done").length, total:items.length};
  }).filter(m => m.total > 0);
  return (
    <div style={{padding:"32px 36px 56px"}}>
      <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,color:"#1a1a18",marginBottom:5}}>Workload</div>
      <div style={{fontSize:12,color:"#9a9a96",marginBottom:24}}>Active deliverables per team member across all projects</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
        {workload.map(m => {
          const pc = m.total ? Math.round(m.done/m.total*100) : 0;
          return (
            <div key={m.id} style={{background:"white",border:"1px solid #e2e2de",borderRadius:10,padding:18}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <Avatar memberId={m.id} size={36} />
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#1a1a18"}}>{m.name}</div><div style={{fontSize:10,color:"#9a9a96"}}>{m.role}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:600,color:m.todo>0?"#1a1a18":"#4ade80",fontFamily:"'Instrument Serif',serif"}}>{m.todo}</div><div style={{fontSize:9,color:"#9a9a96",fontFamily:"'DM Mono',monospace"}}>pending</div></div>
              </div>
              <ProgressBar value={pc} color={m.color} />
              <div style={{fontSize:10,color:"#9a9a96",fontFamily:"'DM Mono',monospace",margin:"6px 0 10px"}}>{m.done}/{m.total} · {pc}%</div>
              {m.items.slice(0,4).map(d => { const c=SC[d.status]||SC["Not started"]; return <div key={d.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 8px",background:"#fafaf8",borderRadius:6,marginBottom:3}}><div style={{fontSize:10,color:"#6b6b68",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,marginRight:8}}>{d.label}</div><StatusBadge status={d.status} small /></div>; })}
              {m.items.length>4 && <div style={{fontSize:10,color:"#9a9a96",textAlign:"center",fontFamily:"'DM Mono',monospace",padding:"4px 0"}}>+{m.items.length-4} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ARCHIVE ──────────────────────────────────────────────────────────────────
function ArchiveView({ projects, projDeliverables }) {
  return (
    <div style={{padding:"32px 36px 56px"}}>
      <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,color:"#1a1a18",marginBottom:5}}>Archive</div>
      <div style={{fontSize:12,color:"#9a9a96",marginBottom:24}}>Completed projects</div>
      {projects.length===0 ? <div style={{fontSize:13,color:"#9a9a96"}}>Completed projects will appear here.</div> :
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
          {projects.map(p => <div key={p.id} style={{background:"white",border:"1px solid #e2e2de",borderRadius:10,padding:18,opacity:0.7}}><div style={{fontSize:13,fontWeight:600,color:"#1a1a18",marginBottom:3}}>{p.name}</div><div style={{fontSize:10,color:"#9a9a96",fontFamily:"'DM Mono',monospace",marginBottom:8}}>{p.client}</div><div style={{fontSize:11,color:"#166534"}}>✓ {projDeliverables(p.id).length} deliverables completed</div></div>)}
        </div>
      }
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div onClick={(e) => e.target===e.currentTarget && onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:"white",borderRadius:13,padding:24,width:"100%",maxWidth:450,maxHeight:"88vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:21,color:"#1a1a18"}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:"#9a9a96",lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {width:"100%",padding:"8px 11px",border:"1px solid #e2e2de",borderRadius:7,fontSize:12,background:"#fafaf8",outline:"none",color:"#1a1a18"};
const labelStyle = {fontSize:10,fontWeight:600,color:"#6b6b68",textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'DM Mono',monospace",display:"block",marginBottom:5};

function NewProjectModal({ onClose, onSave }) {
  const [form, setForm] = useState({name:"",client:"",type:"Digital Campaign",due_date:"",description:"",team:[]});
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const toggleTeam = (id) => set("team", form.team.includes(id) ? form.team.filter(x=>x!==id) : [...form.team, id]);
  return (
    <Modal title="New project" onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:13}}>
        <div><label style={labelStyle}>Project name</label><input style={inputStyle} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Vertex — Designed to Defy"/></div>
        <div><label style={labelStyle}>Client</label><input style={inputStyle} value={form.client} onChange={e=>set("client",e.target.value)} placeholder="e.g. BGB Group"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><label style={labelStyle}>Type</label><select style={inputStyle} value={form.type} onChange={e=>set("type",e.target.value)}>{PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={labelStyle}>Due date</label><input type="date" style={inputStyle} value={form.due_date} onChange={e=>set("due_date",e.target.value)}/></div>
        </div>
        <div><label style={labelStyle}>Description</label><textarea style={{...inputStyle,resize:"vertical",minHeight:60}} value={form.description} onChange={e=>set("description",e.target.value)}/></div>
        <div>
          <label style={labelStyle}>Team</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:5}}>
            {TEAM.map(m => <button key={m.id} onClick={()=>toggleTeam(m.id)} style={{padding:"5px 11px",borderRadius:99,fontSize:11,border:`1.5px solid ${form.team.includes(m.id)?m.color:"#e2e2de"}`,background:form.team.includes(m.id)?m.color+"18":"white",color:form.team.includes(m.id)?m.color:"#6b6b68",fontWeight:500}}>{m.name}</button>)}
          </div>
        </div>
        <button onClick={()=>form.name&&onSave(form)} style={{padding:10,borderRadius:8,border:"none",background:"#1a1a18",color:"white",fontSize:13,fontWeight:600,marginTop:4}}>Create project</button>
      </div>
    </Modal>
  );
}

function NewDeliverableModal({ onClose, onSave }) {
  const [form, setForm] = useState({label:"",format:"",owner:"juan",delivery:false});
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  return (
    <Modal title="Add deliverable" onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:13}}>
        <div><label style={labelStyle}>Name</label><input style={inputStyle} value={form.label} onChange={e=>set("label",e.target.value)} placeholder="e.g. YT Bumper — Gentle Massage"/></div>
        <div><label style={labelStyle}>Format</label><input style={inputStyle} value={form.format} onChange={e=>set("format",e.target.value)} placeholder="e.g. Video 16:9, Static 1:1"/></div>
        <div><label style={labelStyle}>Owner</label><select style={inputStyle} value={form.owner} onChange={e=>set("owner",e.target.value)}>{TEAM.map(m=><option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}</select></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <input type="checkbox" id="del-chk" checked={form.delivery} onChange={e=>set("delivery",e.target.checked)} style={{width:15,height:15,accentColor:"#1a1a18"}}/>
          <label htmlFor="del-chk" style={{fontSize:12,color:"#6b6b68",cursor:"pointer"}}>Requires full delivery package (mov, mp4, stems, mixes)</label>
        </div>
        <button onClick={()=>form.label&&onSave(form)} style={{padding:10,borderRadius:8,border:"none",background:"#1a1a18",color:"white",fontSize:13,fontWeight:600,marginTop:4}}>Add deliverable</button>
      </div>
    </Modal>
  );
}
