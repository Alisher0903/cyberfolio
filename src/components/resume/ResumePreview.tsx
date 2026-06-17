"use client";
import { ResumeData, themeColors } from "@/store/resumeStore";

interface Props {
  data: ResumeData;
  scale?: number;
  forExport?: boolean;
}

export default function ResumePreview({ data, scale = 1, forExport = false }: Props) {
  const theme  = themeColors[data.colorTheme];
  const isMin  = data.layoutStyle === "minimal";
  const isTerm = data.layoutStyle === "terminal";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section style={{ marginBottom: "1.5rem" }}>
      {isTerm ? (
        <h2 style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.7rem",
          color: theme.primary, marginBottom:"0.5rem", letterSpacing:"0.12em", textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <span style={{ opacity:0.4 }}>//</span> {title}
        </h2>
      ) : (
        <h2 style={{ fontFamily: isMin?"'DM Sans',sans-serif":"'Syne',sans-serif",
          fontSize: isMin ? "0.6rem" : "0.65rem", fontWeight: 700,
          color: isMin ? "#888" : theme.primary,
          textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"0.5rem",
          paddingBottom: isMin ? "0" : "0.3rem",
          borderBottom: isMin ? "none" : `1px solid ${theme.primary}30`,
        }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );

  const containerStyle: React.CSSProperties = {
    width:   "210mm",
    minHeight: "297mm",
    backgroundColor: isTerm ? "#050A0E" : "#FFFFFF",
    color:    isTerm ? "#E8F4FD" : "#1a1a1a",
    fontFamily: isTerm ? "'JetBrains Mono',monospace" : "'DM Sans',sans-serif",
    fontSize: "10px",
    lineHeight: 1.5,
    padding: "16mm 14mm",
    transformOrigin: "top left",
    transform: forExport ? "none" : `scale(${scale})`,
    boxShadow: forExport ? "none" : "0 20px 60px rgba(0,0,0,0.5)",
    border: forExport ? "none" : `1px solid ${isTerm ? "#0E2030" : "#e5e7eb"}`,
    position: "relative",
  };

  const highlights = (str: string) =>
    str.split(";").filter(Boolean).map((h, i) => (
      <li key={i} style={{ color: isTerm ? "#7FA8C4" : "#555", marginBottom:"0.15rem" }}>
        {isTerm ? <span style={{color:theme.primary,marginRight:"0.4rem"}}>›</span> : "· "}
        {h.trim()}
      </li>
    ));

  return (
    <div id="resume-preview" style={containerStyle}>
      {/* ── Decorative accent bar (modern only) */}
      {!isMin && !isTerm && (
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px",
          background:`linear-gradient(90deg,${theme.primary},${theme.dim})` }} />
      )}

      {/* ── HEADER ──────────────────────────── */}
      <header style={{ marginBottom:"1.5rem",
        ...(isMin
          ? { borderBottom:"2px solid #1a1a1a", paddingBottom:"1rem" }
          : isTerm
          ? { borderBottom:`1px solid ${theme.primary}30`, paddingBottom:"1rem" }
          : {}) }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.5rem" }}>
          <div>
            <h1 style={{
              fontFamily: isTerm ? "'JetBrains Mono',monospace" : "'Syne',sans-serif",
              fontSize: "1.8rem", fontWeight: 800, lineHeight:1,
              color: isTerm ? "#E8F4FD" : isMin ? "#111" : "#111",
              marginBottom:"0.3rem",
            }}>
              {isTerm && <span style={{color:theme.primary}}>$ </span>}
              {data.name || "Your Name"}
            </h1>
            <p style={{ fontSize:"0.75rem", fontWeight: 600,
              color: isTerm ? theme.primary : isMin ? "#666" : theme.primary,
              fontFamily: isTerm?"'JetBrains Mono',monospace":undefined,
              letterSpacing: isTerm?"0.05em":undefined }}>
              {data.title}
            </p>
          </div>

          {/* Contact block */}
          <div style={{ fontSize:"0.62rem", textAlign:"right", lineHeight:1.8,
            color: isTerm ? "#7FA8C4" : "#555",
            fontFamily: isTerm?"'JetBrains Mono',monospace":undefined }}>
            {data.email    && <div>{isTerm&&<span style={{color:theme.dim}}>email: </span>}{data.email}</div>}
            {data.phone    && <div>{isTerm&&<span style={{color:theme.dim}}>tel:   </span>}{data.phone}</div>}
            {data.location && <div>{isTerm&&<span style={{color:theme.dim}}>loc:   </span>}{data.location}</div>}
            {data.website  && <div style={{color:theme.primary}}>{data.website}</div>}
            {data.github   && <div style={{color:theme.primary}}>{data.github}</div>}
          </div>
        </div>

        {data.summary && (
          <p style={{ marginTop:"0.8rem", fontSize:"0.68rem", lineHeight:1.7,
            color: isTerm ? "#7FA8C4" : "#444",
            fontStyle: isMin ? "italic" : "normal" }}>
            {isTerm && <span style={{color:theme.primary}}>// </span>}
            {data.summary}
          </p>
        )}
      </header>

      {/* ── TWO-COLUMN BODY ─────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns: isMin?"1fr":"2fr 1fr", gap:"1.5rem" }}>

        {/* Main column */}
        <div>
          {/* Work Experience */}
          {data.work.length > 0 && (
            <Section title="Experience">
              {data.work.map((w) => (
                <div key={w.id} style={{ marginBottom:"1rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", flexWrap:"wrap" }}>
                    <strong style={{ fontSize:"0.72rem", fontWeight:700,
                      color: isTerm ? "#E8F4FD" : "#111",
                      fontFamily: isTerm?"'JetBrains Mono',monospace":undefined }}>
                      {w.role || "Role"}
                    </strong>
                    <span style={{ fontSize:"0.6rem", color: isTerm?"#3A5568":"#888",
                      fontFamily:"'JetBrains Mono',monospace" }}>{w.period}</span>
                  </div>
                  <div style={{ fontSize:"0.65rem", fontWeight:600, marginBottom:"0.2rem",
                    color: theme.primary }}>{w.company || "Company"}</div>
                  {w.description && (
                    <p style={{ fontSize:"0.63rem", color: isTerm?"#7FA8C4":"#555", marginBottom:"0.3rem" }}>
                      {w.description}
                    </p>
                  )}
                  {w.highlights && (
                    <ul style={{ paddingLeft:"0.5rem", margin:0, listStyle:"none", fontSize:"0.62rem" }}>
                      {highlights(w.highlights)}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <Section title="Projects">
              {data.projects.map((p) => (
                <div key={p.id} style={{ marginBottom:"0.8rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", flexWrap:"wrap" }}>
                    <strong style={{ fontSize:"0.7rem", color: isTerm?"#E8F4FD":"#111" }}>
                      {p.name || "Project"}
                    </strong>
                    {p.link && <span style={{ fontSize:"0.58rem", color:theme.primary,
                      fontFamily:"'JetBrains Mono',monospace" }}>{p.link}</span>}
                  </div>
                  {p.tech && (
                    <div style={{ fontSize:"0.6rem", color:theme.primary, marginBottom:"0.2rem",
                      fontFamily:"'JetBrains Mono',monospace" }}>
                      {isTerm ? p.tech : `[${p.tech}]`}
                    </div>
                  )}
                  {p.description && (
                    <p style={{ fontSize:"0.62rem", color: isTerm?"#7FA8C4":"#555" }}>{p.description}</p>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Side column */}
        <div>
          {/* Skills */}
          {data.skillGroups.length > 0 && (
            <Section title="Skills">
              {data.skillGroups.map((sg) => (
                <div key={sg.id} style={{ marginBottom:"0.7rem" }}>
                  {sg.category && (
                    <div style={{ fontSize:"0.62rem", fontWeight:700, marginBottom:"0.2rem",
                      color: isTerm?"#7FA8C4":theme.primary }}>
                      {sg.category}
                    </div>
                  )}
                  <div style={{ fontSize:"0.62rem", color: isTerm?"#7FA8C4":"#555",
                    lineHeight:1.6, fontFamily: isTerm?"'JetBrains Mono',monospace":undefined }}>
                    {sg.skills.split(",").filter(Boolean).map((sk,i) => (
                      <span key={i}>
                        {isTerm
                          ? <span><span style={{color:theme.primary,marginRight:"0.2rem"}}>›</span>{sk.trim()} </span>
                          : <span style={{ display:"inline-block", marginRight:"0.4rem",
                            background:theme.bg, borderRadius:"2px", padding:"1px 4px",
                            marginBottom:"2px" }}>{sk.trim()}</span>
                        }
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <Section title="Education">
              {data.education.map((e) => (
                <div key={e.id} style={{ marginBottom:"0.8rem" }}>
                  <strong style={{ fontSize:"0.68rem", color: isTerm?"#E8F4FD":"#111",
                    fontFamily: isTerm?"'JetBrains Mono',monospace":undefined }}>
                    {e.degree || "Degree"}
                  </strong>
                  <div style={{ fontSize:"0.63rem", color:theme.primary }}>{e.school}</div>
                  <div style={{ fontSize:"0.6rem", color: isTerm?"#3A5568":"#888",
                    fontFamily:"'JetBrains Mono',monospace" }}>
                    {e.year}{e.gpa?` · GPA ${e.gpa}`:""}
                  </div>
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>

      {/* Terminal footer */}
      {isTerm && (
        <div style={{ position:"absolute", bottom:"8mm", left:"14mm", right:"14mm",
          borderTop:`1px solid #0E2030`, paddingTop:"0.5rem",
          display:"flex", justifyContent:"space-between",
          fontFamily:"'JetBrains Mono',monospace", fontSize:"0.55rem", color:"#3A5568" }}>
          <span>{data.name.toLowerCase().replace(" ","_")}.pdf</span>
          <span style={{color:theme.primary}}>● ready</span>
        </div>
      )}
    </div>
  );
}
