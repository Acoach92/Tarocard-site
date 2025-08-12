import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Mail, Store, Gift, Map as MapIcon, Phone,
  CheckCircle2, ArrowRight, Shield, Settings, Plus, Download
} from "lucide-react";

// === Config
const THEME = { primary: "#0b5d4a", onPrimary: "#ffffff", accent: "#f0b43c" };
const LOGO_URL = ""; // opzionale

// === Demo data
const STORES_DEMO = [
  { id: 1, name: "Bar Centrale", category: "Bar & Caffe", description: "Caffetteria storica in centro. Colazioni, pranzi veloci e aperitivi.", address: "Via Roma 12, Borgotaro", comune: "Borgotaro", position: { lat: 44.488, lon: 9.779 }, website: "https://example.com", telefono: "+39 0525 000000" },
  { id: 2, name: "Alimentari Rossi", category: "Alimentari", description: "Prodotti tipici della Valtaro: salumi, formaggi e confetture.", address: "Piazza Garibaldi 3, Borgotaro", comune: "Borgotaro", position: { lat: 44.49, lon: 9.783 }, website: "", telefono: "+39 0525 111111" },
  { id: 3, name: "Bottega Verde", category: "Abbigliamento", description: "Abbigliamento e accessori sostenibili.", address: "Corso XX Settembre 45, Borgotaro", comune: "Borgotaro", position: { lat: 44.4915, lon: 9.7775 }, website: "https://example.com", telefono: "+39 0525 222222" },
  { id: 4, name: "Panificio Bedoniese", category: "Panetteria", description: "Pane e focacce a lievitazione naturale.", address: "Via Trieste 8, Bedonia", comune: "Bedonia", position: { lat: 44.4987, lon: 9.6305 }, website: "", telefono: "+39 0525 333333" },
  { id: 5, name: "Trattoria La Quiete", category: "Ristorazione", description: "Cucina tipica con funghi e tartufi di stagione.", address: "Viale Rimembranze 2, Bedonia", comune: "Bedonia", position: { lat: 44.5012, lon: 9.6368 }, website: "https://example.com", telefono: "+39 0525 444444" },
  { id: 6, name: "Enoteca del Castello", category: "Enoteca", description: "Selezione di vini regionali e nazionali.", address: "Piazza del Castello, Compiano", comune: "Compiano", position: { lat: 44.5, lon: 9.7 }, website: "", telefono: "+39 0525 555555" },
  { id: 7, name: "Agriturismo Val di Taro", category: "Agriturismo", description: "Prodotti a km0 e ospitalita rurale.", address: "Strada Provinciale, Albareto", comune: "Albareto", position: { lat: 44.45, lon: 9.7 }, website: "https://example.com", telefono: "+39 0525 666666" }
];
const CATEGORIES = ["Tutte", ...Array.from(new Set(STORES_DEMO.map(s => s.category)))];

// === Utils
const classNames = (...a) => a.filter(Boolean).join(" ");
const resolveAsTag = (p) => p.as ?? p.As ?? "button";
const osmEmbedUrl = ({ lat, lon, zoom = 12 }) =>
  `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${lat},${lon}&zoom=${zoom}`;

