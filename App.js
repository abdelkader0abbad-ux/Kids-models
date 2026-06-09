import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wcutnjxobbzqkgphmixq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdXRuanhvYmJ6cWtncGhtaXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDUxOTAsImV4cCI6MjA5NjUyMTE5MH0.Kj4XZNKFZj6yXbe5k9NGfySZ3JVqoKJmZ_bHvWfob6I"
);

const PLATFORM_OPTIONS = ["Facebook","Instagram","Pinterest","TikTok","YouTube","Wildberries","Ozon","أخرى"];
const DECISION_OPTIONS = ["🤔 مش متأكد","✅ Shortlist","❌ مرفوض"];
const PLATFORM_ICONS = { Facebook:"🔵",Instagram:"📸",Pinterest:"📌",TikTok:"🎵",YouTube:"▶️",Wildberries:"🫐",Ozon:"🟠","أخرى":"🌐" };
const DEC_COLOR = { "✅ Shortlist":"#dcfce7","❌ مرفوض":"#fee2e2","🤔 مش متأكد":"#fef9c3" };
const DEC_BORDER = { "✅ Shortlist":"#16a34a","❌ مرفوض":"#dc2626","🤔 مش متأكد":"#ca8a04" };

const emptyDraft = () => ({ name:"",image_url:"",video_url:"",product_url:"",platform:"",fabric:"",sales:"",rating1:0,rating2:0,notes:"",decision:"🤔 مش متأكد" });

const StarRating = ({ value, onChange }) => (
  <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
    {[1,2,3,4,5].map(s => (
      <button key={s} onClick={() => onChange(s)}
        style={{ fontSize:22, background:"none", border:"none", cursor:"pointer", color: s <= value ? "#f59e0b" : "#d1d5db", transition:"transform 0.1s" }}
        onMouseEnter={e => e.target.style.transform="scale(1.3)"}
        onMouseLeave={e => e.target.style.transform="scale(1)"}
      >★</button>
    ))}
  </div>
);

