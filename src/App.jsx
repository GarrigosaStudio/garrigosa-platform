import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

// ─── TEAM ─────────────────────────────────────────────────────────────────────
const TEAM = [
  { id:"joan",   name:"Joan",             role:"CEO / Photographer",    initials:"JO", color:"#111111" },
  { id:"alex_t", name:"Alex Torrens",     role:"Head of Art / Post",    initials:"AT", color:"#2563eb" },
  { id:"juan",   name:"Juan",             role:"EP / Business Dev",     initials:"JU", color:"#16a34a" },
  { id:"alvaro", name:"Álvaro",           role:"Post Producer",         initials:"AL", color:"#9333ea" },
  { id:"dani",   name:"Dani",             role:"Post Producer",         initials:"DA", color:"#dc2626" },
  { id:"tati",   name:"Tati",             role:"Producer",              initials:"TA", color:"#db2777" },
  { id:"oscar",  name:"Oscar Miralles",   role:"3D Artist",             initials:"OM", color:"#0891b2" },
  { id:"alex_l", name:"Alex Lorca",       role:"Head of 3D",            initials:"AL", color:"#d97706" },
  { id:"frida",  name:"Frida",            role:"Retoucher Freelance",   initials:"FR", color:"#7c3aed" },
  { id:"marco",  name:"Marco Pignatelli", role:"Sketch Artist",         initials:"MP", color:"#065f46" },
];

const PROJECT_TYPES = ["Digital Campaign","Photo / CGI","Post-Production","Pharma","3D / CGI","Animation","Hybrid"];

const PROJECT_PHASES = [
  "Brief received",
  "Budgeting",
  "Budget sent",
  "Approved — in production",
  "Client review",
  "Delivered",
  "Archived",
];

const PHASE_COLORS = {
  "Brief received":           { bg:"#f5f5f5", text:"#525252", border:"#e5e5e5" },
  "Budgeting":                { bg:"#fefce8", text:"#854d0e", border:"#fef08a" },
  "Budget sent":              { bg:"#fff7ed", text:"#c2410c", border:"#fed7aa" },
  "Approved — in production": { bg:"#eff6ff", text:"#1d4ed8", border:"#bfdbfe" },
  "Client review":            { bg:"#fdf4ff", text:"#7e22ce", border:"#e9d5ff" },
  "Delivered":                { bg:"#f0fdf4", text:"#15803d", border:"#bbf7d0" },
  "Archived":                 { bg:"#f5f5f5", text:"#a3a3a3", border:"#e5e5e5" },
};

const DEL_STATUSES = ["Not started","In progress","Review","Done"];
const DEL_STATUS_COLORS = {
  "Not started": { bg:"#f5f5f5", text:"#737373", border:"#e5e5e5" },
  "In progress":  { bg:"#eff6ff", text:"#1d4ed8", border:"#bfdbfe" },
  "Review":       { bg:"#fff7ed", text:"#c2410c", border:"#fed7aa" },
  "Done":         { bg:"#f0fdf4", text:"#15803d", border:"#bbf7d0" },
};

const DELIVERY_SPECS = ["Master in .mov","Master in .mp4","Clean version .mov (no supers)","Supers","Stems","Mixes"];

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_PROJECTS = [
  { id:"p1", name:"Palmolive Thermal Spa", client:"Palmolive", agency:"VML / Hogarth", type:"Digital Campaign", phase:"Approved — in production", due_date:"2026-04-30", description:"Digital assets 2026 — YT Bumpers, TT Stories, Meta Static/GIF, Banner, Carousel, OOH", team:["juan","alvaro"] },
  { id:"p2", name:"Tryngolza — Product Shots", client:"Ionis Pharmaceuticals", agency:"Broth", type:"3D / CGI", phase:"Approved — in production", due_date:"2026-05-15", description:"CGI product shots for autoinjector — 2 SKUs (50mg + 80mg) · 24 deliverables", team:["juan","oscar","frida"] },
  { id:"p3", name:"JPMorgan — Payment Outbound", client:"JP Morgan", agency:"Wired", type:"Hybrid", phase:"Approved — in production", due_date:"2026-04-15", description:"Editorial cover illustration — Payment Outbound magazine", team:["juan","alex_t","marco"] },
  { id:"p4", name:"King Fusion — Helado Raspberry", client:"Burger King", agency:"Draft Punk", type:"3D / CGI", phase:"Approved — in production", due_date:"2026-04-20", description:"CGI product visuals — Key Visuals + product stills for raspberry ice cream", team:["juan","alvaro"] },
  { id:"p5", name:"SM Unbranded — Monster", client:"Pixacore", agency:"Pixacore", type:"Photo / CGI", phase:"Approved — in production", due_date:"2026-04-10", description:"Photo + CGI hybrid — monster attacking patients · 6 stills", team:["juan","alex_t","oscar"] },
  { id:"p6", name:"SOBI — Gout Campaign", client:"SOBI", agency:"", type:"Pharma", phase:"Approved — in production", due_date:"2026-05-30", description:"Full pharma campaign — HCP + DTC stills, CGI extras, video · 31 deliverables · priority-ordered", team:["juan","alex_t","oscar","alvaro"] },
];