// === UI helpers
function Section({ id, title, icon: Icon, children, className = "" }) {
  return (
    <section id={id} className={classNames("max-w-6xl mx-auto px-4 md:px-6 py-12", className)}>
      <div className="flex items-center gap-3 mb-6">
        {Icon && <Icon className="w-6 h-6" aria-hidden />}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}
function Pill({ children }) {
  return <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium">{children}</span>;
}
function Button(props) {
  const { children, onClick, href, target, type = "button", className = "", variant = "default" } = props;
  const As = resolveAsTag(props);
  const styles = variant === "primary" ? { backgroundColor: THEME.primary, color: THEME.onPrimary, borderColor: THEME.primary } : {};
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium shadow-sm border hover:shadow-md transition";
  if (As === "a") return <a href={href} target={target} className={classNames(base, className)} style={styles}>{children}</a>;
  return <button type={type} onClick={onClick} className={classNames(base, className)} style={styles}>{children}</button>;
}
function Logo({ className = "w-12 h-12 object-contain" }) {
  const [err, setErr] = useState(false);
  if (!LOGO_URL || err) return <Gift className={className.replace("object-contain", "")} />;
  return <img src={LOGO_URL} alt="Tarocard logo" className={className} onError={() => setErr(true)} />;
}

// === App
export default function TarocardSite() {
  const [route, setRoute] = useState("home");
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header onNav={setRoute} route={route} />
      {route === "home" && <Home onStart={() => setRoute("acquista")} />}
      {route === "mappa" && <Mappa />}
      {route === "acquista" && <Acquista />}
      {route === "aderisci" && <Aderisci />}
      {route === "contatti" && <Contatti />}
      {route === "regolamento" && <Regolamento />}
      {route === "privacy" && <Privacy />}
      {route === "termini" && <Termini />}
      {route === "admin" && <Admin />}
      <Footer onNav={setRoute} />
    </div>
  );
}

