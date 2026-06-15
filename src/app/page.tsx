"use client";
import { useState, useRef } from "react";
import {
  Cpu, Search, TrendingUp, BarChart2, Map, FlaskConical,
  FileText, ChevronRight, Upload, Zap, Info, Play,
  ArrowRight, Target, Users, DollarSign, AlertTriangle,
  CheckCircle, BookOpen, Beaker
} from "lucide-react";
import { PRESETS, type AnalysisResult, type Preset, type Feature, type PainPoint, type Opportunity, type KPI, type Experiment, type RoadmapQuarter } from "@/lib/types";

// ─── Badges ───────────────────────────────────────────────────────────────────

function PriorityBadge({ p }: { p: string }) {
  const map: Record<string, string> = { P0: "priority-p0", P1: "priority-p1", P2: "priority-p2", P3: "priority-p3" };
  return <span className={`text-xs px-2 py-0.5 rounded font-bold mono ${map[p] ?? "priority-p3"}`}>{p}</span>;
}

function FreqBadge({ f }: { f: string }) {
  const map: Record<string, string> = {
    CRITICAL: "priority-p0", HIGH: "priority-p1", MEDIUM: "priority-p2", LOW: "priority-p3",
  };
  return <span className={`text-xs px-2 py-0.5 rounded font-semibold ${map[f] ?? "priority-p3"}`}>{f}</span>;
}

function ImpactBadge({ impact }: { impact: string }) {
  const map: Record<string, string> = { high: "impact-high", medium: "impact-medium", low: "impact-low" };
  return <span className={`text-xs px-2 py-0.5 rounded font-semibold capitalize ${map[impact.toLowerCase()] ?? "impact-medium"}`}>{impact}</span>;
}

function KPITypeBadge({ t }: { t: string }) {
  const colors: Record<string, string> = {
    north_star: "var(--accent)", adoption: "var(--blue)", retention: "var(--green)",
    revenue: "var(--amber)", engagement: "var(--purple)",
  };
  const c = colors[t] ?? "var(--text-secondary)";
  return (
    <span className="text-xs px-2 py-0.5 rounded font-semibold capitalize mono"
      style={{ background: `${c}18`, color: c, border: `1px solid ${c}35` }}>
      {t.replace("_", " ")}
    </span>
  );
}

// ─── Agent trace ──────────────────────────────────────────────────────────────

function AgentTrace({ steps }: { steps: AnalysisResult["steps"] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mono ${
              step.status === "done" ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400" :
              step.status === "running" ? "border text-blue-400" : "bg-red-500/15 border border-red-500/40 text-red-400"
            }`} style={step.status === "running" ? { background: "var(--accent-glow)", borderColor: "var(--accent-dim)", color: "var(--accent)" } : {}}>
              {step.status === "done" ? "✓" : step.status === "running" ? "⟳" : "✗"}
            </div>
            {i < steps.length - 1 && <div className="w-px flex-1 my-1" style={{ background: "var(--border)" }} />}
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{step.agent}</span>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-surface)", color: "var(--text-secondary)" }}>{step.role}</span>
              {step.durationMs && <span className="text-xs mono ml-auto" style={{ color: "var(--text-muted)" }}>{step.durationMs}ms</span>}
            </div>
            {step.output && (
              <div className="text-xs rounded px-2 py-1.5 leading-relaxed"
                style={{ background: "var(--accent-glow)", color: "var(--text-secondary)", border: "1px solid var(--accent-dim)" }}>
                {step.output}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="card p-5 space-y-3">
        <div className="h-4 rounded w-1/4" style={{ background: "var(--bg-surface)" }} />
        <div className="h-20 rounded" style={{ background: "var(--bg-surface)" }} />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded" style={{ background: "var(--bg-surface)" }} />)}
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card p-4 space-y-2">
          <div className="h-4 rounded w-1/3" style={{ background: "var(--bg-surface)" }} />
          <div className="h-16 rounded" style={{ background: "var(--bg-surface)" }} />
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onPreset }: { onPreset: (p: Preset) => void }) {
  const tagColors: Record<string, string> = {
    "Retention play": "#f87171",
    "Growth play": "#4ade80",
    "Prioritization challenge": "var(--accent)",
  };
  return (
    <div className="fade-in space-y-6">
      <div className="text-center py-10 space-y-4">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}>
          <Cpu size={28} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>AI Operating System for Product Teams</h3>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Paste customer interviews, support tickets, NPS data, or feature requests. Six specialized agents transform raw signal into a prioritized roadmap, PRD, and product strategy.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs" style={{ color: "var(--text-muted)" }}>
          {["Research", "Opportunity", "Prioritization", "Strategy", "PRD", "Experiment"].map((a, i, arr) => (
            <span key={a} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight size={10} />}
              <span>{a}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Choose a scenario</p>
        {PRESETS.map(p => (
          <button key={p.id} onClick={() => onPreset(p)}
            className="w-full text-left p-4 rounded-xl transition-all group"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${tagColors[p.tag] ?? "var(--accent)"}18`, color: tagColors[p.tag] ?? "var(--accent)", border: `1px solid ${tagColors[p.tag] ?? "var(--accent)"}35` }}>
                  {p.tag}
                </span>
              </div>
              <Play size={13} className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--accent)" }} />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.narrative}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Product Brief dashboard ──────────────────────────────────────────────────