const SEED_DELIVERABLES = [
  // Palmolive
  {id:"pal1",project_id:"p1",label:"YT Bumper — Gentle Massage",format:"Video 16:9 · 6\"",owner:"alvaro",status:"In progress",delivery:true,notes:"Pink · Cherry Blossom"},
  {id:"pal2",project_id:"p1",label:"YT Bumper — Mineral Massage",format:"Video 16:9 · 6\"",owner:"alvaro",status:"Not started",delivery:true,notes:"Blue · Water Lilly"},
  {id:"pal3",project_id:"p1",label:"YT Bumper — Refreshing Scrub",format:"Video 16:9 · 6\"",owner:"alvaro",status:"Not started",delivery:true,notes:"Orange · Mirabel"},
  {id:"pal4",project_id:"p1",label:"YT Bumper — Smooth Butter",format:"Video 16:9 · 6\"",owner:"juan",status:"Not started",delivery:true,notes:"Beige · Vainilla"},
  {id:"pal5",project_id:"p1",label:"TT Story — Gentle Massage",format:"Video 9:16 · 6\"",owner:"alvaro",status:"Review",delivery:true,notes:"Pink · Cherry Blossom"},
  {id:"pal6",project_id:"p1",label:"TT Story — Mineral Massage",format:"Video 9:16 · 6\"",owner:"alvaro",status:"Not started",delivery:true,notes:"Blue · Water Lilly"},
  {id:"pal7",project_id:"p1",label:"TT Story — Refreshing Scrub",format:"Video 9:16 · 6\"",owner:"alvaro",status:"Not started",delivery:true,notes:"Orange · Mirabel"},
  {id:"pal8",project_id:"p1",label:"TT Story — Smooth Butter",format:"Video 9:16 · 6\"",owner:"juan",status:"Not started",delivery:true,notes:"Beige · Vainilla"},
  {id:"pal9",project_id:"p1",label:"Meta Static — Gentle Massage",format:"Static 1:1",owner:"juan",status:"Done",delivery:false,notes:"Pink · Cherry Blossom"},
  {id:"pal10",project_id:"p1",label:"Meta Static — Mineral Massage",format:"Static 1:1",owner:"alvaro",status:"Done",delivery:false,notes:"Blue · Water Lilly"},
  {id:"pal11",project_id:"p1",label:"Meta Static — Refreshing Scrub",format:"Static 1:1",owner:"alvaro",status:"Not started",delivery:false,notes:"Orange · Mirabel"},
  {id:"pal12",project_id:"p1",label:"Meta Static — Smooth Butter",format:"Static 1:1",owner:"juan",status:"Not started",delivery:false,notes:"Beige · Vainilla"},
  {id:"pal13",project_id:"p1",label:"Meta Static — Smooth Butter + Radiant Oil",format:"Static 1:1",owner:"alvaro",status:"Not started",delivery:false,notes:"Dual pack"},
  {id:"pal14",project_id:"p1",label:"Meta GIF — Gentle Massage",format:"GIF 1:1 · 3\"",owner:"alvaro",status:"Not started",delivery:true,notes:"3 frames"},
  {id:"pal15",project_id:"p1",label:"Meta GIF — Mineral Massage",format:"GIF 1:1 · 3\"",owner:"alvaro",status:"Not started",delivery:true,notes:"3 frames"},
  {id:"pal16",project_id:"p1",label:"Meta GIF — Refreshing Scrub",format:"GIF 1:1 · 3\"",owner:"alvaro",status:"Not started",delivery:true,notes:"3 frames"},
  {id:"pal17",project_id:"p1",label:"Meta GIF — Smooth Butter v1",format:"GIF 1:1 · 3\"",owner:"juan",status:"Not started",delivery:true,notes:"3 frames"},
  {id:"pal18",project_id:"p1",label:"Meta GIF — Smooth Butter v2",format:"GIF 1:1 · 3\"",owner:"juan",status:"Not started",delivery:true,notes:"3 frames · variant"},
  {id:"pal19",project_id:"p1",label:"Banner Static — Gentle Massage",format:"Static 1:1",owner:"juan",status:"Not started",delivery:false,notes:"Option A + Option B"},
  {id:"pal20",project_id:"p1",label:"Meta Carousel — 5 cards",format:"Static 1:1",owner:"alvaro",status:"Not started",delivery:false,notes:"Why just shower → The spa is a shower away"},
  {id:"pal21",project_id:"p1",label:"Digital OOH — Gentle Massage",format:"Video 9:16 · 6\"",owner:"juan",status:"Not started",delivery:true,notes:"Pink · Cherry Blossom · 3 frames"},
  // Tryngolza
  {id:"try1",project_id:"p2",label:"SKU 50mg — Autoinjector lateral horizontal",format:"CGI Still · landscape",owner:"oscar",status:"In progress",delivery:false,notes:"Cap naranja · fondo gris neutro"},
  {id:"try2",project_id:"p2",label:"SKU 50mg — Autoinjector 3/4 cap end",format:"CGI Still · portrait",owner:"oscar",status:"In progress",delivery:false,notes:"Cap naranja en primer plano"},
  {id:"try3",project_id:"p2",label:"SKU 50mg — Autoinjector 3/4 label side",format:"CGI Still · portrait",owner:"oscar",status:"Not started",delivery:false,notes:"Label principal visible"},
  {id:"try4",project_id:"p2",label:"SKU 50mg — Carton cerrado + autoinjector 3/4",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:"Conjunto"},
  {id:"try5",project_id:"p2",label:"SKU 50mg — Carton abierto + tray isométrico",format:"CGI Still · square",owner:"oscar",status:"Not started",delivery:false,notes:"Tapa abierta · autoinjector en tray"},
  {id:"try6",project_id:"p2",label:"SKU 50mg — Carton frontal con barcode",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:"Logo Tryngolza + IONIS"},
  {id:"try7",project_id:"p2",label:"SKU 50mg — Carton frontal sin barcode",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:"Panel frontal limpio"},
  {id:"try8",project_id:"p2",label:"SKU 50mg — Carton posterior",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:"Instrucciones + ingredientes"},
  {id:"try9",project_id:"p2",label:"SKU 50mg — Carton 3/4 trasera con barcode",format:"CGI Still · square",owner:"oscar",status:"Not started",delivery:false,notes:"GTIN/SN/barcode panel"},
  {id:"try10",project_id:"p2",label:"SKU 50mg — Tray + autoinjector cenital",format:"CGI Still · square",owner:"oscar",status:"Not started",delivery:false,notes:"Vista top down"},
  {id:"try11",project_id:"p2",label:"SKU 50mg — Detalle ventana inspección",format:"CGI Still · landscape",owner:"frida",status:"Not started",delivery:false,notes:"Close-up inspection window"},
  {id:"try12",project_id:"p2",label:"SKU 80mg — Autoinjector lateral horizontal",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:"Cap naranja · fondo gris neutro"},
  {id:"try13",project_id:"p2",label:"SKU 80mg — Autoinjector 3/4 cap end",format:"CGI Still · portrait",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try14",project_id:"p2",label:"SKU 80mg — Autoinjector 3/4 label side",format:"CGI Still · portrait",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try15",project_id:"p2",label:"SKU 80mg — Carton cerrado + autoinjector 3/4",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try16",project_id:"p2",label:"SKU 80mg — Carton abierto + tray isométrico",format:"CGI Still · square",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try17",project_id:"p2",label:"SKU 80mg — Carton frontal con barcode",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try18",project_id:"p2",label:"SKU 80mg — Carton frontal sin barcode",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try19",project_id:"p2",label:"SKU 80mg — Carton posterior",format:"CGI Still · landscape",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try20",project_id:"p2",label:"SKU 80mg — Carton 3/4 trasera con barcode",format:"CGI Still · square",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try21",project_id:"p2",label:"SKU 80mg — Tray + autoinjector cenital",format:"CGI Still · square",owner:"oscar",status:"Not started",delivery:false,notes:""},
  {id:"try22",project_id:"p2",label:"SKU 80mg — Detalle ventana inspección",format:"CGI Still · landscape",owner:"frida",status:"Not started",delivery:false,notes:""},
  {id:"try23",project_id:"p2",label:"Render adicional — Cenital SKU 50mg",format:"CGI Still · square",owner:"oscar",status:"Not started",delivery:false,notes:"Carton cerrado + autoinjector top down"},
  {id:"try24",project_id:"p2",label:"Render adicional — Cenital SKU 80mg",format:"CGI Still · square",owner:"oscar",status:"Not started",delivery:false,notes:"Carton cerrado + autoinjector top down"},
  // JPMorgan
  {id:"jp1",project_id:"p3",label:"Portada Payment Outbound",format:"Editorial illustration",owner:"marco",status:"In progress",delivery:false,notes:"Sketch / ilustración · formato portada editorial"},
  // King Fusion
  {id:"kf1",project_id:"p4",label:"KV Static — Raspberry",format:"CGI · Key Visual",owner:"alvaro",status:"In progress",delivery:false,notes:"Key Visual estático"},
  {id:"kf2",project_id:"p4",label:"KV Dynamic — Raspberry",format:"CGI · Animated",owner:"alvaro",status:"Not started",delivery:true,notes:"Key Visual animado/dinámico"},
  {id:"kf3",project_id:"p4",label:"Still 45° — Product angle",format:"CGI Still",owner:"alvaro",status:"Not started",delivery:false,notes:"Ángulo producto 45 grados"},
  {id:"kf4",project_id:"p4",label:"Still 22° — Product angle",format:"CGI Still",owner:"alvaro",status:"Not started",delivery:false,notes:"Ángulo producto 22 grados"},
  // SM Monster
  {id:"sm1",project_id:"p5",label:"Monster attacking older woman — side view",format:"Photo + CGI Still",owner:"alex_t",status:"In progress",delivery:false,notes:"Female · 60s and up"},
  {id:"sm2",project_id:"p5",label:"Monster attacking younger woman — side view",format:"Photo + CGI Still",owner:"alex_t",status:"Not started",delivery:false,notes:"Female · 40s to low 60s"},
  {id:"sm3",project_id:"p5",label:"Monster attacking man — side view",format:"Photo + CGI Still",owner:"oscar",status:"Not started",delivery:false,notes:"Male"},
  {id:"sm4",project_id:"p5",label:"Woman portrait — monster tentacles (version A)",format:"Photo + CGI Still",owner:"alex_t",status:"Not started",delivery:false,notes:"Female · front view · waist up"},
  {id:"sm5",project_id:"p5",label:"Woman portrait — monster tentacles (version B)",format:"Photo + CGI Still",owner:"alex_t",status:"Not started",delivery:false,notes:"Female · variant B"},
  {id:"sm6",project_id:"p5",label:"Man portrait — monster tentacles",format:"Photo + CGI Still",owner:"oscar",status:"Not started",delivery:false,notes:"Male · front view · waist up"},
  // SOBI
  {id:"so1",project_id:"p6",label:"P1 — KV: Analin (Female Doctor) smashing GOUT",format:"Photo + CGI · HCP",owner:"alex_t",status:"In progress",delivery:false,notes:"Priority 1 · Shot principal HCP"},
  {id:"so2",project_id:"p6",label:"P2 — KV: Richard (Patient) smashing GOUT",format:"Photo + CGI · DTC",owner:"alex_t",status:"In progress",delivery:false,notes:"Priority 2 · Shot principal DTC"},
  {id:"so3",project_id:"p6",label:"P3 — CGI: Letters GO revealed (crystals ~49%)",format:"CGI · Extra",owner:"oscar",status:"In progress",delivery:false,notes:"Priority 3 · PSD format"},
  {id:"so4",project_id:"p6",label:"P4.1 — Richard con Nurse standing/talking",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 4"},
  {id:"so5",project_id:"p6",label:"P4.2 — Richard con Nurse · infusion chair standing",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 4 · background needed"},
  {id:"so6",project_id:"p6",label:"P4.3 — Richard con Nurse · infusion chair sitting",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 4 · background needed"},
  {id:"so7",project_id:"p6",label:"P4.4 — Richard con Male Doctor talking",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 4 · background needed"},
  {id:"so8",project_id:"p6",label:"P4.5 — Richard con Analin talking",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 4 · background needed"},
  {id:"so9",project_id:"p6",label:"P5.1 — Analin con Richard · holding tablet",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 5 · background needed"},
  {id:"so10",project_id:"p6",label:"P6.1 — Nurse con patient IV · sitting on stool",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 6 · background needed"},
  {id:"so11",project_id:"p6",label:"P6.2 — Nurse con patient IV · standing",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 6 · background needed"},
  {id:"so12",project_id:"p6",label:"P6.3 — Nurse talking to Analin",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 6"},
  {id:"so13",project_id:"p6",label:"P7.1 — Richard · standing with confidence (rod)",format:"Photo · DTC Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 7 · post smash"},
  {id:"so14",project_id:"p6",label:"P7.2 — Richard · looking to side / camera",format:"Photo · DTC Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 7 · full body"},
  {id:"so15",project_id:"p6",label:"P7.3 — Richard · smiling · full body + headshot",format:"Photo · DTC Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 7"},
  {id:"so16",project_id:"p6",label:"P7.4 — Richard · stuck behind GOUT",format:"Photo · DTC Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 7 · DSE"},
  {id:"so17",project_id:"p6",label:"P7.5 — Richard · hand propped / showing data",format:"Photo · DTC Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 7"},
  {id:"so18",project_id:"p6",label:"P8.1 — Analin · standing with IV pole",format:"Photo · HCP Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 8"},
  {id:"so19",project_id:"p6",label:"P8.2 — Analin · looking to side / camera",format:"Photo · HCP Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 8"},
  {id:"so20",project_id:"p6",label:"P8.3 — Analin · smiling",format:"Photo · HCP Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 8"},
  {id:"so21",project_id:"p6",label:"P8.4 — Analin · looking at tablet",format:"Photo · HCP Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 8"},
  {id:"so22",project_id:"p6",label:"P9 — KV: Nurse smashing GOUT",format:"Photo + CGI · HCP",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 9 · Talent 3"},
  {id:"so23",project_id:"p6",label:"P10 — KV: Male Doctor smashing GOUT",format:"Photo + CGI · HCP",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 10 · Talent 2"},
  {id:"so24",project_id:"p6",label:"P11.1 — Male Doctor · standing with IV pole",format:"Photo · HCP Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 11"},
  {id:"so25",project_id:"p6",label:"P11.2 — Male Doctor · looking to side / camera",format:"Photo · HCP Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 11"},
  {id:"so26",project_id:"p6",label:"P11.3 — Male Doctor · smiling",format:"Photo · HCP Portrait",owner:"alvaro",status:"Not started",delivery:false,notes:"Priority 11"},
  {id:"so27",project_id:"p6",label:"P11.4 — Male Doctor + Consumer together",format:"Photo · Crossover",owner:"alex_t",status:"Not started",delivery:false,notes:"Priority 11"},
  {id:"so28",project_id:"p6",label:"CGI — Palabra GOUT completa",format:"CGI · PSD",owner:"oscar",status:"Not started",delivery:false,notes:"Extra CGI"},
  {id:"so29",project_id:"p6",label:"CGI — GOUT letters UT shattering",format:"CGI · PSD",owner:"oscar",status:"Not started",delivery:false,notes:"Crystals flying away"},
  {id:"so30",project_id:"p6",label:"Video — Analin smashing GOUT",format:"Video",owner:"alex_t",status:"Not started",delivery:true,notes:"HCP Talent 1"},
  {id:"so31",project_id:"p6",label:"Video — Male Doctor smashing GOUT",format:"Video",owner:"alex_t",status:"Not started",delivery:true,notes:"HCP Talent 2"},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getMember = id => TEAM.find(m => m.id === id);
const uid = () => Math.random().toString(36).slice(2, 9);
const daysUntil = date => Math.ceil((new Date(date) - new Date()) / (1000*60*60*24));
const pct = dels => dels.length ? Math.round(dels.filter(d => d.status==="Done").length / dels.length * 100) : 0;
const nextDelStatus = s => { const i = DEL_STATUSES.indexOf(s); return DEL_STATUSES[(i+1) % DEL_STATUSES.length]; };

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const W="#ffffff", BK="#0a0a0a", G50="#fafafa", G100="#f5f5f5", G200="#e5e5e5", G300="#d4d4d4", G400="#a3a3a3", G500="#737373", G700="#404040";
const R4="4px", R8="8px", R12="12px", R99="999px";
const FONT="'Inter','Helvetica Neue',Arial,sans-serif";

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function Avatar({ memberId, size=32 }) {
  const m = getMember(memberId);
  if (!m) return null;
  return <div style={{width:size,height:size,borderRadius:"50%",background:m.color+"18",border:`1.5px solid ${m.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(size*0.34),fontWeight:700,color:m.color,flexShrink:0,userSelect:"none",letterSpacing:"-0.02em",title:m.name}}>{m.initials}</div>;
}

function PhaseBadge({ phase, small }) {
  const c = PHASE_COLORS[phase] || PHASE_COLORS["Brief received"];
  return <span style={{background:c.bg,color:c.text,border:`1px solid ${c.border}`,borderRadius:R4,padding:small?"3px 8px":"5px 12px",fontSize:small?11:13,fontWeight:600,whiteSpace:"nowrap"}}>{phase}</span>;
}

function DelBadge({ status, onClick }) {
  const c = DEL_STATUS_COLORS[status] || DEL_STATUS_COLORS["Not started"];
  return <span onClick={onClick} style={{background:c.bg,color:c.text,border:`1px solid ${c.border}`,borderRadius:R4,padding:"4px 10px",fontSize:12,fontWeight:600,cursor:onClick?"pointer":"default",whiteSpace:"nowrap",userSelect:"none"}}>{status}</span>;
}

function Bar({ value, color }) {
  return <div style={{height:6,background:G200,borderRadius:R99,overflow:"hidden"}}><div style={{width:`${value}%`,height:"100%",background:color||(value===100?"#15803d":BK),borderRadius:R99,transition:"width 0.5s ease"}}/></div>;
}

function Toast({ msg }) {
  return <div style={{position:"fixed",bottom:28,right:28,background:BK,color:W,padding:"13px 22px",borderRadius:R8,fontSize:15,fontWeight:600,zIndex:999,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",animation:"fu 0.2s ease"}}><style>{`@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>✓ {msg}</div>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <div style={{background:W,borderRadius:R12,padding:"36px",width:"100%",maxWidth:wide?680:500,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.22)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div style={{fontSize:24,fontWeight:800,color:BK,letterSpacing:"-0.03em"}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:26,color:G400,lineHeight:1,padding:"4px 8px",cursor:"pointer"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const IS = {width:"100%",padding:"11px 14px",border:`1.5px solid ${G200}`,borderRadius:R8,fontSize:15,background:W,outline:"none",color:BK,fontWeight:500};
const LS = {fontSize:12,fontWeight:700,color:G500,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:8};
const FS = {marginBottom:20};

// ─── APP ──────────────────────────────────────────────────────────────────────
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
  const [editProject, setEditProject] = useState(null);
  const [confirmDone, setConfirmDone] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 2500); };

  useEffect(()=>{ load(); },[]);

  async function load() {
    setLoading(true);
    try {
      let { data:pd } = await supabase.from("projects").select("*").order("created_at");
      let { data:dd } = await supabase.from("deliverables").select("*").order("created_at");
      if (!pd||pd.length===0) {
        await supabase.from("projects").insert(SEED_PROJECTS);
        await supabase.from("deliverables").insert(SEED_DELIVERABLES);
        pd=SEED_PROJECTS; dd=SEED_DELIVERABLES;
      }
      setProjects(pd||[]); setDeliverables(dd||[]);
    } catch { setProjects(SEED_PROJECTS); setDeliverables(SEED_DELIVERABLES); }
    setLoading(false);
  }

  async function updateDelStatus(id, s) {
    setDeliverables(prev=>prev.map(d=>d.id===id?{...d,status:s}:d));
    await supabase.from("deliverables").update({status:s}).eq("id",id);
    showToast("Status updated");
  }

  async function updateProjectPhase(id, phase) {
    setProjects(prev=>prev.map(p=>p.id===id?{...p,phase}:p));
    await supabase.from("projects").update({phase}).eq("id",id);
    showToast("Phase updated");
  }

  async function markProjectDone(id) {
    setProjects(prev=>prev.map(p=>p.id===id?{...p,phase:"Archived"}:p));
    setDeliverables(prev=>prev.map(d=>d.project_id===id?{...d,status:"Done"}:d));
    await supabase.from("projects").update({phase:"Archived"}).eq("id",id);
    await supabase.from("deliverables").update({status:"Done"}).eq("project_id",id);
    setActiveId(null); setView("dashboard");
    showToast("Project marked as done and archived ✓");
  }

  async function addProject(data) {
    const p={id:uid(),...data};
    setProjects(prev=>[...prev,p]);
    await supabase.from("projects").insert(p);
    showToast("Project created");
  }

  async function saveProject(id, data) {
    setProjects(prev=>prev.map(p=>p.id===id?{...p,...data}:p));
    await supabase.from("projects").update(data).eq("id",id);
    showToast("Project updated");
  }

  async function addDeliverable(data) {
    const d={id:uid(),project_id:activeId,...data,status:"Not started"};
    setDeliverables(prev=>[...prev,d]);
    await supabase.from("deliverables").insert(d);
    showToast("Deliverable added");
  }

  async function updateDeliverable(id, data) {
    setDeliverables(prev=>prev.map(d=>d.id===id?{...d,...data}:d));
    await supabase.from("deliverables").update(data).eq("id",id);
    showToast("Deliverable updated");
  }

  async function deleteDeliverable(id) {
    setDeliverables(prev=>prev.filter(d=>d.id!==id));
    await supabase.from("deliverables").delete().eq("id",id);
    showToast("Deliverable removed");
  }

  const dels = id => deliverables.filter(d=>d.project_id===id);
  const activeProjects = projects.filter(p=>p.phase!=="Archived");
  const archivedProjects = projects.filter(p=>p.phase==="Archived");
  const proj = projects.find(p=>p.id===activeId);

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:W,fontFamily:FONT}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:32,fontWeight:800,color:BK,letterSpacing:"-0.04em",marginBottom:8}}>Garrigosa Studio</div>
        <div style={{fontSize:16,color:G400,fontWeight:500}}>Loading platform…</div>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:FONT,background:W,color:BK}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}button{cursor:pointer;font-family:inherit}input,select,textarea{font-family:inherit}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${G200};border-radius:99px}`}</style>

      {/* ── SIDEBAR ── */}
      <div style={{width:252,background:BK,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"28px 24px 22px"}}>
          <div style={{fontSize:22,fontWeight:800,color:W,letterSpacing:"-0.04em",lineHeight:1}}>Garrigosa</div>
          <div style={{fontSize:10,color:"#525252",marginTop:5,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Studio Platform</div>
        </div>
        <div style={{height:1,background:"#1f1f1f"}}/>
        <div style={{padding:"14px 12px"}}>
          {[["dashboard","Dashboard","○"],["pipeline","Pipeline","◫"],["workload","Workload","◎"],["archive","Archive","◇"]].map(([id,label,icon])=>{
            const isA=view===id&&!activeId;
            return <button key={id} onClick={()=>{setView(id);setActiveId(null);setFilter("All");}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 14px",borderRadius:R8,border:"none",background:isA?W:"transparent",color:isA?BK:"#737373",fontSize:15,fontWeight:isA?700:500,textAlign:"left",transition:"all 0.15s",marginBottom:3}}><span style={{fontSize:13,opacity:0.6}}>{icon}</span>{label}</button>;
          })}
        </div>
        <div style={{height:1,background:"#1f1f1f"}}/>
        <div style={{padding:"14px 12px",flex:1}}>
          <div style={{fontSize:10,fontWeight:700,color:"#404040",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,paddingLeft:14}}>Active Projects</div>
          {activeProjects.map(p=>{
            const pc=pct(dels(p.id)); const isA=activeId===p.id;
            return <button key={p.id} onClick={()=>{setView("project");setActiveId(p.id);setFilter("All");}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 14px",borderRadius:R8,border:"none",background:isA?W:"transparent",color:isA?BK:"#a3a3a3",fontSize:13,fontWeight:isA?700:500,textAlign:"left",transition:"all 0.15s",marginBottom:2}}>
              <div style={{width:7,height:7,borderRadius:"50%",flexShrink:0,background:pc===100?"#22c55e":pc>0?"#3b82f6":"#404040"}}/>
              <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</span>
              <span style={{fontSize:10,color:isA?G400:"#525252",flexShrink:0,fontWeight:600}}>{pc}%</span>
            </button>;
          })}
          <button onClick={()=>setShowNP(true)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",borderRadius:R8,border:"1px dashed #2a2a2a",background:"transparent",color:"#525252",fontSize:13,fontWeight:500,marginTop:8}}>
            <span style={{fontSize:16,lineHeight:1}}>+</span> New project
          </button>
        </div>
        <div style={{height:1,background:"#1f1f1f"}}/>
        <div style={{padding:"14px 24px",fontSize:11,color:"#404040",fontWeight:600}}>v2.0 · Garrigosa Studio</div>
      </div>

      {/* ── MAIN ── */}
      <div style={{flex:1,overflowY:"auto",minWidth:0,background:G50}}>
        {view==="dashboard"&&!activeId && <Dashboard projects={activeProjects} dels={dels} onOpen={id=>{setActiveId(id);setView("project");}} onNew={()=>setShowNP(true)}/>}
        {view==="project"&&proj && <ProjectView project={proj} deliverables={dels(proj.id)} filter={filter} setFilter={setFilter} expDel={expDel} setExpDel={setExpDel} onDelStatus={updateDelStatus} onAdd={()=>setShowND(true)} onPhaseChange={updateProjectPhase} onEdit={()=>setEditProject(proj)} onMarkDone={()=>setConfirmDone(proj)} onDelEdit={updateDeliverable} onDelDelete={deleteDeliverable}/>}
        {view==="pipeline" && <PipelineView projects={activeProjects} dels={dels} onOpen={id=>{setActiveId(id);setView("project");}} onPhaseChange={updateProjectPhase}/>}
        {view==="workload" && <WorkloadView projects={activeProjects} dels={dels}/>}
        {view==="archive" && <ArchiveView projects={archivedProjects} dels={dels} onOpen={id=>{setActiveId(id);setView("project");}}/>}
      </div>

      {showNP && <NewProjectModal onClose={()=>setShowNP(false)} onSave={d=>{addProject(d);setShowNP(false);}}/>}
      {showND&&activeId && <NewDeliverableModal onClose={()=>setShowND(false)} onSave={d=>{addDeliverable(d);setShowND(false);}}/>}
      {editProject && <EditProjectModal project={editProject} onClose={()=>setEditProject(null)} onSave={d=>{saveProject(editProject.id,d);setEditProject(null);}}/>}
      {confirmDone && <ConfirmDoneModal project={confirmDone} onClose={()=>setConfirmDone(null)} onConfirm={()=>{markProjectDone(confirmDone.id);setConfirmDone(null);}}/>}
      {toast && <Toast msg={toast}/>}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ projects, dels, onOpen, onNew }) {
  const all = projects.flatMap(p=>dels(p.id));
  const urgent = projects.filter(p=>daysUntil(p.due_date)<=7&&p.phase!=="Archived");
  return (
    <div style={{padding:"44px 52px 64px"}}>
      <div style={{marginBottom:44}}>
        <div style={{fontSize:40,fontWeight:800,color:BK,letterSpacing:"-0.04em",lineHeight:1.1,marginBottom:10}}>Studio Overview</div>
        <div style={{fontSize:16,color:G500,fontWeight:500}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>

      {urgent.length>0 && (
        <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:R12,padding:"16px 22px",marginBottom:32,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:18}}>⚠</span>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#c2410c",marginBottom:2}}>{urgent.length} project{urgent.length>1?"s":""} due within 7 days</div>
            <div style={{fontSize:13,color:"#9a3412"}}>{urgent.map(p=>p.name).join(" · ")}</div>
          </div>
        </div>
      )}

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
  const pc_color = PHASE_COLORS[p.phase]||PHASE_COLORS["Brief received"];
  return (
    <div onClick={onClick} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,0.09)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}} style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"26px",cursor:"pointer",transition:"all 0.2s",borderTop:`3px solid ${urg?"#ef4444":BK}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div style={{flex:1,marginRight:10}}>
          <div style={{fontSize:16,fontWeight:700,color:BK,marginBottom:4,letterSpacing:"-0.02em",lineHeight:1.3}}>{p.name}</div>
          <div style={{fontSize:13,color:G500,fontWeight:500}}>{p.client}{p.agency?` · ${p.agency}`:""}</div>
        </div>
        <PhaseBadge phase={p.phase} small/>
      </div>
      <div style={{display:"inline-block",fontSize:11,fontWeight:700,color:G500,background:G100,border:`1px solid ${G200}`,borderRadius:R4,padding:"3px 10px",margin:"12px 0",textTransform:"uppercase",letterSpacing:"0.07em"}}>{p.type}</div>
      <Bar value={pc}/>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:10,marginBottom:16}}>
        <div style={{fontSize:13,color:G500,fontWeight:500}}>{deliverables.filter(d=>d.status==="Done").length}/{deliverables.length} delivered</div>
        <div style={{fontSize:13,fontWeight:700,color:urg?"#ef4444":G400}}>{days>0?`${days}d left`:days===0?"Due today":"Overdue"}</div>
      </div>
      <div style={{height:1,background:G100,marginBottom:16}}/>
      <div style={{display:"flex",gap:5}}>{p.team?.slice(0,6).map(id=><Avatar key={id} memberId={id} size={28}/>)}</div>
    </div>
  );
}

// ─── PIPELINE VIEW ────────────────────────────────────────────────────────────
function PipelineView({ projects, dels, onOpen, onPhaseChange }) {
  const phases = PROJECT_PHASES.filter(ph=>ph!=="Archived");
  return (
    <div style={{padding:"44px 40px 64px"}}>
      <div style={{fontSize:40,fontWeight:800,color:BK,letterSpacing:"-0.04em",marginBottom:8}}>Pipeline</div>
      <div style={{fontSize:16,color:G500,fontWeight:500,marginBottom:40}}>Projects by phase — drag or click to update</div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${phases.length},1fr)`,gap:12,overflowX:"auto"}}>
        {phases.map(phase=>{
          const phProjs=projects.filter(p=>p.phase===phase);
          const c=PHASE_COLORS[phase];
          return (
            <div key={phase} style={{minWidth:180}}>
              <div style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:R8,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:12,fontWeight:700,color:c.text,textTransform:"uppercase",letterSpacing:"0.06em"}}>{phase}</span>
                <span style={{fontSize:13,fontWeight:800,color:c.text}}>{phProjs.length}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {phProjs.map(p=>{
                  const pc2=pct(dels(p.id));
                  return (
                    <div key={p.id} style={{background:W,border:`1px solid ${G200}`,borderRadius:R8,padding:"14px 16px",cursor:"pointer",transition:"all 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
                      onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
                      <div style={{fontSize:13,fontWeight:700,color:BK,marginBottom:5,lineHeight:1.3}} onClick={()=>onOpen(p.id)}>{p.name}</div>
                      <div style={{fontSize:11,color:G400,marginBottom:10,fontWeight:500}}>{p.client}</div>
                      <Bar value={pc2}/>
                      <div style={{fontSize:11,color:G400,marginTop:6,marginBottom:10,fontWeight:500}}>{pc2}% delivered</div>
                      <select value={p.phase} onChange={e=>{e.stopPropagation();onPhaseChange(p.id,e.target.value);}} style={{width:"100%",fontSize:11,padding:"5px 8px",border:`1px solid ${G200}`,borderRadius:R4,background:G50,color:G700,fontWeight:600,cursor:"pointer"}}>
                        {PROJECT_PHASES.filter(ph=>ph!=="Archived").map(ph=><option key={ph} value={ph}>{ph}</option>)}
                      </select>
                    </div>
                  );
                })}
                {phProjs.length===0&&<div style={{padding:"20px 16px",textAlign:"center",color:G300,fontSize:13,border:`1px dashed ${G200}`,borderRadius:R8}}>Empty</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROJECT VIEW ─────────────────────────────────────────────────────────────
function ProjectView({ project:p, deliverables, filter, setFilter, expDel, setExpDel, onDelStatus, onAdd, onPhaseChange, onEdit, onMarkDone, onDelEdit, onDelDelete }) {
  const pc=pct(deliverables);
  const filtered=filter==="All"?deliverables:deliverables.filter(d=>d.status===filter);
  const [editingDel, setEditingDel] = useState(null);

  return (
    <div style={{padding:"44px 52px 64px"}}>
      {/* Header */}
      <div style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"36px 40px",marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div style={{flex:1,marginRight:20}}>
            <div style={{fontSize:34,fontWeight:800,color:BK,letterSpacing:"-0.04em",lineHeight:1.2,marginBottom:8}}>{p.name}</div>
            <div style={{fontSize:15,color:G500,fontWeight:500,marginBottom:4}}>{p.client}{p.agency?` · ${p.agency}`:""}</div>
            <div style={{fontSize:14,color:G500,lineHeight:1.7,marginTop:10}}>{p.description}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"flex-end",flexShrink:0}}>
            <PhaseBadge phase={p.phase}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={onEdit} style={{fontSize:13,padding:"8px 16px",borderRadius:R8,border:`1.5px solid ${G200}`,background:W,color:G700,fontWeight:600}}>Edit</button>
              <button onClick={onAdd} style={{fontSize:13,padding:"8px 16px",borderRadius:R8,border:"none",background:BK,color:W,fontWeight:600}}>+ Add deliverable</button>
            </div>
            <button onClick={onMarkDone} style={{fontSize:13,padding:"9px 18px",borderRadius:R8,border:"1.5px solid #15803d",background:"#f0fdf4",color:"#15803d",fontWeight:700,letterSpacing:"0.01em"}}>✓ Mark project as Done</button>
          </div>
        </div>

        {/* Phase selector */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,padding:"14px 18px",background:G50,borderRadius:R8,border:`1px solid ${G200}`}}>
          <span style={{fontSize:12,fontWeight:700,color:G500,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>Project phase</span>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {PROJECT_PHASES.filter(ph=>ph!=="Archived").map(ph=>{
              const c=PHASE_COLORS[ph]; const isA=p.phase===ph;
              return <button key={ph} onClick={()=>onPhaseChange(p.id,ph)} style={{fontSize:12,padding:"5px 12px",borderRadius:R4,fontWeight:600,border:`1.5px solid ${isA?c.text:G200}`,background:isA?c.bg:W,color:isA?c.text:G400,transition:"all 0.15s"}}>{ph}</button>;
            })}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:20}}>
          <div style={{flex:1}}><Bar value={pc}/></div>
          <div style={{fontSize:16,fontWeight:700,color:BK,whiteSpace:"nowrap"}}>{deliverables.filter(d=>d.status==="Done").length}/{deliverables.length} · {pc}%</div>
        </div>
        <div style={{height:1,background:G100,marginBottom:18}}/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {p.team?.map(id=>{const m=getMember(id);return m?<div key={id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",background:G50,borderRadius:R99,border:`1px solid ${G200}`}}><Avatar memberId={id} size={22}/><span style={{fontSize:13,fontWeight:600,color:G700}}>{m.name}</span></div>:null;})}
        </div>
      </div>

      {/* Status summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {DEL_STATUSES.map(s=>{const c=DEL_STATUS_COLORS[s];const cnt=deliverables.filter(d=>d.status===s).length;return(
          <div key={s} onClick={()=>setFilter(filter===s?"All":s)} style={{background:filter===s?BK:W,border:`1px solid ${filter===s?BK:G200}`,borderRadius:R8,padding:"18px 22px",cursor:"pointer",transition:"all 0.15s"}}>
            <div style={{fontSize:32,fontWeight:800,color:filter===s?W:c.text,letterSpacing:"-0.03em",lineHeight:1}}>{cnt}</div>
            <div style={{fontSize:12,fontWeight:700,color:filter===s?"#a3a3a3":c.text,marginTop:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>{s}</div>
          </div>
        );})}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {["All",...DEL_STATUSES].map(f=><button key={f} onClick={()=>setFilter(f)} style={{fontSize:13,padding:"8px 18px",borderRadius:R8,fontWeight:600,border:`1.5px solid ${filter===f?BK:G200}`,background:filter===f?BK:W,color:filter===f?W:G500,transition:"all 0.15s"}}>{f}</button>)}
      </div>

      {/* Deliverables table */}
      <div style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 140px 150px 130px 90px 40px",padding:"14px 24px",borderBottom:`1px solid ${G100}`,background:G50}}>
          {["Deliverable","Format","Owner","Status","",""].map((h,i)=><div key={i} style={{fontSize:11,fontWeight:700,color:G400,textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</div>)}
        </div>

        {filtered.map((d,i)=>{
          const owner=getMember(d.owner); const isExp=expDel[d.id];
          return <div key={d.id}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 140px 150px 130px 90px 40px",padding:"16px 24px",borderBottom:i<filtered.length-1?`1px solid ${G100}`:"none",background:d.status==="Done"?"#fafffe":W,alignItems:"center"}}>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:d.status==="Done"?G400:BK,textDecoration:d.status==="Done"?"line-through":"none",letterSpacing:"-0.01em"}}>{d.label}</div>
                {d.notes&&<div style={{fontSize:12,color:G400,marginTop:3,fontWeight:500}}>{d.notes}</div>}
              </div>
              <div style={{fontSize:13,color:G500,fontWeight:500}}>{d.format}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>{owner&&<><Avatar memberId={d.owner} size={26}/><span style={{fontSize:13,fontWeight:600,color:G700}}>{owner.name}</span></>}</div>
              <div><DelBadge status={d.status} onClick={()=>onDelStatus(d.id,nextDelStatus(d.status))}/></div>
              <div style={{display:"flex",gap:4}}>
                {d.delivery&&<button onClick={()=>setExpDel(prev=>({...prev,[d.id]:!prev[d.id]}))} style={{fontSize:11,padding:"5px 8px",borderRadius:R4,fontWeight:600,border:`1px solid ${G200}`,background:"transparent",color:G500}}>{isExp?"▾":"▸"}</button>}
                <button onClick={()=>setEditingDel(d)} style={{fontSize:11,padding:"5px 8px",borderRadius:R4,border:`1px solid ${G200}`,background:"transparent",color:G400,fontWeight:600}}>✎</button>
              </div>
              <div><button onClick={()=>onDelDelete(d.id)} style={{fontSize:13,padding:"4px 6px",borderRadius:R4,border:"none",background:"transparent",color:G300,fontWeight:700}}>×</button></div>
            </div>
            {isExp&&d.delivery&&<div style={{padding:"16px 24px 20px",background:G50,borderBottom:i<filtered.length-1?`1px solid ${G100}`:"none"}}>
              <div style={{fontSize:11,fontWeight:700,color:G400,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Delivery package required</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                {DELIVERY_SPECS.map(s=><div key={s} style={{display:"flex",alignItems:"center",gap:8,fontSize:14,color:G700,fontWeight:500}}><div style={{width:18,height:18,border:`2px solid ${G300}`,borderRadius:4,background:W,flexShrink:0}}/>{s}</div>)}
              </div>
            </div>}
          </div>;
        })}

        {filtered.length===0&&<div style={{padding:"56px",textAlign:"center",color:G400,fontSize:16,fontWeight:500}}>No deliverables match this filter</div>}
      </div>

      {editingDel && <EditDeliverableModal deliverable={editingDel} onClose={()=>setEditingDel(null)} onSave={data=>{onDelEdit(editingDel.id,data);setEditingDel(null);}}/>}
    </div>
  );
}

// ─── WORKLOAD ─────────────────────────────────────────────────────────────────
function WorkloadView({ projects, dels }) {
  const wl=TEAM.map(m=>{
    const items=projects.flatMap(p=>dels(p.id).filter(d=>d.owner===m.id).map(d=>({...d,projectName:p.name})));
    return{...m,items,todo:items.filter(d=>d.status!=="Done").length,done:items.filter(d=>d.status==="Done").length,total:items.length};
  }).filter(m=>m.total>0).sort((a,b)=>b.todo-a.todo);
  return (
    <div style={{padding:"44px 52px 64px"}}>
      <div style={{fontSize:40,fontWeight:800,color:BK,letterSpacing:"-0.04em",marginBottom:8}}>Workload</div>
      <div style={{fontSize:16,color:G500,fontWeight:500,marginBottom:44}}>Active deliverables per team member</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
        {wl.map(m=>{
          const pc2=m.total?Math.round(m.done/m.total*100):0;
          return <div key={m.id} style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"26px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <Avatar memberId={m.id} size={46}/>
              <div style={{flex:1}}>
                <div style={{fontSize:17,fontWeight:700,color:BK,letterSpacing:"-0.02em"}}>{m.name}</div>
                <div style={{fontSize:13,color:G500,marginTop:3}}>{m.role}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:40,fontWeight:800,color:m.todo>0?BK:"#15803d",letterSpacing:"-0.04em",lineHeight:1}}>{m.todo}</div>
                <div style={{fontSize:11,color:G400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>pending</div>
              </div>
            </div>
            <Bar value={pc2}/>
            <div style={{fontSize:13,color:G400,margin:"8px 0 16px"}}>{m.done}/{m.total} delivered · {pc2}%</div>
            <div style={{height:1,background:G100,marginBottom:14}}/>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {m.items.slice(0,5).map(d=>{
                const c=DEL_STATUS_COLORS[d.status]||DEL_STATUS_COLORS["Not started"];
                return <div key={d.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",background:G50,borderRadius:R8}}>
                  <div style={{flex:1,marginRight:10}}>
                    <div style={{fontSize:13,color:G700,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</div>
                    <div style={{fontSize:11,color:G400,marginTop:2}}>{d.projectName}</div>
                  </div>
                  <DelBadge status={d.status}/>
                </div>;
              })}
              {m.items.length>5&&<div style={{fontSize:13,color:G400,textAlign:"center",fontWeight:600}}>+{m.items.length-5} more</div>}
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}

// ─── ARCHIVE ──────────────────────────────────────────────────────────────────
function ArchiveView({ projects, dels, onOpen }) {
  return (
    <div style={{padding:"44px 52px 64px"}}>
      <div style={{fontSize:40,fontWeight:800,color:BK,letterSpacing:"-0.04em",marginBottom:8}}>Archive</div>
      <div style={{fontSize:16,color:G500,fontWeight:500,marginBottom:44}}>Completed & archived projects</div>
      {projects.length===0
        ?<div style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"56px",textAlign:"center",color:G400,fontSize:16}}>No archived projects yet.</div>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
          {projects.map(p=><div key={p.id} onClick={()=>onOpen(p.id)} style={{background:W,border:`1px solid ${G200}`,borderRadius:R12,padding:"26px",opacity:0.75,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.75"}>
            <div style={{fontSize:16,fontWeight:700,color:BK,marginBottom:5,letterSpacing:"-0.02em"}}>{p.name}</div>
            <div style={{fontSize:13,color:G500,marginBottom:12}}>{p.client}{p.agency?` · ${p.agency}`:""}</div>
            <div style={{fontSize:14,color:"#15803d",fontWeight:700}}>✓ {dels(p.id).length} deliverables · archived</div>
          </div>)}
        </div>}
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function NewProjectModal({ onClose, onSave }) {
  const [f,setF]=useState({name:"",client:"",agency:"",type:"Digital Campaign",phase:"Brief received",due_date:"",description:"",team:[]});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title="New project" onClose={onClose} wide>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div style={{...FS,gridColumn:"1/-1"}}><label style={LS}>Project name</label><input style={IS} value={f.name} onChange={e=>s("name",e.target.value)} placeholder="e.g. Nike — Spring Campaign"/></div>
      <div style={FS}><label style={LS}>Client</label><input style={IS} value={f.client} onChange={e=>s("client",e.target.value)} placeholder="e.g. Nike"/></div>
      <div style={FS}><label style={LS}>Agency</label><input style={IS} value={f.agency} onChange={e=>s("agency",e.target.value)} placeholder="e.g. TBWA (optional)"/></div>
      <div style={FS}><label style={LS}>Type</label><select style={IS} value={f.type} onChange={e=>s("type",e.target.value)}>{PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
      <div style={FS}><label style={LS}>Phase</label><select style={IS} value={f.phase} onChange={e=>s("phase",e.target.value)}>{PROJECT_PHASES.map(ph=><option key={ph}>{ph}</option>)}</select></div>
      <div style={{...FS,gridColumn:"1/-1"}}><label style={LS}>Due date</label><input type="date" style={IS} value={f.due_date} onChange={e=>s("due_date",e.target.value)}/></div>
      <div style={{...FS,gridColumn:"1/-1"}}><label style={LS}>Description</label><textarea style={{...IS,resize:"vertical",minHeight:72}} value={f.description} onChange={e=>s("description",e.target.value)}/></div>
      <div style={{...FS,gridColumn:"1/-1"}}>
        <label style={LS}>Team</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
          {TEAM.map(m=><button key={m.id} onClick={()=>s("team",f.team.includes(m.id)?f.team.filter(x=>x!==m.id):[...f.team,m.id])} style={{padding:"7px 14px",borderRadius:R8,fontSize:13,fontWeight:600,border:`1.5px solid ${f.team.includes(m.id)?m.color:G200}`,background:f.team.includes(m.id)?m.color+"15":W,color:f.team.includes(m.id)?m.color:G500}}>{m.name}</button>)}
        </div>
      </div>
    </div>
    <button onClick={()=>f.name&&onSave(f)} style={{width:"100%",padding:"14px",borderRadius:R8,border:"none",background:BK,color:W,fontSize:15,fontWeight:700}}>Create project</button>
  </Modal>;
}

function EditProjectModal({ project, onClose, onSave }) {
  const [f,setF]=useState({name:project.name,client:project.client,agency:project.agency||"",type:project.type,phase:project.phase,due_date:project.due_date||"",description:project.description||"",team:project.team||[]});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title="Edit project" onClose={onClose} wide>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div style={{...FS,gridColumn:"1/-1"}}><label style={LS}>Project name</label><input style={IS} value={f.name} onChange={e=>s("name",e.target.value)}/></div>
      <div style={FS}><label style={LS}>Client</label><input style={IS} value={f.client} onChange={e=>s("client",e.target.value)}/></div>
      <div style={FS}><label style={LS}>Agency</label><input style={IS} value={f.agency} onChange={e=>s("agency",e.target.value)}/></div>
      <div style={FS}><label style={LS}>Type</label><select style={IS} value={f.type} onChange={e=>s("type",e.target.value)}>{PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
      <div style={FS}><label style={LS}>Due date</label><input type="date" style={IS} value={f.due_date} onChange={e=>s("due_date",e.target.value)}/></div>
      <div style={{...FS,gridColumn:"1/-1"}}><label style={LS}>Description</label><textarea style={{...IS,resize:"vertical",minHeight:72}} value={f.description} onChange={e=>s("description",e.target.value)}/></div>
      <div style={{...FS,gridColumn:"1/-1"}}>
        <label style={LS}>Team</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
          {TEAM.map(m=><button key={m.id} onClick={()=>s("team",f.team.includes(m.id)?f.team.filter(x=>x!==m.id):[...f.team,m.id])} style={{padding:"7px 14px",borderRadius:R8,fontSize:13,fontWeight:600,border:`1.5px solid ${f.team.includes(m.id)?m.color:G200}`,background:f.team.includes(m.id)?m.color+"15":W,color:f.team.includes(m.id)?m.color:G500}}>{m.name}</button>)}
        </div>
      </div>
    </div>
    <button onClick={()=>f.name&&onSave(f)} style={{width:"100%",padding:"14px",borderRadius:R8,border:"none",background:BK,color:W,fontSize:15,fontWeight:700}}>Save changes</button>
  </Modal>;
}

function NewDeliverableModal({ onClose, onSave }) {
  const [f,setF]=useState({label:"",format:"",owner:"juan",delivery:false,notes:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title="Add deliverable" onClose={onClose}>
    <div style={FS}><label style={LS}>Name</label><input style={IS} value={f.label} onChange={e=>s("label",e.target.value)} placeholder="e.g. KV Static — Hero shot"/></div>
    <div style={FS}><label style={LS}>Format</label><input style={IS} value={f.format} onChange={e=>s("format",e.target.value)} placeholder="e.g. CGI Still, Video 16:9"/></div>
    <div style={FS}><label style={LS}>Notes</label><input style={IS} value={f.notes} onChange={e=>s("notes",e.target.value)} placeholder="Optional notes"/></div>
    <div style={FS}><label style={LS}>Owner</label><select style={IS} value={f.owner} onChange={e=>s("owner",e.target.value)}>{TEAM.map(m=><option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}</select></div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
      <input type="checkbox" id="dc" checked={f.delivery} onChange={e=>s("delivery",e.target.checked)} style={{width:20,height:20,accentColor:BK}}/>
      <label htmlFor="dc" style={{fontSize:15,color:G700,fontWeight:500,cursor:"pointer"}}>Requires full delivery package (mov, mp4, stems…)</label>
    </div>
    <button onClick={()=>f.label&&onSave(f)} style={{width:"100%",padding:"14px",borderRadius:R8,border:"none",background:BK,color:W,fontSize:15,fontWeight:700}}>Add deliverable</button>
  </Modal>;
}

function EditDeliverableModal({ deliverable, onClose, onSave }) {
  const [f,setF]=useState({label:deliverable.label,format:deliverable.format||"",notes:deliverable.notes||"",owner:deliverable.owner,delivery:deliverable.delivery||false});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return <Modal title="Edit deliverable" onClose={onClose}>
    <div style={FS}><label style={LS}>Name</label><input style={IS} value={f.label} onChange={e=>s("label",e.target.value)}/></div>
    <div style={FS}><label style={LS}>Format</label><input style={IS} value={f.format} onChange={e=>s("format",e.target.value)}/></div>
    <div style={FS}><label style={LS}>Notes</label><input style={IS} value={f.notes} onChange={e=>s("notes",e.target.value)}/></div>
    <div style={FS}><label style={LS}>Owner</label><select style={IS} value={f.owner} onChange={e=>s("owner",e.target.value)}>{TEAM.map(m=><option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}</select></div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
      <input type="checkbox" checked={f.delivery} onChange={e=>s("delivery",e.target.checked)} style={{width:20,height:20,accentColor:BK}}/>
      <span style={{fontSize:15,color:G700,fontWeight:500}}>Requires full delivery package</span>
    </div>
    <button onClick={()=>f.label&&onSave(f)} style={{width:"100%",padding:"14px",borderRadius:R8,border:"none",background:BK,color:W,fontSize:15,fontWeight:700}}>Save changes</button>
  </Modal>;
}

function ConfirmDoneModal({ project, onClose, onConfirm }) {
  return <Modal title="Mark project as Done?" onClose={onClose}>
    <div style={{fontSize:15,color:G500,marginBottom:24,lineHeight:1.7}}>
      This will mark <strong style={{color:BK}}>{project.name}</strong> as complete, set all deliverables to Done, and move the project to the Archive.<br/><br/>This action can be undone by reopening the project from the Archive.
    </div>
    <div style={{display:"flex",gap:12}}>
      <button onClick={onClose} style={{flex:1,padding:"13px",borderRadius:R8,border:`1.5px solid ${G200}`,background:W,color:G700,fontSize:15,fontWeight:600}}>Cancel</button>
      <button onClick={onConfirm} style={{flex:1,padding:"13px",borderRadius:R8,border:"none",background:"#15803d",color:W,fontSize:15,fontWeight:700}}>✓ Mark as Done</button>
    </div>
  </Modal>;
}
