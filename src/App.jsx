import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const TEAM = [
  { id:"joan",   name:"Joan",    role:"CEO / Photographer",  initials:"JO", color:"#111111" },
  { id:"alex_t", name:"Alex T.", role:"Head of Art / Post",  initials:"AT", color:"#2563eb" },
  { id:"juan",   name:"Juan",    role:"EP / Business Dev",   initials:"JU", color:"#16a34a" },
  { id:"alvaro", name:"Álvaro",  role:"Post Producer",       initials:"AL", color:"#9333ea" },
  { id:"dani",   name:"Dani",    role:"Post Producer",       initials:"DA", color:"#dc2626" },
  { id:"tati",   name:"Tati",    role:"Producer",            initials:"TA", color:"#db2777" },
  { id:"oscar",  name:"Oscar",   role:"3D Artist",           initials:"OS", color:"#0891b2" },
  { id:"alex_l", name:"Alex L.", role:"Head of 3D",          initials:"AL", color:"#d97706" },
];

const PROJECT_TYPES = ["Digital Campaign","Photo/CGI","Post-Production","Pharma","Mixed"];
const STATUSES = ["Not started","In progress","Review","Done"];
const SC = {
  "Not started": { bg:"#f5f5f5", text:"#737373", border:"#e5e5e5" },
  "In progress":  { bg:"#eff6ff", text:"#1d4ed8", border:"#bfdbfe" },
  "Review":       { bg:"#fff7ed", text:"#c2410c", border:"#fed7aa" },
  "Done":         { bg:"#f0fdf4", text:"#15803d", border:"#bbf7d0" },
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

const getMember = id => TEAM.find(m => m.id === id);
const uid = () => Math.random().toString(36).slice(2, 9);
const daysUntil = date => Math.ceil((new Date(date) - new Date()) / (1000*60*60*24));
const pct = dels => dels.length ? Math.round(dels.filter(d => d.status==="Done").length / dels.length * 100) : 0;
const nextStatus = s => { const i = STATUSES.indexOf(s); return STATUSES[(i+1) % STATUSES.length]; };

// Design tokens
const W = "#ffffff", BK = "#0a0a0a", G50="#fafafa", G100="#f5f5f5", G200="#e5e5e5", G300="#d4d4d4", G400="#a3a3a3", G500="#737373", G700="#404040";
const R4="4px", R8="8px", R12="12px", R99="999px";
const FONT = "'Inter','Helvetica Neue',Arial,sans-serif";

function Avatar({ memberId, size=32 }) {
  const m = getMember(memberId);
  if (!m) return null;
  return <div style={{width:size,height:size,borderRadius:"50%",background:m.color+"18",border:`1.5px solid ${m.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(size*0.34),fontWeight:700,color:m.color,flexShrink:0,userSelect:"none",letterSpacing:"-0.02em"}}>{m.initials}</div>;
}

function Badge({ status, onClick }) {
  const c = SC[status] || SC["Not started"];
  return <span onClick={onClick} style={{background:c.bg,color:c.text,border:`1px solid ${c.border}`,borderRadius:R4,padding:"5px 12px",fontSize:13,fontWeight:600,cursor:onClick?"pointer":"default",whiteSpace:"nowrap",userSelect:"none"}}>{status}</span>;
}

function Bar({ value }) {
  return <div style={{height:6,background:G200,borderRadius:R99,overflow:"hidden"}}><div style={{width:`${value}%`,height:"100%",background:value===100?"#15803d":BK,borderRadius:R99,transition:"width 0.5s ease"}}/></div>;
}

function Toast({ msg }) {
  return <div style={{position:"fixed",bottom:28,right:28,background:BK,color:W,padding:"13px 22px",borderRadius:R8,fontSize:15,fontWeight:600,zIndex:999,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",animation:"fu 0.2s ease"}}><style>{`@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>✓ {msg}</div>;
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [expDel, setExpDel] = useState({});
  const [showNP, setShowNP] = useState(false);
  const [showND, setShowND] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      let { data: pd } = await supabase.from("projects").select("*").order("created_at");
      let { data: dd } = await supabase.from("deliverables").select("*").order("created_at");
      if (!pd || pd.length === 0) {
        await supabase.from("projects").insert(SEED_PROJECTS);
        await supabase.from("deliverables").insert(SEED_DELIVERABLES);
        pd = SEED_PROJECTS; dd = SEED_DELIVERABLES;
      }
      setProjects(pd || []); setDeliverables(dd || []);
    } catch { setProjects(SEED_PROJECTS); setDeliverables(SEED_DELIVERABLES); }
    setLoading(false);
  }

  async function updateStatus(id, s) {
    setDeliverables(prev => prev.map(d => d.id===id ? {...d,status:s} : d));
    await supabase.from("deliverables").update({status:s}).eq("id",id);
    showToast("Status updated");
  }

  async function addProject(data) {
    const p = {id:uid(),...data,status:"Not started"};
    setProjects(prev => [...prev,p]);
    await supabase.from("projects").insert(p);
    showToast("Project created");
  }

  async function addDeliverable(data) {
    const d = {id:uid(),project_id:activeId,...data,status:"Not started"};
    setDeliverables(prev => [...prev,d]);
    await supabase.from("deliverables").insert(d);
    showToast("Deliverable added");
  }

  const dels = id => deliverables.filter(d => d.project_id === id);
  const active = projects.filter(p => p.status !== "Done");
  const proj = projects.find(p => p.id === activeId);

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:W,fontFamily:FONT}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:32,fontWeight:800,color:BK,letterSpacing:"-0.04em",marginBottom:8}}>Garrigosa Studio</div>
        <div style={{fontSize:16,color:G400,fontWeight:500}}>Loading platform…</div>
      </div>
    </div>
  );

  const navBtn = (id, label, icon) => {
    const isActive = view===id && !activeId;
    return <button key={id} onClick={()=>{setView(id);setActiveId(null);setFilter("All");}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 14px",borderRadius:R8,border:"none",background:isActive?W:"transparent",color:isActive?BK:"#737373",fontSize:15,fontWeight:isActive?700:500,textAlign:"left",transition:"all 0.15s",marginBottom:3}}><span style={{fontSize:13,opacity:0.6}}>{icon}</span>{label}</button>;
  };

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:FONT,background:W,color:BK}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}button{cursor:pointer;font-family:inherit}input,select,textarea{font-family:inherit}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${G200};border-radius:99px}`}</style>

      {/* SIDEBAR */}
      <div style={{width:248,background:BK,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"28px 24px 22px"}}>
          <div style={{fontSize:22,fontWeight:800,color:W,letterSpacing:"-0.04em",lineHeight:1}}>Garrigosa</div>
          <div style={{fontSize:10,color:"#525252",marginTop:5,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Studio Platform</div>
        </div>
        <div style={{height:1,background:"#1f1f1f"}}/>
        <div style={{padding:"16px 12px"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#404040",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,paddingLeft:14}}>Menu</div>
          {navBtn("dashboard","Dashboard","○")}
          {navBtn("workload","Workload","◎")}
          {navBtn("archive","Archive","◇")}
        </div>
        <div style={{height:1,background:"#1f1f1f"}}/>
        <div style={{padding:"16px 12px",flex:1}}>
          <div style={{fontSize:10,fontWeight:700,color:"#404040",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,paddingLeft:14}}>Projects</div>
          {active.map(p => {
            const pc = pct(dels(p.id)); const isA = activeId===p.id;
            return <button key={p.id} onClick={()=>{setView("project");setActiveId(p.id);setFilter("All");}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 14px",borderRadius:R8,border:"none",background:isA?W:"transparent",color:isA?BK:"#a3a3a3",fontSize:14,fontWeight:isA?700:500,textAlign:"left",transition:"all 0.15s",marginBottom:3}}>
              <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:pc===100?"#22c55e":pc>0?"#3b82f6":"#404040"}}/>
              <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</span>
              <span style={{fontSize:11,color:isA?G400:"#525252",flexShrink:0,fontWeight:600}}>{pc}%</span>
            </button>;
          })}
          <button onClick={()=>setShowNP(true)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 14px",borderRadius:R8,border:"1px dashed #2a2a2a",background:"transparent",color:"#525252",fontSize:14,fontWeight:500,marginTop:8,transition:"all 0.15s"}}>
            <span style={{fontSize:18,lineHeight:1}}>+</span> New project
          </button>
        </div>
        <div style={{height:1,background:"#1f1f1f"}}/>
        <div style={{padding:"16px 24px",fontSize:11,color:"#404040",fontWeight:600,letterSpacing:"0.04em"}}>v1.0 · internal</div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflowY:"auto",minWidth:0,background:G50}}>
        {view==="dashboard"&&!activeId && <Dashboard projects={active} dels={dels} onOpen={id=>{setActiveId(id);setView("project");}} onNew={()=>setShowNP(true)}/>}
        {view==="project"&&proj && <ProjectView project={proj} deliverables={dels(proj.id)} filter={filter} setFilter={setFilter} expDel={expDel} setExpDel={setExpDel} onStatus={updateStatus} onAdd={()=>setShowND(true)}/>}
        {view==="workload" && <WorkloadView projects={active} dels={dels}/>}
        {view==="archive" && <ArchiveView projects={projects.filter(p=>p.status==="Done")} dels={dels}/>}
      </div>

      {showNP && <NewProjectModal onClose={()=>setShowNP(false)} onSave={d=>{addProject(d);setShowNP(false);}}/>}
      {showND&&activeId && <NewDeliverableModal onClose={()=>setShowND(false)} onSave={d=>{addDeliverable(d);setShowND(false);}}/>}
      {toast && <Toast msg={toast}/>}
    </div>
  );
}

function Dashboard({ projects, dels, onOpen, onNew }) {
  const all = projects.flatMap(p => dels(p.id));
  return (
    <div style={{padding:"44px 52px 64px"}}>
      <div style={{marginBottom:44}}>
        <div style={{fontSize:40,fontWeight:800,color:BK,letterSpacing:"-0.04em",lineHeight:1.1,marginBottom:10}}>Studio Overview</div>
        <div style={{fontSize:16,color:G500,fontWeight:500}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:52}}>
        {[["Active Projects",projects.length,BK],["Total Deliverables",all.length,BK],["Delivered",all.filter(d=>d.status==="Done").length,"#15803d"],["In Review",all.filter(d=>d.status==="Review").length,"#c2410c"]].map(([l,v,c])=>(
          <div key={l} style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"28px 32px"}}>
            <div style={{fontSize:48,fontWeight:800,color:c,letterSpacing:"-0.04em",lineHeight:1}}>{v}</div>
            <div style={{fontSize:12,color:G400,marginTop:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,color:G400,textTransform:"uppercase",letterSpacing:"0.1em"}}>Active Projects</div>
        <button onClick={onNew} style={{fontSize:14,padding:"11px 22px",borderRadius:R8,border:`1.5px solid ${BK}`,background:BK,color:W,fontWeight:700}}>+ New project</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {projects.map(p=><ProjCard key={p.id} project={p} deliverables={dels(p.id)} onClick={()=>onOpen(p.id)}/>)}
      </div>
    </div>
  );
}

function ProjCard({ project:p, deliverables, onClick }) {
  const pc=pct(deliverables); const days=daysUntil(p.due_date); const urg=days<=7;
  return (
    <div onClick={onClick} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,0.09)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}} style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"26px",cursor:"pointer",transition:"all 0.2s",borderTop:`3px solid ${urg?"#ef4444":BK}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div>
          <div style={{fontSize:17,fontWeight:700,color:BK,marginBottom:5,letterSpacing:"-0.02em"}}>{p.name}</div>
          <div style={{fontSize:14,color:G500,fontWeight:500}}>{p.client}</div>
        </div>
        <Badge status={p.status}/>
      </div>
      <div style={{display:"inline-block",fontSize:11,fontWeight:700,color:G500,background:G100,border:`1px solid ${G200}`,borderRadius:R4,padding:"4px 10px",margin:"14px 0",textTransform:"uppercase",letterSpacing:"0.07em"}}>{p.type}</div>
      <Bar value={pc}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,marginBottom:18}}>
        <div style={{fontSize:14,color:G500,fontWeight:500}}>{deliverables.filter(d=>d.status==="Done").length} / {deliverables.length} delivered</div>
        <div style={{fontSize:14,fontWeight:700,color:urg?"#ef4444":G400}}>{days>0?`${days} days left`:days===0?"Due today":"Overdue"}</div>
      </div>
      <div style={{height:1,background:G100,marginBottom:18}}/>
      <div style={{display:"flex",gap:6}}>{p.team?.slice(0,6).map(id=><Avatar key={id} memberId={id} size={30}/>)}</div>
    </div>
  );
}