function Header({ onNav, route }) {
  const links = [
    { key: "home", label: "Cosa è Tarocard" },
    { key: "mappa", label: "Mappa negozi" },
    { key: "acquista", label: "Acquista" },
    { key: "aderisci", label: "Aderisci" },
    { key: "contatti", label: "Contatti" }
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="font-semibold text-xl">Tarocard</span>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          {links.map(l => (
            <Button key={l.key} onClick={() => onNav(l.key)} className="px-3 py-1.5 text-sm" variant={route === l.key ? "primary" : "default"}>{l.label}</Button>
          ))}
          <Button onClick={() => onNav("admin")} className="px-3 py-1.5 text-sm"><Shield className="w-4 h-4 mr-1" /> Area riservata</Button>
        </nav>
        <div className="md:hidden">
          <select value={route} onChange={(e) => onNav(e.target.value)} className="border rounded-xl px-3 py-2">
            {[...links, { key: "regolamento", label: "Regolamento" }, { key: "privacy", label: "Privacy" }, { key: "termini", label: "Termini" }, { key: "admin", label: "Area riservata" }].map(l => (
              <option key={l.key} value={l.key}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

function Home({ onStart }) {
  return (
    <>
      <section className="border-b" style={{ background: `linear-gradient(180deg, ${THEME.primary}10, #ffffff)` }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">La gift card che sostiene <span className="underline" style={{ textDecorationColor: THEME.accent }}>Valtaro e Valceno</span></h1>
            <p className="mt-4 text-lg text-neutral-700">Tarocard e la carta regalo spendibile nei negozi convenzionati del territorio. Tagli da 15€, 25€ e 50€.</p>
            <div className="mt-6 flex gap-3">
              <Button onClick={onStart} variant="primary">Acquista ora <ArrowRight className="w-4 h-4 ml-2" /></Button>
              <Button onClick={() => document.getElementById("come-funziona")?.scrollIntoView({ behavior: "smooth" })}>Come funziona</Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Pill>Valida 12 mesi</Pill>
              <Pill>Nessun resto in contanti</Pill>
              <Pill>Acquisti in valle</Pill>
            </div>
          </div>
          <div className="bg-white rounded-3xl border shadow-sm p-6">
            <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1200&auto=format&fit=crop" alt="Gift card" className="rounded-2xl w-full object-cover" />
          </div>
        </div>
      </section>

      <Section id="come-funziona" title="Come funziona" icon={CheckCircle2}>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Acquista la card", text: "Scegli 15€, 25€ o 50€." },
            { title: "Usala nei negozi", text: "Paghi in un'unica soluzione o più acquisti fino a esaurimento." },
            { title: "Sostieni il territorio", text: "Acquisti in valle e sostieni l'economia locale." }
          ].map((b, i) => (
            <div key={i} className="rounded-3xl border p-6 shadow-sm">
              <h3 className="font-semibold text-lg">{b.title}</h3>
              <p className="text-neutral-600 mt-2">{b.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

// Leaflet loader & map
function useLeafletCDN() {
  const [state, setState] = useState({ loaded: false, error: false });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.L) { setState({ loaded: true, error: false }); return; }
    const script = document.getElementById("leaflet-script");
    script?.addEventListener("load", () => setState({ loaded: true, error: false }));
    script?.addEventListener("error", () => setState({ loaded: false, error: true }));
  }, []);
  return state;
}
function LeafletMap({ stores, selected, onSelect, center }) {
  const { loaded, error } = useLeafletCDN();
  const mapRef = useRef(null); const mapInstance = useRef(null); const markersLayer = useRef(null);
  useEffect(() => {
    if (!loaded || error || !mapRef.current || mapInstance.current === null && typeof window === "undefined") return;
    if (!loaded || error || !mapRef.current || mapInstance.current) return;
    const L = window.L; mapInstance.current = L.map(mapRef.current).setView(center, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(mapInstance.current);
  }, [loaded, error, center]);
  useEffect(() => { if (!mapInstance.current || !selected) return; mapInstance.current.setView([selected.position.lat, selected.position.lon], 14, { animate: true }); }, [selected]);
  useEffect(() => {
    if (!mapInstance.current || !loaded || error) return;
    const L = window.L; if (markersLayer.current) markersLayer.current.remove(); markersLayer.current = L.layerGroup().addTo(mapInstance.current);
    stores.forEach((s) => {
      const m = L.marker([s.position.lat, s.position.lon]).addTo(markersLayer.current);
      const html = `<div class="space-y-1"><div class="font-semibold">${s.name}</div><div class="text-sm text-neutral-600">${s.category} · ${s.comune}</div><div class="text-sm">${s.address}</div>${s.description?`<p class=\\"text-sm mt-1\\">${s.description}</p>`:""}${s.website?`<a class=\\"text-sm underline\\" href=\\"${s.website}\\" target=\\"_blank\\" rel=\\"noreferrer\\">Sito web</a>`:""}</div>`;
      m.bindPopup(html); m.on("click", () => onSelect(s));
    });
  }, [stores, loaded, error, onSelect]);
  if (error) return <iframe title="Mappa Tarocard fallback" src={osmEmbedUrl({ lat: center[0], lon: center[1], zoom: 12 })} className="w-full h-full" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />;
  return <div ref={mapRef} className="w-full h-full" />;
}
function Mappa() {
  const [category, setCategory] = useState("Tutte");
  const [selected, setSelected] = useState(STORES_DEMO[0]);
  const filtered = useMemo(() => (category === "Tutte" ? STORES_DEMO : STORES_DEMO.filter(s => s.category === category)), [category]);
  const center = useMemo(() => { const list = filtered.length ? filtered : STORES_DEMO; const lat = list.reduce((a,s)=>a+s.position.lat,0)/list.length; const lon = list.reduce((a,s)=>a+s.position.lon,0)/list.length; return [lat, lon]; }, [filtered]);
  return (
    <Section id="mappa" title="Mappa dei negozi convenzionati" icon={MapIcon}>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm">Categoria:</label>
        <select className="border rounded-xl px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 max-h-[480px] overflow-auto rounded-2xl border">
          {filtered.map(store => (
            <button key={store.id} onClick={() => setSelected(store)} className={classNames("w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-neutral-50", selected?.id === store.id ? "bg-neutral-50" : "")}>
              <div className="font-semibold">{store.name}</div>
              <div className="text-sm text-neutral-600">{store.category} · {store.comune}</div>
              <div className="text-xs text-neutral-600">{store.address}</div>
            </button>
          ))}
        </div>
        <div className="md:col-span-2 h-[480px] rounded-3xl overflow-hidden border">
          <LeafletMap stores={filtered} selected={selected} onSelect={setSelected} center={center} />
        </div>
      </div>
    </Section>
  );
}

function Acquista() {
  return (
    <Section id="acquista" title="Acquista la Tarocard" icon={Gift}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-neutral-700"><strong>Opzione B consigliata</strong>: Stripe Checkout con webhook per generare codice QR al pagamento riuscito e pannello esercenti per scalare il credito.</p>
          <ol className="list-decimal pl-5 space-y-2 text-neutral-800">
            <li><strong>Pagamenti</strong>: 3 prodotti (15€, 25€, 50€). Checkout con success_url e cancel_url.</li>
            <li><strong>Webhook</strong>: /api/webhooks/stripe su checkout.session.completed → genera voucher.</li>
            <li><strong>DB</strong>: vouchers(code, amount, amountRemaining, status, expiresAt, buyerEmail).</li>
            <li><strong>Consegna</strong>: email con PDF/QR + pagina /voucher/[code].</li>
            <li><strong>Verifica negozio</strong>: pagina protetta /esercente per validare e scalare.</li>
            <li><strong>Rendicontazione</strong>: export CSV mensile.</li>
          </ol>
          <div className="grid sm:grid-cols-3 gap-3">
            {[15, 25, 50].map(val => (
              <div key={val} className="rounded-2xl border p-4">
                <div className="text-sm text-neutral-500">Taglio</div>
                <div className="text-2xl font-bold">{val}€</div>
                <Button as="a" href="#" className="mt-3 w-full" variant="primary">Paga demo</Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-neutral-500">Collega i pulsanti a Stripe quando l'account sarà attivo.</p>
        </div>
        <div className="rounded-3xl border p-6">
          <h3 className="font-semibold text-lg mb-2">Checklist tecnica minima</h3>
          <ul className="list-disc pl-5 space-y-2 text-neutral-800">
            <li>Stripe Checkout + webhook firmato</li>
            <li>Generazione codici/QR</li>
            <li>Email di consegna</li>
            <li>Stati voucher (attivo/scalato/scaduto)</li>
            <li>Portale esercenti</li>
            <li>Privacy / Termini / Cookie banner</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Contatti() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const onSubmit = (data) => { console.log("Richiesta contatti", data); alert("Richiesta inviata. Ti risponderemo presto."); reset(); };
  return (
    <Section id="contatti" title="Contatti" icon={Mail}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">Nome</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("nome", { required: true })} />{errors.nome && <p className="text-sm text-red-600 mt-1">Campo obbligatorio</p>}</div>
          <div><label className="text-sm">Email</label><input type="email" className="mt-1 w-full border rounded-xl px-3 py-2" {...register("email", { required: true })} />{errors.email && <p className="text-sm text-red-600 mt-1">Campo obbligatorio</p>}</div>
        </div>
        <div><label className="text-sm">Messaggio</label><textarea rows={5} className="mt-1 w-full border rounded-xl px-3 py-2" {...register("messaggio", { required: true })} />{errors.messaggio && <p className="text-sm text-red-600 mt-1">Campo obbligatorio</p>}</div>
        <Button type="submit" className="w-fit" variant="primary">Invia</Button>
      </form>
    </Section>
  );
}

function Aderisci() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const onSubmit = (data) => { console.log("Nuova richiesta adesione", data); alert("Richiesta inviata."); reset(); };
  return (
    <Section id="aderisci" title="Aderisci al circuito Tarocard" icon={Store}>
      <p className="text-neutral-700 mb-6">Compila il modulo: riceverai via email la convenzione da firmare e le istruzioni operative.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">Ragione sociale</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("ragione_sociale", { required: true })} />{errors.ragione_sociale && <p className="text-sm text-red-600 mt-1">Obbligatorio</p>}</div>
          <div><label className="text-sm">P.IVA</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("piva", { required: true })} />{errors.piva && <p className="text-sm text-red-600 mt-1">Obbligatorio</p>}</div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">Indirizzo</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("indirizzo", { required: true })} /></div>
          <div><label className="text-sm">Comune</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("comune", { required: true })} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">Categoria</label><select className="mt-1 w-full border rounded-xl px-3 py-2" {...register("categoria", { required: true })}><option>Bar & Caffe</option><option>Alimentari</option><option>Ristorazione</option><option>Abbigliamento</option><option>Servizi</option><option>Altro</option></select></div>
          <div><label className="text-sm">Telefono</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("telefono")} /></div>
        </div>
        <div><label className="text-sm">Descrizione breve</label><textarea rows={4} className="mt-1 w-full border rounded-xl px-3 py-2" {...register("descrizione", { required: true })} /></div>
        <div><label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" {...register("privacy", { required: true })} />Accetto l'informativa privacy</label>{errors.privacy && <p className="text-sm text-red-600 mt-1">Necessario</p>}</div>
        <Button type="submit" className="w-fit" variant="primary">Invia richiesta</Button>
      </form>
    </Section>
  );
}

// Legal
function Regolamento() { /* … (come in canvas) … */ return (
  <Section id="regolamento" title="Regolamento d'uso" icon={Gift}>
    <div className="prose max-w-none">
      <h3>1. Definizioni</h3>
      <p>Tarocard: carta regalo prepagata emessa da IAT Valtaro e Valceno. Esercizi convenzionati: attività aderenti al circuito.</p>
      <h3>2. Oggetto</h3><p>Disciplina acquisto e utilizzo.</p>
      <h3>3. Tagli e attivazione</h3><p>15€, 25€, 50€.</p>
      <h3>4. Validità</h3><p>12 mesi dall’attivazione.</p>
      <h3>5. Uso</h3><ul><li>Una o più transazioni</li><li>Nessun resto</li></ul>
      <h3>6. Rimborsi</h3><p>Non rimborsabile dopo l’acquisto.</p>
      <h3>7-13</h3><p>Come definito in bozze precedenti.</p>
    </div>
  </Section>
); }
function Privacy() { return (<Section id="privacy" title="Privacy e Cookie" icon={Mail}><p className="text-sm">Sintesi policy come da bozze.</p></Section>); }
function Termini() { return (<Section id="termini" title="Termini del servizio" icon={CheckCircle2}><p className="text-sm">Sintesi termini come da bozze.</p></Section>); }

// Admin (demo)
function Admin() {
  const [tab, setTab] = useState("negozi");
  return (
    <Section id="admin" title="Area riservata" icon={Settings}>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setTab("negozi")} variant={tab==="negozi"?"primary":"default"}>Negozi</Button>
        <Button onClick={() => setTab("ordini")} variant={tab==="ordini"?"primary":"default"}>Ordini</Button>
        <Button onClick={() => setTab("email")} variant={tab==="email"?"primary":"default"}>Impostazioni email</Button>
      </div>
      {tab==="negozi" && <AdminShops />}
      {tab==="ordini" && <AdminOrders />}
      {tab==="email" && <AdminEmail />}
    </Section>
  );
}
const csvEscape = (s)=>`"${String(s??"").replaceAll('"','""')}"`;
const csvFromRows = (rows)=>{
  const header = ["name","category","address","comune","lat","lon","website","telefono","description"];
  const body = rows.map(r => [r.name,r.category,r.address,r.comune,r.position.lat,r.position.lon,r.website,r.telefono||"",r.description||""].map(csvEscape).join(","));
  return [header.join(","), ...body].join("\n");
};
function AdminShops(){
  const [rows,setRows]=useState(STORES_DEMO);
  const [form,setForm]=useState({ name:"", category:"", comune:"", address:"", lat:"", lon:"", website:"", description:"" });
  function addRow(){
    const id=Math.max(...rows.map(r=>r.id))+1;
    const n={ id, name:form.name, category:form.category||"Altro", comune:form.comune||"", address:form.address||"", position:{lat:parseFloat(form.lat)||0, lon:parseFloat(form.lon)||0}, website:form.website||"", description:form.description||"", telefono:"" };
    setRows([...rows,n]); setForm({ name:"", category:"", comune:"", address:"", lat:"", lon:"", website:"", description:"" });
  }
  function exportCSV(){
    const csv = csvFromRows(rows);
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "tarocard_negozi.csv"; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-3">
        {["name","category","comune","address","lat","lon","website"].map(k=>(
          <input key={k} placeholder={k} className="border rounded-xl px-3 py-2" value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}/>
        ))}
        <textarea placeholder="description" className="md:col-span-4 border rounded-xl px-3 py-2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <Button onClick={addRow} variant="primary"><Plus className="w-4 h-4 mr-1" />Aggiungi</Button>
        <Button onClick={exportCSV}><Download className="w-4 h-4 mr-1" />Esporta CSV</Button>
      </div>
      <div className="overflow-auto border rounded-2xl">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50"><tr><th className="text-left p-2">Nome</th><th className="text-left p-2">Categoria</th><th className="text-left p-2">Comune</th><th className="text-left p-2">Indirizzo</th><th className="text-left p-2">Lat</th><th className="text-left p-2">Lon</th><th className="text-left p-2">Website</th></tr></thead>
          <tbody>{rows.map(r=>(<tr key={r.id} className="border-t"><td className="p-2">{r.name}</td><td className="p-2">{r.category}</td><td className="p-2">{r.comune}</td><td className="p-2">{r.address}</td><td className="p-2">{r.position.lat}</td><td className="p-2">{r.position.lon}</td><td className="p-2"><a className="underline" href={r.website} target="_blank" rel="noreferrer">{r.website}</a></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
function AdminOrders(){ return (<div className="text-sm text-neutral-700">Ordini (demo). Collegamento Stripe in futuro.</div>); }
function AdminEmail(){
  const { register, handleSubmit } = useForm();
  const onSubmit = (data)=>{ console.log("Impostazioni email", data); alert("Salvato (demo)"); };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-3 max-w-3xl">
      <div><label className="text-sm">Mittente (nome)</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("from_name")} /></div>
      <div><label className="text-sm">Mittente (email)</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("from_email")} /></div>
      <div><label className="text-sm">SMTP Host</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("smtp_host")} /></div>
      <div><label className="text-sm">SMTP User</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("smtp_user")} /></div>
      <div><label className="text-sm">SMTP Password</label><input type="password" className="mt-1 w-full border rounded-xl px-3 py-2" {...register("smtp_pass")} /></div>
      <div><label className="text-sm">SMTP Port</label><input className="mt-1 w-full border rounded-xl px-3 py-2" {...register("smtp_port")} defaultValue={587} /></div>
      <Button type="submit" className="w-fit" variant="primary">Salva</Button>
      <p className="text-xs text-neutral-500 md:col-span-2">Demo: non invia email reali.</p>
    </form>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="border-t mt-12" style={{ backgroundColor: `#00000008` }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="flex items-center gap-3 font-semibold mb-2"><Gift className="w-10 h-10" /> <span>Tarocard</span></div>
          <p className="text-sm text-neutral-600">Gift card locale per sostenere i negozi del territorio.</p>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">Documenti</div>
          <ul className="space-y-1">
            <li><button className="underline" onClick={() => onNav("regolamento")}>Regolamento d'uso</button></li>
            <li><button className="underline" onClick={() => onNav("privacy")}>Privacy e Cookie</button></li>
            <li><button className="underline" onClick={() => onNav("termini")}>Termini del servizio</button></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-2">Contatti</div>
          <p>IAT Valtaro e Valceno</p>
          <p><Phone className="inline w-4 h-4" /> +39 000 000 000</p>
          <p><Mail className="inline w-4 h-4" /> info@tarocard.it</p>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-500 py-4">© {new Date().getFullYear()} Tarocard</div>
    </footer>
  );
}