function ProductBriefDashboard({ result }: { result: AnalysisResult }) {
  const { brief, steps } = result;
  const [tab, setTab] = useState<"brief"|"rice"|"roadmap"|"kpis"|"prd"|"experiments"|"trace">("brief");

  if (!brief) return null;

  const tabs = [
    { id: "brief",       label: "Product Brief",    icon: <FileText size={12}/> },
    { id: "rice",        label: `RICE Board (${brief.features.length})`, icon: <BarChart2 size={12}/> },
    { id: "roadmap",     label: "Roadmap",           icon: <Map size={12}/> },
    { id: "kpis",        label: "KPI Center",        icon: <Target size={12}/> },
    { id: "prd",         label: "PRD",               icon: <BookOpen size={12}/> },
    { id: "experiments", label: "Experiments",       icon: <Beaker size={12}/> },
    { id: "trace",       label: "Agent Trace",       icon: <Cpu size={12}/> },
  ] as const;

  return (
    <div className="space-y-4 fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Pain Points", value: brief.topPainPoints.length, color: "var(--red)", icon: <AlertTriangle size={13}/> },
          { label: "Opportunities", value: brief.opportunities.length, color: "var(--green)", icon: <TrendingUp size={13}/> },
          { label: "Features Scored", value: brief.features.length, color: "var(--accent)", icon: <BarChart2 size={13}/> },
          { label: "Words Processed", value: brief.inputWordCount.toLocaleString(), color: "var(--purple)", icon: <Search size={13}/> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="card p-3 text-center">
            <div className="flex justify-center mb-1" style={{ color }}>{icon}</div>
            <div className="text-lg font-bold mono" style={{ color: "var(--text-primary)" }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-0.5 p-1 rounded-lg overflow-x-auto" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1 py-1.5 px-2.5 rounded text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
            style={{ background: tab === t.id ? "var(--bg-surface)" : "transparent", color: tab === t.id ? "var(--text-primary)" : "var(--text-muted)" }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Product Brief ── */}
      {tab === "brief" && (
        <div className="space-y-4 fade-in">
          {/* Top insight */}
          <div className="p-5 rounded-xl" style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: "var(--accent)" }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Top Product Insight</span>
            </div>
            <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>{brief.executiveSummary}</p>
          </div>

          {/* Pain points + Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} style={{ color: "var(--red)" }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Top Pain Points</span>
              </div>
              <div className="space-y-3">
                {brief.topPainPoints.map((p: PainPoint, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FreqBadge f={p.frequency} />
                      <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{p.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.evidence}</p>
                    <div className="flex items-center gap-3">
                      {p.revenueRisk && (
                        <p className="text-xs font-semibold" style={{ color: "var(--red)" }}>Risk: {p.revenueRisk}</p>
                      )}
                      {p.sourceCount !== undefined && p.sourceCount > 0 && (
                        <p className="text-xs mono" style={{ color: "var(--text-muted)" }}>{p.sourceCount} sources</p>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Segment: {p.affectedSegment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: "var(--green)" }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Opportunities</span>
              </div>
              <div className="space-y-3">
                {brief.opportunities.map((o: Opportunity, i: number) => {
                  const conf = o.confidence > 1 ? o.confidence : Math.round(o.confidence * 100);
                  return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded font-semibold capitalize"
                        style={{ background: "rgba(74,222,128,0.12)", color: "var(--green)", border: "1px solid rgba(74,222,128,0.25)" }}>
                        {o.type}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{o.title}</span>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "var(--green)" }}>{o.revenueImpact}</p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{o.rationale}</p>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-1 rounded-full" style={{ background: "var(--bg-surface)" }}>
                        <div className="h-1 rounded-full" style={{ width: `${conf}%`, background: "var(--green)" }} />
                      </div>
                      <span className="text-xs mono" style={{ color: "var(--text-muted)" }}>{conf}%</span>
                    </div>
                  </div>
                );})}
              </div>
            </div>
          </div>

          {/* Strategic memo preview */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} style={{ color: "var(--accent)" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Strategic Memo</span>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)", fontFamily: "Georgia, serif", lineHeight: 1.85 }}>
              {brief.strategicMemo}
            </div>
          </div>
        </div>
      )}

      {/* ── RICE Board ── */}
      {tab === "rice" && (
        <div className="space-y-2 fade-in">
          <div className="card p-3 grid grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            <div className="col-span-2">Feature</div>
            <div className="text-center">Reach</div>
            <div className="text-center">Impact</div>
            <div className="text-center">Conf.</div>
            <div className="text-center">Effort</div>
            <div className="text-center">RICE</div>
          </div>
          {brief.features.map((f: Feature, i: number) => (
            <div key={i} className="card p-3">
              <div className="grid grid-cols-7 gap-2 items-center mb-2">
                <div className="col-span-2 flex items-center gap-2">
                  <PriorityBadge p={f.priority} />
                  <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{f.name}</span>
                </div>
                <div className="text-center text-xs mono" style={{ color: "var(--text-primary)" }}>{f.reach}%</div>
                <div className="text-center text-xs mono" style={{ color: "var(--text-primary)" }}>{f.impact}x</div>
                <div className="text-center text-xs mono" style={{ color: "var(--text-primary)" }}>{f.confidence}%</div>
                <div className="text-center text-xs mono" style={{ color: "var(--text-primary)" }}>{f.effort}w</div>
                <div className="text-center">
                  <span className="text-sm font-bold mono" style={{ color: "var(--accent)" }}>{Math.round(f.riceScore)}</span>
                </div>
              </div>
              <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{f.description}</p>
              <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>{f.userStory}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-surface)", color: "var(--text-muted)" }}>{f.quarter}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Roadmap ── */}
      {tab === "roadmap" && (
        <div className="space-y-3 fade-in">
          {brief.roadmap.map((q: RoadmapQuarter, i: number) => (
            <div key={i} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{q.quarter}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase"
                      style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--accent-dim)" }}>
                      {q.theme}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Win: {q.successMetric}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {q.features.map((f: string, j: number) => (
                  <div key={j} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <ChevronRight size={13} style={{ color: "var(--accent)" }} className="flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── KPI Center ── */}
      {tab === "kpis" && (
        <div className="space-y-3 fade-in">
          {brief.kpis.map((k: KPI, i: number) => (
            <div key={i} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{k.name}</span>
                    <KPITypeBadge t={k.type} />
                  </div>
                </div>
                <div className="text-right">
                  {k.current && <div className="text-xs mono" style={{ color: "var(--text-muted)" }}>Now: {k.current}</div>}
                  <div className="text-lg font-bold mono" style={{ color: "var(--green)" }}>{k.target}</div>
                </div>
              </div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Measured by: {k.measurement}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── PRD ── */}
      {tab === "prd" && brief.prd && (
        <div className="space-y-4 fade-in">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={15} style={{ color: "var(--accent)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{brief.prd.feature}</span>
            </div>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{brief.prd.problemStatement}</p>

            <div className="space-y-4">
              {[
                { label: "User Stories", items: brief.prd.userStories, color: "var(--blue)" },
                { label: "Acceptance Criteria", items: brief.prd.acceptanceCriteria, color: "var(--green)" },
                { label: "Success Metrics", items: brief.prd.successMetrics, color: "var(--accent)" },
                { label: "Out of Scope (v1)", items: brief.prd.outOfScope, color: "var(--text-muted)" },
              ].map(({ label, items, color }) => (
                <div key={label}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>{label}</div>
                  <div className="space-y-1.5">
                    {(items ?? []).map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span className="flex-shrink-0 mt-0.5" style={{ color }}>•</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Experiments ── */}
      {tab === "experiments" && (
        <div className="space-y-3 fade-in">
          {brief.experiments.map((e: Experiment, i: number) => (
            <div key={i} className="card p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Beaker size={13} style={{ color: "var(--purple)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{e.name}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-surface)", color: "var(--text-muted)" }}>
                  {e.linkedFeature}
                </span>
              </div>
              <div className="p-3 rounded text-xs leading-relaxed" style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--accent)" }}>Hypothesis:</strong> {e.hypothesis}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div><div className="font-semibold mb-0.5" style={{ color: "var(--text-secondary)" }}>Variant</div><p style={{ color: "var(--text-muted)" }}>{e.variant}</p></div>
                <div><div className="font-semibold mb-0.5" style={{ color: "var(--text-secondary)" }}>Success Metric</div><p style={{ color: "var(--text-muted)" }}>{e.successMetric}</p></div>
                <div><div className="font-semibold mb-0.5" style={{ color: "var(--text-secondary)" }}>Rollout</div><p style={{ color: "var(--text-muted)" }}>{e.rolloutPlan}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Agent Trace ── */}
      {tab === "trace" && (
        <div className="card p-5 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={14} style={{ color: "var(--accent)" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>6-Agent Pipeline Execution</span>
            <span className="text-xs mono ml-auto" style={{ color: "var(--text-muted)" }}>{(brief.processingTimeMs / 1000).toFixed(1)}s total</span>
          </div>
          <AgentTrace steps={steps} />
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function App() {
  const [input, setInput] = useState("");
  const [context, setContext] = useState("Product team");
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePreset = (p: Preset) => {
    setInput(p.input);
    setContext(p.context);
    setActivePreset(p);
    setHasStarted(true);
    setResult(null);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setInput(text);
    setActivePreset(null);
    setHasStarted(true);
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, context }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Nav */}
      <nav style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <Cpu size={14} style={{ color: "var(--bg-primary)" }} />
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>ProductOS</span>
            <span className="text-xs px-1.5 py-0.5 rounded mono"
              style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--accent-dim)" }}>v1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>AI Operating System for Product Teams</span>
            <a href="https://regulated-ai.vercel.app" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg hidden sm:block"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              RegulatedAI →
            </a>
            <a href="https://executive-ai.vercel.app" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg hidden sm:block"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              ExecutiveAI →
            </a>
          </div>
        </div>
      </nav>

      {/* Page header */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>AI Operating System for Product Teams</h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                6-agent pipeline: Research → Opportunity + Prioritization → Strategy → PRD + Experiment
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { icon: <Search size={12}/>, label: "Pain Analysis", color: "var(--red)" },
                { icon: <TrendingUp size={12}/>, label: "RICE Scoring", color: "var(--green)" },
                { icon: <Map size={12}/>, label: "Roadmap", color: "var(--accent)" },
                { icon: <FileText size={12}/>, label: "PRD Generation", color: "var(--blue)" },
              ].map(({ icon, label, color }) => (
                <span key={label} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                  style={{ background: `${color}12`, border: `1px solid ${color}30`, color }}>
                  {icon}{label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {!hasStarted ? (
          <div className="max-w-2xl mx-auto">
            <EmptyState onPreset={handlePreset} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Preset pills */}
              <div className="space-y-1">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Scenarios:</p>
                {PRESETS.map(p => (
                  <button key={p.id} onClick={() => { handlePreset(p); setResult(null); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2"
                    style={{
                      background: activePreset?.id === p.id ? "var(--accent-glow)" : "var(--bg-card)",
                      border: `1px solid ${activePreset?.id === p.id ? "var(--accent-dim)" : "var(--border)"}`,
                      color: "var(--text-secondary)",
                    }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.tagColor }} />
                    {p.label}
                  </button>
                ))}
                <button onClick={() => { setHasStarted(false); setResult(null); setInput(""); setActivePreset(null); }}
                  className="text-xs px-2 py-1 rounded" style={{ color: "var(--text-muted)" }}>
                  ← back
                </button>
              </div>

              {/* Narrative callout */}
              {activePreset && !result && !loading && (
                <div className="p-3 rounded-xl flex items-start gap-2 fade-in"
                  style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}>
                  <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{activePreset.narrative}</p>
                </div>
              )}

              {/* Input */}
              <div className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                    Customer Input
                  </label>
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-all"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    <Upload size={11} /> Upload
                  </button>
                  <input ref={fileRef} type="file" accept=".txt,.md,.csv" className="hidden" onChange={handleFile} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--text-secondary)" }}>Product Context</label>
                  <input value={context} onChange={e => setContext(e.target.value)}
                    placeholder="e.g. B2B SaaS, Consumer App, Enterprise Fintech"
                    className="w-full rounded px-3 py-1.5 text-xs outline-none"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                </div>
                <textarea value={input} onChange={e => { setInput(e.target.value); setActivePreset(null); }}
                  rows={14} placeholder="Paste customer interviews, support tickets, NPS data, feature requests..."
                  className="w-full rounded-lg px-3 py-2 text-xs resize-none outline-none leading-relaxed"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)", fontFamily: "inherit" }} />
                <div className="flex items-center justify-between">
                  {(() => {
                    const wc = input.split(/\s+/).filter(Boolean).length;
                    const ready = !loading && wc >= 150;
                    const wcColor = wc === 0 ? "var(--text-muted)" : wc < 150 ? "var(--amber)" : "var(--green)";
                    return (
                      <>
                        <div>
                          <span className="text-xs mono" style={{ color: wcColor }}>{wc} words</span>
                          {wc > 0 && wc < 150 && (
                            <div className="text-xs mt-0.5" style={{ color: "var(--amber)" }}>
                              Add more context for better results — customer quotes and metrics produce the most accurate analysis
                            </div>
                          )}
                        </div>
                        <button onClick={handleAnalyze} disabled={!ready}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                          style={{
                            background: ready ? "var(--accent)" : "var(--bg-surface)",
                            color: ready ? "var(--bg-primary)" : "var(--text-muted)",
                          }}>
                          {loading ? <><span className="animate-spin inline-block">⟳</span> Running 6 agents...</> : <><Zap size={13} /> Build Product Brief</>}
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="lg:col-span-3">
              {loading && <Skeleton />}
              {!loading && result && <ProductBriefDashboard result={result} />}
              {!loading && !result && (
                <div className="card p-8 text-center space-y-2">
                  <Cpu size={28} className="mx-auto" style={{ color: "var(--text-muted)" }} />
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Ready to analyze</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Click "Build Product Brief" to run the 6-agent pipeline</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-12 py-5" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            ProductOS — Built by{" "}
            <a href="https://www.linkedin.com/in/rahulreddypuchakayala/" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}>Rahul Reddy</a>
            {" "}| Product Manager at Capital One |{" "}
            <a href="https://github.com/rahulreddyutd" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--accent)" }}>GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