function ProjectView({ project:p, deliverables, filter, setFilter, expDel, setExpDel, onStatus, onAdd }) {
  const pc=pct(deliverables);
  const filtered=filter==="All"?deliverables:deliverables.filter(d=>d.status===filter);
  return (
    <div style={{padding:"44px 52px 64px"}}>
      {/* Project header card */}
      <div style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"36px 40px",marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
          <div>
            <div style={{fontSize:34,fontWeight:800,color:BK,letterSpacing:"-0.04em",lineHeight:1.2,marginBottom:8}}>{p.name}</div>
            <div style={{fontSize:15,color:G500,fontWeight:500}}>{p.client} · {p.type}</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
            <Badge status={p.status}/>
            <button onClick={onAdd} style={{fontSize:14,padding:"11px 22px",borderRadius:R8,border:"none",background:BK,color:W,fontWeight:700}}>+ Add deliverable</button>
          </div>
        </div>
        <div style={{fontSize:15,color:G500,lineHeight:1.7,marginBottom:22,fontWeight:500}}>{p.description}</div>
        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:22}}>
          <div style={{flex:1}}><Bar value={pc}/></div>
          <div style={{fontSize:16,fontWeight:700,color:BK,whiteSpace:"nowrap"}}>{deliverables.filter(d=>d.status==="Done").length} / {deliverables.length} · {pc}%</div>
        </div>
        <div style={{height:1,background:G100,marginBottom:20}}/>
        <div style={{display:"flex",gap:8}}>{p.team?.map(id=><Avatar key={id} memberId={id} size={34}/>)}</div>
      </div>

      {/* Status cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {STATUSES.map(s=>{const c=SC[s];const cnt=deliverables.filter(d=>d.status===s).length;return(
          <div key={s} onClick={()=>setFilter(filter===s?"All":s)} style={{background:filter===s?BK:W,border:`1px solid ${filter===s?BK:G200}`,borderRadius:R8,padding:"18px 22px",cursor:"pointer",transition:"all 0.15s"}}>
            <div style={{fontSize:32,fontWeight:800,color:filter===s?W:c.text,letterSpacing:"-0.03em",lineHeight:1}}>{cnt}</div>
            <div style={{fontSize:12,fontWeight:700,color:filter===s?"#a3a3a3":c.text,marginTop:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>{s}</div>
          </div>
        );})}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {["All",...STATUSES].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{fontSize:13,padding:"8px 18px",borderRadius:R8,fontWeight:600,border:`1.5px solid ${filter===f?BK:G200}`,background:filter===f?BK:W,color:filter===f?W:G500,transition:"all 0.15s"}}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 130px 150px 130px 80px",padding:"14px 28px",borderBottom:`1px solid ${G100}`,background:G50}}>
          {["Deliverable","Format","Owner","Status",""].map(h=><div key={h} style={{fontSize:11,fontWeight:700,color:G400,textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</div>)}
        </div>
        {filtered.map((d,i)=>{
          const owner=getMember(d.owner); const isExp=expDel[d.id];
          return <div key={d.id}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 130px 150px 130px 80px",padding:"18px 28px",borderBottom:i<filtered.length-1?`1px solid ${G100}`:"none",background:d.status==="Done"?"#fafffe":W,alignItems:"center",transition:"background 0.15s"}}>
              <div style={{fontSize:15,fontWeight:600,color:d.status==="Done"?G400:BK,textDecoration:d.status==="Done"?"line-through":"none",letterSpacing:"-0.01em"}}>{d.label}</div>
              <div style={{fontSize:14,color:G500,fontWeight:500}}>{d.format}</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>{owner&&<><Avatar memberId={d.owner} size={28}/><span style={{fontSize:14,fontWeight:600,color:G700}}>{owner.name}</span></>}</div>
              <div><Badge status={d.status} onClick={()=>onStatus(d.id,nextStatus(d.status))}/></div>
              <div>{d.delivery&&<button onClick={()=>setExpDel(prev=>({...prev,[d.id]:!prev[d.id]}))} style={{fontSize:13,padding:"6px 12px",borderRadius:R4,fontWeight:600,border:`1.5px solid ${G200}`,background:"transparent",color:G500}}>{isExp?"▾":"▸"}</button>}</div>
            </div>
            {isExp&&d.delivery&&<div style={{padding:"18px 28px 22px",background:G50,borderBottom:i<filtered.length-1?`1px solid ${G100}`:"none"}}>
              <div style={{fontSize:11,fontWeight:700,color:G400,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Delivery package required</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                {DELIVERY_SPECS.map(s=><div key={s} style={{display:"flex",alignItems:"center",gap:10,fontSize:14,color:G700,fontWeight:500}}><div style={{width:18,height:18,border:`2px solid ${G300}`,borderRadius:4,background:W,flexShrink:0}}/>{s}</div>)}
              </div>
            </div>}
          </div>;
        })}
        {filtered.length===0&&<div style={{padding:"56px",textAlign:"center",color:G400,fontSize:16,fontWeight:500}}>No deliverables match this filter</div>}
      </div>
    </div>
  );
}

function WorkloadView({ projects, dels }) {
  const wl = TEAM.map(m=>{
    const items=projects.flatMap(p=>dels(p.id).filter(d=>d.owner===m.id));
    return{...m,items,todo:items.filter(d=>d.status!=="Done").length,done:items.filter(d=>d.status==="Done").length,total:items.length};
  }).filter(m=>m.total>0).sort((a,b)=>b.todo-a.todo);
  return (
    <div style={{padding:"44px 52px 64px"}}>
      <div style={{fontSize:40,fontWeight:800,color:BK,letterSpacing:"-0.04em",marginBottom:8}}>Workload</div>
      <div style={{fontSize:16,color:G500,fontWeight:500,marginBottom:44}}>Active deliverables per team member</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
        {wl.map(m=>{const pc=m.total?Math.round(m.done/m.total*100):0;return(
          <div key={m.id} style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"26px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
              <Avatar memberId={m.id} size={46}/>
              <div style={{flex:1}}>
                <div style={{fontSize:17,fontWeight:700,color:BK,letterSpacing:"-0.02em"}}>{m.name}</div>
                <div style={{fontSize:13,color:G500,marginTop:3,fontWeight:500}}>{m.role}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:40,fontWeight:800,color:m.todo>0?BK:"#15803d",letterSpacing:"-0.04em",lineHeight:1}}>{m.todo}</div>
                <div style={{fontSize:11,color:G400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>pending</div>
              </div>
            </div>
            <Bar value={pc}/>
            <div style={{fontSize:14,color:G400,fontWeight:500,margin:"10px 0 18px"}}>{m.done} / {m.total} delivered · {pc}%</div>
            <div style={{height:1,background:G100,marginBottom:16}}/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {m.items.slice(0,4).map(d=>{const c=SC[d.status]||SC["Not started"];return(
                <div key={d.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:G50,borderRadius:R8}}>
                  <div style={{fontSize:14,color:G700,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,marginRight:12}}>{d.label}</div>
                  <Badge status={d.status}/>
                </div>
              );})}
              {m.items.length>4&&<div style={{fontSize:13,color:G400,textAlign:"center",fontWeight:600,padding:"4px 0"}}>+{m.items.length-4} more</div>}
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

function ArchiveView({ projects, dels }) {
  return (
    <div style={{padding:"44px 52px 64px"}}>
      <div style={{fontSize:40,fontWeight:800,color:BK,letterSpacing:"-0.04em",marginBottom:8}}>Archive</div>
      <div style={{fontSize:16,color:G500,fontWeight:500,marginBottom:44}}>Completed projects</div>
      {projects.length===0
        ?<div style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"56px",textAlign:"center",color:G400,fontSize:16,fontWeight:500}}>Completed projects will appear here.</div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
          {projects.map(p=><div key={p.id} style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"26px",opacity:0.7}}>
            <div style={{fontSize:17,fontWeight:700,color:BK,marginBottom:5,letterSpacing:"-0.02em"}}>{p.name}</div>
            <div style={{fontSize:14,color:G500,fontWeight:500,marginBottom:14}}>{p.client}</div>
            <div style={{fontSize:15,color:"#15803d",fontWeight:700}}>✓ {dels(p.id).length} deliverables completed</div>
          </div>)}
        </div>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{background:W,borderRadius:R12,padding:"36px",width:"100%",maxWidth:500,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.22)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div style={{fontSize:26,fontWeight:800,color:BK,letterSpacing:"-0.03em"}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:26,color:G400,lineHeight:1,padding:"4px 8px"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const IS = {width:"100%",padding:"12px 16px",border:`1.5px solid ${G200}`,borderRadius:R8,fontSize:15,background:W,outline:"none",color:BK,fontWeight:500};
const LS = {fontSize:12,fontWeight:700,color:G500,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:8};
const FS = {marginBottom:20};

function NewProjectModal({ onClose, onSave }) {
  const [f, setF] = useState({name:"",client:"",type:"Digital Campaign",due_date:"",description:"",team:[]});
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <Modal title="New project" onClose={onClose}>
      <div style={FS}><label style={LS}>Project name</label><input style={IS} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="e.g. Vertex — Designed to Defy"/></div>
      <div style={FS}><label style={LS}>Client</label><input style={IS} value={f.client} onChange={e=>s("client",e.target.value)} placeholder="e.g. BGB Group"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,...FS}}>
        <div><label style={LS}>Type</label><select style={IS} value={f.type} onChange={e=>s("type",e.target.value)}>{PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
        <div><label style={LS}>Due date</label><input type="date" style={IS} value={f.due_date} onChange={e=>s("due_date",e.target.value)}/></div>
      </div>
      <div style={FS}><label style={LS}>Description</label><textarea style={{...IS,resize:"vertical",minHeight:80}} value={f.description} onChange={e=>s("description",e.target.value)}/></div>
      <div style={FS}>
        <label style={LS}>Team</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
          {TEAM.map(m=><button key={m.id} onClick={()=>s("team",f.team.includes(m.id)?f.team.filter(x=>x!==m.id):[...f.team,m.id])} style={{padding:"8px 16px",borderRadius:R8,fontSize:14,fontWeight:600,border:`1.5px solid ${f.team.includes(m.id)?m.color:G200}`,background:f.team.includes(m.id)?m.color+"15":W,color:f.team.includes(m.id)?m.color:G500}}>{m.name}</button>)}
        </div>
      </div>
      <button onClick={()=>f.name&&onSave(f)} style={{width:"100%",padding:"14px",borderRadius:R8,border:"none",background:BK,color:W,fontSize:15,fontWeight:700}}>Create project</button>
    </Modal>
  );
}

function NewDeliverableModal({ onClose, onSave }) {
  const [f, setF] = useState({label:"",format:"",owner:"juan",delivery:false});
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <Modal title="Add deliverable" onClose={onClose}>
      <div style={FS}><label style={LS}>Name</label><input style={IS} value={f.label} onChange={e=>s("label",e.target.value)} placeholder="e.g. YT Bumper — Gentle Massage"/></div>
      <div style={FS}><label style={LS}>Format</label><input style={IS} value={f.format} onChange={e=>s("format",e.target.value)} placeholder="e.g. Video 16:9"/></div>
      <div style={FS}><label style={LS}>Owner</label><select style={IS} value={f.owner} onChange={e=>s("owner",e.target.value)}>{TEAM.map(m=><option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}</select></div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <input type="checkbox" id="dc" checked={f.delivery} onChange={e=>s("delivery",e.target.checked)} style={{width:20,height:20,accentColor:BK}}/>
        <label htmlFor="dc" style={{fontSize:15,color:G700,fontWeight:500,cursor:"pointer"}}>Requires full delivery package</label>
      </div>
      <button onClick={()=>f.label&&onSave(f)} style={{width:"100%",padding:"14px",borderRadius:R8,border:"none",background:BK,color:W,fontSize:15,fontWeight:700}}>Add deliverable</button>
    </Modal>
  );
}