function ModelCard({ model, onUpdate, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(model);

  useEffect(() => { setLocal(model); setImgError(false); }, [model.id]);

  const avg = local.rating1 && local.rating2
    ? ((Number(local.rating1)+Number(local.rating2))/2).toFixed(1)
    : local.rating1 || local.rating2 || "—";

  const ch = (f,v) => setLocal(p => ({...p,[f]:v}));
  const save = async (f,v) => { setSaving(true); await onUpdate(model.id,{[f]:v}); setSaving(false); };
  const handleDecision = d => { ch("decision",d); save("decision",d); };
  const handleRating = (f,v) => { ch(f,v); save(f,v); };

  const card = {
    borderRadius:16, overflow:"hidden", boxShadow: saving ? "0 0 0 2px #3b82f6" : "0 2px 8px rgba(0,0,0,0.1)",
    background:"#fff", display:"flex", flexDirection:"column", transition:"box-shadow 0.3s"
  };
  const inp = (extra={}) => ({ width:"100%", borderRadius:8, border:"1px solid #e5e7eb", padding:"8px 12px", fontSize:13, textAlign:"right", boxSizing:"border-box", ...extra });

  return (
    <div style={card}>
      {/* Image */}
      <div style={{ position:"relative", height:220, background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {local.image_url && !imgError
          ? <img src={local.image_url} alt="موديل" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={() => setImgError(true)} />
          : <div style={{ textAlign:"center", color:"#d1d5db" }}><div style={{ fontSize:48 }}>👕</div><div style={{ fontSize:12 }}>أضف رابط صورة</div></div>
        }
        <div style={{ position:"absolute", top:8, right:8, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:"bold", background: DEC_COLOR[local.decision] }}>{local.decision}</div>
        {avg !== "—" && <div style={{ position:"absolute", top:8, left:8, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:"bold", background:"#1e3a5f", color:"#fff" }}>⭐ {avg}</div>}
        {local.platform && <div style={{ position:"absolute", bottom:8, right:8, borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:"bold", background:"rgba(0,0,0,0.55)", color:"#fff" }}>{PLATFORM_ICONS[local.platform]||"🌐"} {local.platform}</div>}
        {saving && <div style={{ position:"absolute", bottom:8, left:8, borderRadius:20, padding:"2px 8px", fontSize:11, background:"rgba(37,99,235,0.85)", color:"#fff" }}>💾 حفظ...</div>}
      </div>

      <div style={{ padding:16, display:"flex", flexDirection:"column", gap:10, flex:1 }}>
        <input style={inp({ fontWeight:"bold", background:"#f9fafb" })} placeholder="اسم / وصف الموديل"
          value={local.name} onChange={e => ch("name",e.target.value)} onBlur={() => save("name",local.name)} />

        <input style={inp({ background:"#f0f9ff", fontSize:12 })} placeholder="🖼️ رابط الصورة"
          value={local.image_url} onChange={e => { ch("image_url",e.target.value); setImgError(false); }} onBlur={() => save("image_url",local.image_url)} />

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input style={inp({ background:"#fdf4ff", fontSize:12, flex:1 })} placeholder="🔗 رابط المنتج"
            value={local.product_url} onChange={e => ch("product_url",e.target.value)} onBlur={() => save("product_url",local.product_url)} />
          {local.product_url && <a href={local.product_url} target="_blank" rel="noopener noreferrer"
            style={{ borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:"bold", background:"#7c3aed", color:"#fff", textDecoration:"none", whiteSpace:"nowrap" }}>فتح ↗</a>}
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input style={inp({ background:"#f0fdf4", fontSize:12, flex:1 })} placeholder="🎬 رابط الفيديو (اختياري)"
            value={local.video_url} onChange={e => ch("video_url",e.target.value)} onBlur={() => save("video_url",local.video_url)} />
          {local.video_url && <a href={local.video_url} target="_blank" rel="noopener noreferrer"
            style={{ borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:"bold", background:"#16a34a", color:"#fff", textDecoration:"none", whiteSpace:"nowrap" }}>▶ فيديو</a>}
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <select style={inp({ flex:1, background:"#f9fafb", fontSize:12 })} value={local.platform}
            onChange={e => { ch("platform",e.target.value); save("platform",e.target.value); }}>
            <option value="">📱 المنصة</option>
            {PLATFORM_OPTIONS.map(p => <option key={p}>{PLATFORM_ICONS[p]} {p}</option>)}
          </select>
          <input style={inp({ flex:1, background:"#f9fafb", fontSize:12 })} placeholder="🧵 القماش"
            value={local.fabric} onChange={e => ch("fabric",e.target.value)} onBlur={() => save("fabric",local.fabric)} />
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12, color:"#6b7280", whiteSpace:"nowrap" }}>📦 كمية البيع</span>
          <input type="number" min="0" style={inp({ background:"#fff7ed", fontWeight:"bold", textAlign:"center" })}
            placeholder="0" value={local.sales} onChange={e => ch("sales",e.target.value)}
            onBlur={() => save("sales", local.sales ? parseInt(local.sales) : null)} />
          <span style={{ fontSize:12, color:"#9ca3af" }}>وحدة</span>
        </div>

        <div style={{ borderRadius:12, padding:12, background:"#f8fafc", display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <StarRating value={local.rating1} onChange={v => handleRating("rating1",v)} />
            <span style={{ fontSize:12, fontWeight:"bold", color:"#6b7280" }}>شريك 1</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <StarRating value={local.rating2} onChange={v => handleRating("rating2",v)} />
            <span style={{ fontSize:12, fontWeight:"bold", color:"#6b7280" }}>شريك 2</span>
          </div>
          <div style={{ textAlign:"center", fontSize:12, fontWeight:"bold", color:"#1e3a5f" }}>متوسط: {avg} ⭐</div>
        </div>

        <textarea style={inp({ background:"#f9fafb", fontSize:12, resize:"none", height:60 })} placeholder="ملاحظات..."
          value={local.notes} onChange={e => ch("notes",e.target.value)} onBlur={() => save("notes",local.notes)} />

        <div style={{ display:"flex", gap:6 }}>
          {DECISION_OPTIONS.map(d => (
            <button key={d} onClick={() => handleDecision(d)}
              style={{ flex:1, borderRadius:8, padding:"8px 4px", fontSize:11, fontWeight:"bold", cursor:"pointer", transition:"all 0.2s",
                background: local.decision===d ? DEC_COLOR[d] : "#f3f4f6",
                border: local.decision===d ? `2px solid ${DEC_BORDER[d]}` : "2px solid transparent" }}>
              {d}
            </button>
          ))}
        </div>

        <button onClick={() => onDelete(model.id)}
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#f87171", marginTop:4 }}>
          🗑️ حذف الموديل
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [models, setModels] = useState([]);
  const [filter, setFilter] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const fetchModels = async () => {
    const { data, error } = await supabase.from("models").select("*").order("created_at");
    if (error) setError("فشل تحميل البيانات");
    else { setModels(data||[]); setError(null); }
    setLoading(false);
  };

  useEffect(() => {
    fetchModels();
    const channel = supabase.channel("models-changes")
      .on("postgres_changes", { event:"*", schema:"public", table:"models" }, fetchModels)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const addModel = async () => {
    setAdding(true);
    const { data, error } = await supabase.from("models").insert(emptyDraft()).select().single();
    if (!error) setModels(m => [...m, data]);
    setAdding(false);
  };

  const updateModel = async (id, fields) => {
    await supabase.from("models").update(fields).eq("id", id);
    setModels(m => m.map(mo => mo.id===id ? {...mo,...fields} : mo));
  };

  const deleteModel = async (id) => {
    await supabase.from("models").delete().eq("id", id);
    setModels(m => m.filter(mo => mo.id!==id));
  };

  const filtered = filter==="الكل" ? models : models.filter(m => m.decision===filter);
  const counts = { shortlist: models.filter(m=>m.decision==="✅ Shortlist").length, rejected: models.filter(m=>m.decision==="❌ مرفوض").length, pending: models.filter(m=>m.decision==="🤔 مش متأكد").length };

  const hdr = { position:"sticky", top:0, zIndex:10, background:"#1e3a5f", boxShadow:"0 2px 8px rgba(0,0,0,0.2)" };

  return (
    <div style={{ minHeight:"100vh", background:"#f0f4f8", direction:"rtl", fontFamily:"system-ui,sans-serif" }}>
      <div style={hdr}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ color:"#fff", fontWeight:"bold", fontSize:20, margin:0 }}>👗 موديلات ملابس الأطفال</h1>
            <p style={{ color:"#93c5fd", fontSize:12, margin:"4px 0 0" }}>مشترك — يتحدث تلقائياً ⚡</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {[["المجموع",models.length,"#2563eb"],["Shortlist",counts.shortlist,"#16a34a"],["مرفوض",counts.rejected,"#dc2626"],["معلق",counts.pending,"#ca8a04"]].map(([l,v,bg]) => (
              <div key={l} style={{ borderRadius:10, padding:"8px 12px", background:bg, textAlign:"center" }}>
                <div style={{ color:"#fff", fontWeight:"bold", fontSize:18 }}>{v}</div>
                <div style={{ color:"#fff", fontSize:11, opacity:0.85 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 16px 12px", display:"flex", gap:8, flexWrap:"wrap" }}>
          {["الكل","🤔 مش متأكد","✅ Shortlist","❌ مرفوض"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ borderRadius:20, padding:"4px 16px", fontSize:12, fontWeight:"bold", cursor:"pointer", border:"none",
                background: filter===f ? "#fff" : "rgba(255,255,255,0.15)", color: filter===f ? "#1e3a5f" : "#fff" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 16px" }}>
        {error && <div style={{ borderRadius:10, padding:"12px 16px", background:"#fee2e2", color:"#dc2626", marginBottom:16, textAlign:"center", fontWeight:"bold" }}>{error}</div>}
        {loading
          ? <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300, flexDirection:"column", color:"#6b7280" }}>
              <div style={{ fontSize:48 }}>⏳</div><div style={{ marginTop:8 }}>جاري التحميل...</div>
            </div>
          : <div style={{ display:"grid", gap:20, gridTemplateColumns:"repeat(auto-fill, minmax(290px,1fr))" }}>
              {filtered.map(m => <ModelCard key={m.id} model={m} onUpdate={updateModel} onDelete={deleteModel} />)}
              <button onClick={addModel} disabled={adding}
                style={{ borderRadius:16, border:"2px dashed #93c5fd", background:"#eff6ff", color:"#3b82f6", minHeight:220,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, cursor:"pointer", opacity: adding?0.6:1 }}>
                <span style={{ fontSize:40 }}>{adding?"⏳":"＋"}</span>
                <span style={{ fontWeight:"bold", fontSize:14 }}>{adding?"جاري الإضافة...":"إضافة موديل جديد"}</span>
              </button>
            </div>
        }
      </div>
    </div>
  );
}
